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

async function addAdminUser() {
  try {
    console.log('🔧 Adding admin user with service role...')
    
    // First, check if user exists in auth
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Error listing users:', usersError.message)
      return false
    }
    
    console.log('👥 Found users:', users.users.length)
    
    // Find our admin user
    const adminUser = users.users.find(u => u.email === 'ognjen.drinic31@gmail.com')
    
    if (!adminUser) {
      console.log('❌ Admin user not found in auth system')
      return false
    }
    
    console.log('✅ Found admin user:', adminUser.id)
    
    // Add to admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .insert([
        {
          id: adminUser.id,
          email: adminUser.email,
          role: 'admin',
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (adminError) {
      console.error('❌ Error adding to admin_users:', adminError.message)
      return false
    }

    console.log('✅ Successfully added to admin_users:', adminData)
    
    // Verify it was added
    const { data: verifyData, error: verifyError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', adminUser.id)

    if (verifyError) {
      console.error('❌ Error verifying:', verifyError.message)
      return false
    }

    console.log('✅ Verification successful:', verifyData)
    
    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

addAdminUser().then(success => {
  if (success) {
    console.log('\n🎉 Admin user successfully added!')
    console.log('📧 Email: ognjen.drinic31@gmail.com')
    console.log('🔑 Password: TempPassword123!')
    console.log('🌐 Login at: http://localhost:3001/admin-panel')
  } else {
    console.log('\n❌ Failed to add admin user.')
  }
  process.exit(0)
}) 