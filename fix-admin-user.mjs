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

async function fixAdminUser() {
  try {
    console.log('🔧 Fixing admin user...')
    
    const email = 'ognjen.drinic31@gmail.com'
    const password = 'TempPassword123!'
    
    // First, try to sign in to see if user exists
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      console.log('❌ Login failed:', loginError.message)
      
      // If user doesn't exist, create new one
      if (loginError.message.includes('Invalid login credentials')) {
        console.log('🆕 Creating new user...')
        
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signupError) {
          console.error('❌ Signup failed:', signupError.message)
          return false
        }

        console.log('✅ User created:', signupData.user.id)
        
        // Try to add to admin table (this might fail due to RLS)
        try {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .insert([
              {
                id: signupData.user.id,
                email: email,
                role: 'admin'
              }
            ])
            .select()

          if (adminError) {
            console.log('⚠️ Could not add to admin table (RLS restriction):', adminError.message)
            console.log('📝 You need to add this user manually to admin_users table:')
            console.log(`   ID: ${signupData.user.id}`)
            console.log(`   Email: ${email}`)
            console.log(`   Role: admin`)
          } else {
            console.log('✅ Added to admin table:', adminData)
          }
        } catch (e) {
          console.log('⚠️ Admin table insert failed:', e.message)
        }
        
        return true
      }
      
      return false
    }

    console.log('✅ Login successful!')
    console.log('👤 User ID:', loginData.user.id)
    
    // Check if user is in admin table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', loginData.user.id)
      .single()

    if (adminError) {
      console.log('⚠️ User not in admin table, trying to add...')
      
      try {
        const { data: insertData, error: insertError } = await supabase
          .from('admin_users')
          .insert([
            {
              id: loginData.user.id,
              email: email,
              role: 'admin'
            }
          ])
          .select()

        if (insertError) {
          console.log('❌ Could not add to admin table:', insertError.message)
          console.log('📝 You need to add this user manually to admin_users table:')
          console.log(`   ID: ${loginData.user.id}`)
          console.log(`   Email: ${email}`)
          console.log(`   Role: admin`)
        } else {
          console.log('✅ Added to admin table:', insertData)
        }
      } catch (e) {
        console.log('❌ Admin table insert failed:', e.message)
      }
    } else {
      console.log('✅ User already in admin table:', adminData)
    }
    
    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

fixAdminUser().then(success => {
  if (success) {
    console.log('\n🎉 Admin user setup completed!')
    console.log('📧 Email: ognjen.drinic31@gmail.com')
    console.log('🔑 Password: TempPassword123!')
    console.log('🌐 Login at: http://localhost:3001/admin-panel')
    console.log('\n⚠️ If you see RLS errors, you need to manually add the user to admin_users table in Supabase Dashboard')
  } else {
    console.log('\n❌ Failed to fix admin user.')
  }
  process.exit(0)
}) 