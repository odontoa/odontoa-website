// DISABLED - Supabase removed, this script is no longer functional
console.log('⚠️  This script is disabled. Supabase has been removed from the project.');
process.exit(0);

/* DISABLED - Supabase removed
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)
*/

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...')
    
    const email = 'ognjen.drinic31@gmail.com'
    const password = 'TempPassword123!'
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error('❌ Auth signup failed:', authError.message)
      return false
    }

    console.log('✅ User created in Auth:', authData.user.id)
    
    // Add user to admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .insert([
        {
          id: authData.user.id,
          email: email,
          role: 'admin'
        }
      ])
      .select()

    if (adminError) {
      console.error('❌ Admin table insert failed:', adminError.message)
      return false
    }

    console.log('✅ User added to admin_users table:', adminData)
    
    // Test login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
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

createAdminUser().then(success => {
  if (success) {
    console.log('\n🎉 Admin user created successfully!')
    console.log('📧 Email: ognjen.drinic31@gmail.com')
    console.log('🔑 Password: TempPassword123!')
    console.log('🌐 Login at: http://localhost:3001/admin-panel')
  } else {
    console.log('\n❌ Failed to create admin user.')
  }
  process.exit(0)
}) 