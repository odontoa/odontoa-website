// DISABLED - Supabase removed, this script is no longer functional
console.log('⚠️  This script is disabled. Supabase has been removed from the project.');
process.exit(0);

/* DISABLED - Supabase removed
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
*/

async function resetAdminPassword() {
  try {
    console.log('🔧 Resetting admin password...')
    
    const email = 'ognjen.drinic31@gmail.com'
    const newPassword = 'TempPassword123!'
    
    // List users to find the admin user
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Error listing users:', usersError.message)
      return false
    }
    
    // Find our admin user
    const adminUser = users.users.find(u => u.email === email)
    
    if (!adminUser) {
      console.log('❌ Admin user not found')
      return false
    }
    
    console.log('✅ Found admin user:', adminUser.id)
    
    // Update user password
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { password: newPassword }
    )
    
    if (updateError) {
      console.error('❌ Error updating password:', updateError.message)
      return false
    }
    
    console.log('✅ Password updated successfully')
    
    // Test login with new password
    const anonClient = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k')
    
    const { data: loginData, error: loginError } = await anonClient.auth.signInWithPassword({
      email,
      password: newPassword
    })
    
    if (loginError) {
      console.error('❌ Login test failed:', loginError.message)
      return false
    }
    
    console.log('✅ Login test successful!')
    
    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

resetAdminPassword().then(success => {
  if (success) {
    console.log('\n🎉 Admin password reset successfully!')
    console.log('📧 Email: ognjen.drinic31@gmail.com')
    console.log('🔑 Password: TempPassword123!')
    console.log('🌐 Login at: http://localhost:3001/admin-panel')
  } else {
    console.log('\n❌ Failed to reset admin password.')
  }
  process.exit(0)
}) 