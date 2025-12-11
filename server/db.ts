/**
 * Database Module - Supabase Only
 * 
 * All database operations use Supabase PostgreSQL.
 * This file re-exports everything from the Supabase adapter.
 */

// Re-export everything from Supabase adapter
export * from './db-supabase';

// Also export the supabase client for direct access
export { supabase } from './_core/supabase';

console.log('[Database] Using Supabase PostgreSQL');
