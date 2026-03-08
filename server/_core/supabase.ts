import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY - using fallback');
}

export const supabase = createClient(
  supabaseUrl || 'https://fpiszghehrjmkbxhbwqr.supabase.co',
  supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaXN6Z2hlaHJqbWtieGhid3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzUwNDcsImV4cCI6MjA4MDI1MTA0N30.K7S7NtVrjOcW6vR_kmxG1KK2cpuYZDcGeuAremLJpSk'
);

console.log('[Supabase] Client initialized:', supabaseUrl ? 'with env vars' : 'with fallback');

// Service-Role-Client (bypasses RLS — only use server-side for mutations!)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseServiceKey
  ? createClient(
      supabaseUrl || 'https://fpiszghehrjmkbxhbwqr.supabase.co',
      supabaseServiceKey,
      { 
        auth: { 
          autoRefreshToken: false, 
          persistSession: false 
        } 
      }
    )
  : supabase; // Fallback to anon client (with warning)

if (!supabaseServiceKey) {
  console.warn('[Supabase] ⚠️  SUPABASE_SERVICE_ROLE_KEY missing — Server mutations will be blocked by RLS!');
} else {
  console.log('[Supabase] Service-Role client initialized for server mutations');
}
