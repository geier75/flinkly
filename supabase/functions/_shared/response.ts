/**
 * Response Helpers für Edge Functions
 */

import { getCorsHeaders } from './cors.ts';

// Store current request for CORS headers
let currentRequest: Request | null = null;

export function setCurrentRequest(req: Request) {
  currentRequest = req;
}

function getHeaders(): Record<string, string> {
  const corsHeaders = currentRequest ? getCorsHeaders(currentRequest) : {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };
  return { ...corsHeaders, 'Content-Type': 'application/json' };
}

export function jsonResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: getHeaders(),
  });
}

export function errorResponse(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: getHeaders(),
  });
}

export function unauthorizedResponse(message = 'Unauthorized'): Response {
  return errorResponse(message, 401);
}

export function notFoundResponse(message = 'Not found'): Response {
  return errorResponse(message, 404);
}
