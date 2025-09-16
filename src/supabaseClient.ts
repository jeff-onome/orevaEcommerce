import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// IMPORTANT: These variables should be in your environment variables (.env file)
// For development, you can temporarily place them here, but it's not recommended for production.
const supabaseUrl = 'https://pwfxrtawqswspcdqellt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZnhydGF3cXN3c3BjZHFlbGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjg4OTgsImV4cCI6MjA3MzYwNDg5OH0.hE3mdssr7d-pt7pqrU8EFsr6q5WkfNXgFN_cGvLQWYo';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);