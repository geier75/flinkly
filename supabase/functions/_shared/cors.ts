/**
 * CORS Headers für Supabase Edge Functions
 * Dynamisch basierend auf Origin für Credentials-Support
 */

const ALLOWED_ORIGINS = [
  'https://flinkly.eu',
  'https://www.flinkly.eu',
  'https://flinkly.vercel.app',
  'https://flinkly-bemlerinhos-projects.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  
  // Allow any Vercel preview URL for this project
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || 
    origin.includes('flinkly') && origin.includes('vercel.app');
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// DEPRECATED: Do not use corsHeaders directly - use getCorsHeaders(req) instead
// This export is kept for backwards compatibility but will be removed in future versions
/** @deprecated Use getCorsHeaders(req) for proper origin validation */
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://flinkly.eu',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }
  return null;
}
