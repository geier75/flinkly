/**
 * Response Helpers für Edge Functions
 */

import { corsHeaders } from './cors.ts';

export function jsonResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function errorResponse(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function unauthorizedResponse(message = 'Unauthorized'): Response {
  return errorResponse(message, 401);
}

export function notFoundResponse(message = 'Not found'): Response {
  return errorResponse(message, 404);
}
