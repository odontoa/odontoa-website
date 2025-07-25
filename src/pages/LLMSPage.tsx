import { useEffect, useState } from 'react'
import { LLMSService } from '@/lib/llms'

const LLMSPage = () => {
  const [llmsContent, setLlmsContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLLMSContent = async () => {
      try {
        const content = await LLMSService.generateLLMSTxt()
        setLlmsContent(content)
      } catch (error) {
        console.error('Error loading LLMS content:', error)
        setLlmsContent('# Error loading LLMS content')
      } finally {
        setLoading(false)
      }
    }

    loadLLMSContent()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavam LLMS sadržaj...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Odontoa LLMS.txt
          </h1>
          <p className="text-gray-600 mb-6">
            Ovaj fajl sadrži sve javne URL-ove sajta Odontoa koji su dostupni za AI modele.
          </p>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {llmsContent}
            </pre>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Poslednje ažuriranje: {new Date().toLocaleString('sr-RS')}</p>
            <p>Broj URL-ova: {llmsContent.split('\n').filter(line => line.startsWith('https://')).length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LLMSPage 