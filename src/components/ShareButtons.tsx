import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  Share2, 
  Twitter, 
  Linkedin, 
  Facebook,
  Link as LinkIcon
} from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonsProps {
  title: string
  url: string
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const shareData = {
    title: title,
    url: url,
    text: `Pročitajte: ${title}`
  }

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedinUrl, '_blank', 'width=600,height=400')
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link kopiran u clipboard!')
    } catch (error) {
      toast.error('Greška pri kopiranju linka')
    }
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      copyLink()
    }
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Podelite članak
        </h3>
      </div>

      <div className="space-y-3">
        {/* Native Share Button */}
        <Button
          onClick={nativeShare}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Podelite
        </Button>

        {/* Social Media Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={shareOnTwitter}
            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
          >
            <Twitter className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareOnLinkedIn}
            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
          >
            <Linkedin className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareOnFacebook}
            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
          >
            <Facebook className="h-4 w-4" />
          </Button>
        </div>

        {/* Copy Link Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={copyLink}
          className="w-full text-gray-600 hover:text-gray-900"
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          Kopiraj link
        </Button>
      </div>
    </div>
  )
} 