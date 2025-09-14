
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// IMPORTANT: These variables should be in your environment variables (.env file)
// For development, you can temporarily place them here, but it's not recommended for production.
const supabaseUrl = 'https://ptngrrzbugznvfmhljuz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0bmdycnpidWd6bnZmbWhsanV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4Mzg2MzQsImV4cCI6MjA3MzQxNDYzNH0.jHXB6KYIORQxLnx14cLs0ZYYNCxZt-eUEsGp-35QVKI';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

// FIX: A TypeError: Failed to fetch error often indicates a network issue, which can sometimes be
// caused by browser extensions (like ad-blockers) or strict caching policies.
// By providing a custom fetch with `cache: 'no-store'`, we explicitly tell the browser
// to bypass any caches and make a direct network request, which can resolve these types of issues.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
        fetch: (input, init) => {
            // Explicitly set cache policy to avoid issues with browser extensions or proxies.
            return fetch(input, { ...init, cache: 'no-store' });
        }
    }
});