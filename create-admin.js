import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bjbfmddrekjmactytaky.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ0MDU2MSwiZXhwIjoyMDY5MDE2NTYxfQ.LOppQx_xLdDW7Z7Brkvy6Vit8WFr9g6QrDZZEgVy49A'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    
    // Create the user in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'ognjen.drinic31@gmail.com',
      password: 'TempPassword123!', // Temporary password - user should change it
      email_confirm: true // Auto-confirm the email
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return
    }

    console.log('Auth user created:', authData.user.id)

    // Add the user to admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .insert({
        id: authData.user.id,
        email: 'ognjen.drinic31@gmail.com',
        role: 'admin'
      })

    if (adminError) {
      console.error('Error creating admin user:', adminError)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('Email: ognjen.drinic31@gmail.com')
    console.log('Temporary Password: TempPassword123!')
    console.log('🔗 Login at: http://localhost:3004/admin-panel')
    console.log('\n⚠️  Please change the password after first login!')

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createAdminUser() 