/**
 * Supabase client — Insulara
 * Server-side singleton using the publishable (anon) key.
 * Safe to use in Express routes — no user secrets exposed.
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase env vars.\n' +
    'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to your .env file.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,   // server — no cookie-based sessions
    autoRefreshToken: false,
  },
});

module.exports = supabase;
