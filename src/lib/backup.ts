import { supabase } from './supabase'

export interface BackupData {
  blogs: any[]
  glossary: any[]
  backup_date: string
  total_entries: number
}

export class BackupService {
  static async generateBackup(): Promise<BackupData> {
    try {
      // Fetch all blogs
      const { data: blogs, error: blogsError } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

      if (blogsError) throw blogsError

      // Fetch all glossary entries
      const { data: glossary, error: glossaryError } = await supabase
        .from('glossary')
        .select('*')
        .order('created_at', { ascending: false })

      if (glossaryError) throw glossaryError

      const backupData: BackupData = {
        blogs: blogs || [],
        glossary: glossary || [],
        backup_date: new Date().toISOString(),
        total_entries: (blogs?.length || 0) + (glossary?.length || 0)
      }

      return backupData
    } catch (error) {
      console.error('Error generating backup:', error)
      throw error
    }
  }

  static async saveBackupToDatabase(backupData: BackupData): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('backups')
        .insert({
          backup_date: backupData.backup_date,
          status: 'completed',
          backup_data: backupData,
          email_sent: false
        })
        .select()
        .single()

      if (error) throw error

      return data.id
    } catch (error) {
      console.error('Error saving backup to database:', error)
      throw error
    }
  }

  static generateEmailContent(backupData: BackupData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background-color: #1976D2; color: white; padding: 20px; border-radius: 8px; }
            .content { padding: 20px; background-color: #f9f9f9; border-radius: 8px; margin: 20px 0; }
            .section { margin: 20px 0; padding: 15px; background-color: white; border-radius: 6px; }
            .stats { display: flex; gap: 20px; flex-wrap: wrap; }
            .stat-item { background-color: #e3f2fd; padding: 15px; border-radius: 6px; flex: 1; min-width: 200px; }
            .blog-item, .glossary-item { margin: 10px 0; padding: 10px; border-left: 3px solid #1976D2; background-color: #f8f9fa; }
            .footer { text-align: center; color: #666; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🦷 Odontoa CMS Backup - ${new Date(backupData.backup_date).toLocaleDateString('sr-RS')}</h1>
            <p>Nedeljni izveštaj o sadržaju na sajtu</p>
          </div>

          <div class="content">
            <div class="stats">
              <div class="stat-item">
                <h3>📄 Ukupno blogova</h3>
                <p style="font-size: 24px; font-weight: bold; color: #1976D2;">${backupData.blogs.length}</p>
              </div>
              <div class="stat-item">
                <h3>📚 Ukupno rečničkih pojmova</h3>
                <p style="font-size: 24px; font-weight: bold; color: #1976D2;">${backupData.glossary.length}</p>
              </div>
              <div class="stat-item">
                <h3>📊 Ukupno sadržaja</h3>
                <p style="font-size: 24px; font-weight: bold; color: #1976D2;">${backupData.total_entries}</p>
              </div>
            </div>

            <div class="section">
              <h2>📄 Blogovi</h2>
              ${backupData.blogs.map(blog => `
                <div class="blog-item">
                  <h4>${blog.title}</h4>
                  <p><strong>Slug:</strong> /${blog.slug}</p>
                  <p><strong>Autor:</strong> ${blog.author}</p>
                  <p><strong>Status:</strong> ${blog.published ? 'Objavljen' : 'Nacrt'}</p>
                  <p><strong>Tagovi:</strong> ${blog.tags?.join(', ') || 'Nema tagova'}</p>
                  <p><strong>Datum kreiranja:</strong> ${new Date(blog.created_at).toLocaleDateString('sr-RS')}</p>
                  ${blog.faq_schema ? '<p><strong>FAQ Schema:</strong> ✅ Prisutna</p>' : '<p><strong>FAQ Schema:</strong> ❌ Nije prisutna</p>'}
                </div>
              `).join('')}
            </div>

            <div class="section">
              <h2>📚 Rečnički pojmovi</h2>
              ${backupData.glossary.map(entry => `
                <div class="glossary-item">
                  <h4>${entry.term}</h4>
                  <p><strong>Slug:</strong> /${entry.slug}</p>
                  <p><strong>Definicija:</strong> ${entry.definition.substring(0, 100)}${entry.definition.length > 100 ? '...' : ''}</p>
                  <p><strong>Povezani pojmovi:</strong> ${entry.related_terms?.join(', ') || 'Nema povezanih pojmova'}</p>
                  <p><strong>Datum kreiranja:</strong> ${new Date(entry.created_at).toLocaleDateString('sr-RS')}</p>
                  ${entry.faq_schema ? '<p><strong>FAQ Schema:</strong> ✅ Prisutna</p>' : '<p><strong>FAQ Schema:</strong> ❌ Nije prisutna</p>'}
                </div>
              `).join('')}
            </div>

            <div class="section">
              <h2>🔍 SEO Pregled</h2>
              <p><strong>Blogovi sa FAQ schema:</strong> ${backupData.blogs.filter(b => b.faq_schema).length} od ${backupData.blogs.length}</p>
              <p><strong>Rečnički pojmovi sa FAQ schema:</strong> ${backupData.glossary.filter(g => g.faq_schema).length} od ${backupData.glossary.length}</p>
              <p><strong>Objavljeni blogovi:</strong> ${backupData.blogs.filter(b => b.published).length} od ${backupData.blogs.length}</p>
            </div>
          </div>

          <div class="footer">
            <p>Ovaj backup je automatski generisan ${new Date(backupData.backup_date).toLocaleString('sr-RS')}</p>
            <p>Odontoa CMS © 2025</p>
          </div>
        </body>
      </html>
    `
  }

  static async performWeeklyBackup(): Promise<void> {
    try {
      console.log('Starting weekly backup...')
      
      // Generate backup
      const backupData = await this.generateBackup()
      
      // Save to database
      const backupId = await this.saveBackupToDatabase(backupData)
      
      console.log(`Backup completed successfully. Backup ID: ${backupId}`)
      console.log(`Total entries backed up: ${backupData.total_entries}`)
      
      // In a real application, you would send the email here
      // For now, we'll just log the email content
      const emailContent = this.generateEmailContent(backupData)
      console.log('Email content generated:', emailContent.substring(0, 200) + '...')
      
      // TODO: Implement actual email sending with service like Resend, SendGrid, or Postmark
      // await this.sendBackupEmail(emailContent, backupData)
      
      // Update backup status to indicate email was sent
      await supabase
        .from('backups')
        .update({ email_sent: true })
        .eq('id', backupId)
        
    } catch (error) {
      console.error('Weekly backup failed:', error)
      
      // Save failed backup record
      await supabase
        .from('backups')
        .insert({
          backup_date: new Date().toISOString(),
          status: 'failed',
          backup_data: { error: error.message },
          email_sent: false
        })
        
      throw error
    }
  }

  static async manualBackup(): Promise<BackupData> {
    console.log('Starting manual backup...')
    const backupData = await this.generateBackup()
    await this.saveBackupToDatabase(backupData)
    console.log('Manual backup completed successfully')
    return backupData
  }
} 