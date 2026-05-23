/**
 * Supabase client — Insulara
 * Server-side singleton using the publishable (anon) key.
 * Returns null gracefully if env vars are not set (site stays up).
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let supabase = null;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase] WARNING: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ' +
    'is not set. Database features (contact form saving, testimonials) will be disabled ' +
    'until these env vars are added to your hosting platform.'
  );
} else {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

module.exports = supabase;
