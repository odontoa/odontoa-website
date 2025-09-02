import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function resetPassword() {
  try {
    console.log('📧 Sending password reset email...')
    
    const email = 'ognjen.drinic31@gmail.com'
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3001/reset-password'
    })

    if (error) {
      console.error('❌ Password reset failed:', error.message)
      return false
    }

    console.log('✅ Password reset email sent!')
    console.log('📧 Check your email: ognjen.drinic31@gmail.com')
    console.log('🔗 Click the link in the email to reset your password')
    
    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

resetPassword().then(success => {
  if (success) {
    console.log('\n🎉 Password reset initiated!')
    console.log('📝 Next steps:')
    console.log('1. Check your email')
    console.log('2. Click the reset link')
    console.log('3. Set a new password')
    console.log('4. Try logging in again')
  } else {
    console.log('\n❌ Failed to send password reset.')
  }
  process.exit(0)
}) 