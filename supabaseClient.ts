import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// IMPORTANT: These variables should be in your environment variables (.env file)
// For development, you can temporarily place them here, but it's not recommended for production.
const supabaseUrl = 'https://nueyjpefthtreamvazwg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXlqcGVmdGh0cmVhbXZhendnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NTI4MjEsImV4cCI6MjA3MzMyODgyMX0.hYWtoRt2HlU4SH-czafAQeS4hPPXgjwBjc-xXESZEus';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);