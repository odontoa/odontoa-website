import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bjbfmddrekjmactytaky.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('blogs')
      .select('count', { count: 'exact', head: true })

    if (error) {
      console.error('❌ Connection error:', error.message)
      return false
    }

    console.log('✅ Supabase connection successful!')
    console.log('📊 Blogs table accessible')
    
    // Test if tables exist
    const tables = ['blogs', 'glossary', 'admin_users', 'backups']
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true })
        
        if (tableError) {
          console.log(`❌ Table ${table}: ${tableError.message}`)
        } else {
          console.log(`✅ Table ${table}: accessible`)
        }
      } catch (e) {
        console.log(`❌ Table ${table}: ${e.message}`)
      }
    }

    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 All systems ready!')
    console.log('📝 Next steps:')
    console.log('1. Create admin user in Supabase Dashboard')
    console.log('2. Add user to admin_users table')  
    console.log('3. Test login at http://localhost:3000/admin-panel')
  } else {
    console.log('\n❌ Connection failed. Check your Supabase configuration.')
  }
  process.exit(0)
}) 