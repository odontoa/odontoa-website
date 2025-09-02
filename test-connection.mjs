import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('blogs')
      .select('count', { count: 'exact', head: true })

    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }

    console.log('✅ Connection successful!')
    console.log('📊 Blog count:', data)
    
    // Test admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')

    if (adminError) {
      console.error('❌ Admin table access failed:', adminError.message)
    } else {
      console.log('✅ Admin table accessible')
      console.log('👥 Admin users:', adminData)
    }

    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Supabase connection working!')
    console.log('🌐 Admin panel should be accessible at: http://localhost:3000/admin-panel')
  } else {
    console.log('\n❌ Connection issues detected.')
  }
  process.exit(0)
}) 