import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fpiszghehrjmkbxhbwqr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaXN6Z2hlaHJqbWtieGhid3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzUwNDcsImV4cCI6MjA4MDI1MTA0N30.K7S7NtVrjOcW6vR_kmxG1KK2cpuYZDcGeuAremLJpSk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('[Supabase] Client initialized for frontend');
