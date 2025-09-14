
import { createClient } from '@supabase/supabase-js';
import { Database } from './src/types';

// IMPORTANT: These variables should be in your environment variables (.env file)
// For development, you can temporarily place them here, but it's not recommended for production.
const supabaseUrl = 'https://yossfhruqtbzdcdtncxn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvc3NmaHJ1cXRiemRjZHRuY3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MjkyODQsImV4cCI6MjA3MzQwNTI4NH0.Lc5Ey7RjqeIvw0tjTymRFO8vDfx6sIzFUUbzX4c50z8';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);