import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bjbfmddrekjmactytaky.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k';

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