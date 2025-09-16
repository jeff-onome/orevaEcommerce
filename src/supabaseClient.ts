import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// IMPORTANT: These variables should be in your environment variables (.env file)
// For development, you can temporarily place them here, but it's not recommended for production.
const supabaseUrl = 'https://yuewdegzllrbwgxvkoxf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1ZXdkZWd6bGxyYndneHZrb3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MzA1MTQsImV4cCI6MjA3MzUwNjUxNH0.7DqUSZuqKlZurtoGxQ6J4wAs55fhg6fYguComyqXx9Q';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);