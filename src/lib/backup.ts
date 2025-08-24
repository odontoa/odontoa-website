import { supabase } from './supabase'

export interface BackupData {
  blogs: any[]
  glossary: any[]
  metadata: {
    exportDate: string
    totalBlogs: number
    totalGlossaryTerms: number
    version: string
  }
}

export const generateBackup = async (): Promise<BackupData> => {
  try {
    // Fetch all blogs
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })

    if (blogsError) {
      throw new Error(`Greška pri učitavanju blogova: ${blogsError.message}`)
    }

    // Fetch all glossary terms
    const { data: glossary, error: glossaryError } = await supabase
      .from('glossary')
      .select('*')
      .order('created_at', { ascending: false })

    if (glossaryError) {
      throw new Error(`Greška pri učitavanju rečnika: ${glossaryError.message}`)
    }

    const backupData: BackupData = {
      blogs: blogs || [],
      glossary: glossary || [],
      metadata: {
        exportDate: new Date().toISOString(),
        totalBlogs: blogs?.length || 0,
        totalGlossaryTerms: glossary?.length || 0,
        version: '1.0.0'
      }
    }

    return backupData
  } catch (error) {
    console.error('Backup error:', error)
    throw error
  }
}

export const downloadBackup = async (format: 'json' | 'zip' = 'json') => {
  try {
    const backupData = await generateBackup()
    
    if (format === 'json') {
      // Download as JSON
      const dataStr = JSON.stringify(backupData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `odontoa-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      // Download as ZIP (requires JSZip library)
      // For now, we'll use JSON format
      await downloadBackup('json')
    }
    
    return true
  } catch (error) {
    console.error('Download backup error:', error)
    throw error
  }
}

export const getBackupStats = async () => {
  try {
    const { count: blogsCount } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })

    const { count: glossaryCount } = await supabase
      .from('glossary')
      .select('*', { count: 'exact', head: true })

    return {
      blogs: blogsCount || 0,
      glossary: glossaryCount || 0,
      total: (blogsCount || 0) + (glossaryCount || 0)
    }
  } catch (error) {
    console.error('Backup stats error:', error)
    return { blogs: 0, glossary: 0, total: 0 }
  }
} 