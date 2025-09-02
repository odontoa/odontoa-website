import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const email = process.argv[2] || 'ognjen.drinic31@gmail.com';
const redirectTo = process.env.RESET_REDIRECT_TO || 'http://localhost:3000/reset-password';

async function main() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('📧 Sending reset password email to', email);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  if (error) {
    console.error('❌ Failed to send reset email:', error.message);
    process.exit(1);
  }
  console.log('✅ Reset email sent. Check inbox/spam.');
}

main(); 