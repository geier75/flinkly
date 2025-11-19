/**
 * Email-Service mit Nodemailer
 * 
 * Sendet transaktionale E-Mails (Order-Confirmations, Notifications, Alerts).
 * 
 * Setup:
 * 1. SMTP-Credentials in .env konfigurieren:
 *    - SMTP_HOST (z.B. smtp.gmail.com, smtp.sendgrid.net)
 *    - SMTP_PORT (587 für TLS, 465 für SSL)
 *    - SMTP_USER (E-Mail-Adresse oder API-Key)
 *    - SMTP_PASS (Passwort oder API-Secret)
 *    - SMTP_FROM (Absender-E-Mail, z.B. "Flinkly <noreply@flinkly.de>")
 * 
 * 2. Gmail-Nutzer: "App-Passwort" erstellen (nicht normales Passwort!)
 *    https://myaccount.google.com/apppasswords
 * 
 * 3. SendGrid/Mailgun: API-Key als SMTP_USER verwenden
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

/**
 * Initialize SMTP transporter (lazy initialization)
 */
function getTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('[Email] SMTP not configured - emails will not be sent');
    console.warn('[Email] Set SMTP_HOST, SMTP_USER, SMTP_PASS in environment');
    
    // Return mock transporter for development
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    });
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  console.log(`[Email] SMTP configured: ${smtpHost}:${smtpPort}`);
  return transporter;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string; // Plain-text fallback
}

/**
 * Send email via SMTP
 * 
 * @param options - Email options (to, subject, html, text)
 * @returns Success status
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transport = getTransporter();
    const from = process.env.SMTP_FROM || 'Flinkly <noreply@flinkly.de>';

    const info = await transport.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text fallback
    });

    console.log(`[Email] Sent to ${options.to}: ${options.subject} (${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`[Email] Failed to send to ${options.to}:`, error);
    return false;
  }
}

/**
 * Check if SMTP is configured
 */
export function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}
