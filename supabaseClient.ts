import { createClient } from '@supabase/supabase-js';
import { Database } from './src/types';
import { rememberMeStorage } from './src/storage';

const supabaseUrl = 'https://yuewdegzllrbwgxvkoxf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1ZXdkZWd6bGxyYndneHZrb3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MzA1MTQsImV4cCI6MjA3MzUwNjUxNH0.7DqUSZuqKlZurtoGxQ6J4wAs55fhg6fYguComyqXx9Q';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

const customFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    return fetch(input, {
        ...init,
        cache: 'no-store'
    });
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    db: {
        schema: 'public',
    },
    auth: {
      storage: rememberMeStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: customFetch
    }
});