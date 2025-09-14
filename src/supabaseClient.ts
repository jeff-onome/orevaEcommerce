
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// IMPORTANT: These variables should be in your environment variables (.env file)
// For development, you can temporarily place them here, but it's not recommended for production.
const supabaseUrl = 'https://kxohmvimbnnmotewfzwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4b2htdmltYm5ubW90ZXdmendiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MjAzMTgsImV4cCI6MjA3MzM5NjMxOH0.BRB-LwmD-g7-6d3mYGQYLUqPbkUFN1GXy9N_qUP1BaI';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);