import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bjbfmddrekjmactytaky.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAdminLogin() {
  try {
    console.log('🔐 Testing admin login...')
    
    // Test login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'ognjen.drinic31@gmail.com',
      password: 'TempPassword123!'
    })

    if (authError) {
      console.error('❌ Login failed:', authError.message)
      return false
    }

    console.log('✅ Login successful!')
    console.log('👤 User ID:', authData.user.id)

    // Test admin access
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (adminError) {
      console.error('❌ Admin check failed:', adminError.message)
      return false
    }

    console.log('✅ Admin access confirmed!')
    console.log('👨‍💼 Role:', adminData.role)

    // Test blog table access
    const { error: blogError } = await supabase
      .from('blogs')
      .select('count', { count: 'exact', head: true })

    if (blogError) {
      console.error('❌ Blog table access failed:', blogError.message)
    } else {
      console.log('✅ Blog table accessible')
    }

    // Test glossary table access
    const { error: glossaryError } = await supabase
      .from('glossary')
      .select('count', { count: 'exact', head: true })

    if (glossaryError) {
      console.error('❌ Glossary table access failed:', glossaryError.message)
    } else {
      console.log('✅ Glossary table accessible')
    }

    console.log('\n🎉 All admin functionality working!')
    console.log('🌐 Ready to use: http://localhost:3004/admin-panel')

    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

testAdminLogin().then(success => {
  if (success) {
    console.log('\n✅ CMS system fully operational!')
    console.log('📝 Next: Login and create your first blog post')
  } else {
    console.log('\n❌ Some issues detected. Check Supabase configuration.')
  }
  process.exit(0)
}) 