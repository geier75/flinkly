/**
 * Sentry Error-Tracking Integration
 * 
 * Captures und tracked Errors, Exceptions und Performance-Metriken.
 * 
 * Setup:
 * 1. Sentry-Projekt erstellen: https://sentry.io
 * 2. DSN in .env konfigurieren:
 *    - SENTRY_DSN (z.B. https://xxx@yyy.ingest.sentry.io/zzz)
 *    - SENTRY_ENVIRONMENT (z.B. production, staging, development)
 * 
 * Features:
 * - Automatic Error-Capture (Unhandled Exceptions, Promise-Rejections)
 * - Performance-Monitoring (Transaction-Tracking)
 * - User-Context (User-ID, E-Mail)
 * - Breadcrumbs (Event-History vor Error)
 */

import * as Sentry from '@sentry/node';

let sentryInitialized = false;

/**
 * Initialize Sentry (call once at server startup)
 */
export function initSentry(): void {
  const dsn = process.env.SENTRY_DSN;
  
  if (!dsn) {
    console.warn('[Sentry] Not configured - errors will not be tracked');
    console.warn('[Sentry] Set SENTRY_DSN in environment to enable error tracking');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || 'production',
    
    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% of transactions
    
    // Error Sampling
    sampleRate: 1.0, // 100% of errors
    
    // Release Tracking
    release: process.env.npm_package_version || 'unknown',
    
    // Integrations
    integrations: [
      // HTTP Instrumentation
      Sentry.httpIntegration(),
    ],
    
    // Filter out sensitive data
    beforeSend(event, hint) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
      
      // Remove sensitive query params
      if (event.request?.query_string && typeof event.request.query_string === 'string') {
        const sanitized = event.request.query_string
          .replace(/password=[^&]*/gi, 'password=[REDACTED]')
          .replace(/token=[^&]*/gi, 'token=[REDACTED]');
        event.request.query_string = sanitized;
      }
      
      return event;
    },
  });

  sentryInitialized = true;
  console.log(`[Sentry] Initialized (environment: ${process.env.SENTRY_ENVIRONMENT || 'production'})`);
}

/**
 * Check if Sentry is configured
 */
export function isSentryConfigured(): boolean {
  return sentryInitialized;
}

/**
 * Capture exception manually
 */
export function captureException(error: Error, context?: Record<string, any>): void {
  if (!sentryInitialized) {
    console.error('[Sentry] Error captured (Sentry not configured):', error);
    return;
  }

  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture message (non-error events)
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  if (!sentryInitialized) {
    console.log(`[Sentry] Message captured (Sentry not configured): ${message}`);
    return;
  }

  Sentry.captureMessage(message, level);
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id: number; email?: string; name?: string } | null): void {
  if (!sentryInitialized) return;

  if (user) {
    Sentry.setUser({
      id: user.id.toString(),
      email: user.email,
      username: user.name,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb (event history)
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>): void {
  if (!sentryInitialized) return;

  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
}

/**
 * Start performance span
 */
export function startSpan(name: string, op: string, callback: () => any): any {
  if (!sentryInitialized) return callback();

  return Sentry.startSpan({
    name,
    op,
  }, callback);
}

/**
 * Flush Sentry events (call before server shutdown)
 */
export async function flushSentry(): Promise<void> {
  if (!sentryInitialized) return;

  await Sentry.close(2000); // 2 second timeout
  console.log('[Sentry] Flushed and closed');
}
