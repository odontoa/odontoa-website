import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'
import { toast } from 'sonner'

// Custom Image extension with better styling
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: 'max-w-full h-auto rounded-lg shadow-md my-4',
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          return {
            class: attributes.class
          }
        }
      }
    }
  }
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onFocus?: () => void
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [linkUrl, setLinkUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  if (!editor) {
    return null
  }

  const setLink = () => {
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setShowLinkInput(false)
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    setShowLinkInput(false)
    setLinkUrl('')
    toast.success('Link dodat!')
  }

  const setImage = () => {
    if (imageUrl === '') {
      return
    }

    editor.chain().focus().setImage({ 
      src: imageUrl,
      class: 'max-w-full h-auto rounded-lg shadow-md my-4'
    }).run()
    setShowImageInput(false)
    setImageUrl('')
    toast.success('Slika dodata!')
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Molimo odaberite validnu sliku.')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Slika je prevelika. Maksimalna veličina je 5MB.')
      return
    }

    if (file.size < 1024) { // Minimum 1KB to avoid tiny test images
      toast.error('Slika je premala. Molimo odaberite veću sliku.')
      return
    }

    setUploadingImage(true)

    try {
      // Create FormData for API upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'editor-images')

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload greška')
      }

      if (!result.success) {
        throw new Error(result.error || 'Upload nije uspešan')
      }

      // Insert image into editor with proper styling
      editor.chain().focus().setImage({ 
        src: result.url,
        class: 'max-w-full h-auto rounded-lg shadow-md my-4'
      }).run()
      toast.success('Slika uspešno uploadovana!')
      
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error(error.message || 'Greška pri upload-u slike')
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div 
      className="border-b border-gray-200 p-4 bg-white rounded-t-lg flex flex-wrap gap-2 items-center"
    >
      {/* Basic formatting */}
      <Button
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>

      {/* Headings */}
      <Button
        variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="h-8 w-8 p-0"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="h-8 w-8 p-0"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className="h-8 w-8 p-0"
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      {/* Lists */}
      <Button
        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="h-8 w-8 p-0"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      {/* Quote */}
      <Button
        variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className="h-8 w-8 p-0"
      >
        <Quote className="h-4 w-4" />
      </Button>

      {/* Link */}
      <Button
        variant={editor.isActive('link') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setShowLinkInput(!showLinkInput)}
        className="h-8 w-8 p-0"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>

      {/* Image */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowImageInput(!showImageInput)}
        className="h-8 w-8 p-0"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      {/* File Upload */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
              handleImageUpload(file)
            }
          }
          input.click()
        }}
        disabled={uploadingImage}
        className="h-8 w-8 p-0"
      >
        {uploadingImage ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        ) : (
          <Upload className="h-4 w-4" />
        )}
      </Button>

      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0"
      >
        <Undo className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0"
      >
        <Redo className="h-4 w-4" />
      </Button>

      {/* Link Input */}
      {showLinkInput && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg w-full">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Unesite URL linka..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" onClick={setLink}>
              Dodaj
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowLinkInput(false)}
            >
              Otkaži
            </Button>
          </div>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg w-full">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Unesite URL slike..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" onClick={setImage}>
              Dodaj
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowImageInput(false)}
            >
              Otkaži
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Započnite pisanje...',
  className = '',
  onFocus
}) => {
  const [characterCount, setCharacterCount] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the link extension from StarterKit to avoid duplicate
        link: false,
      }),
      CustomImage,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer'
        }
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
      // Update character count (excluding HTML tags)
      const textContent = editor.getText()
      setCharacterCount(textContent.length)
    },
    onFocus: () => {
      setIsFocused(true)
      onFocus?.()
    },
    onBlur: () => {
      setIsFocused(false)
    },
    immediatelyRender: false,
  })

  // Update editor content when value changes externally
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
      const textContent = editor.getText()
      setCharacterCount(textContent.length)
    }
  }, [value, editor])

  return (
    <div 
      className={`border rounded-lg overflow-hidden ${
        isFocused ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300'
      } ${className}`}
    >
      <MenuBar editor={editor} />
      
      <EditorContent 
        editor={editor} 
        className="prose prose-lg max-w-none p-4 min-h-[200px] focus:outline-none"
        style={{
          '--tw-prose-body': '#374151',
          '--tw-prose-headings': '#111827',
          '--tw-prose-links': '#2563eb',
          '--tw-prose-bold': '#111827',
          '--tw-prose-counters': '#6b7280',
          '--tw-prose-bullets': '#d1d5db',
          '--tw-prose-hr': '#e5e7eb',
          '--tw-prose-quotes': '#111827',
          '--tw-prose-quote-borders': '#e5e7eb',
          '--tw-prose-captions': '#6b7280',
          '--tw-prose-code': '#111827',
          '--tw-prose-pre-code': '#e5e7eb',
          '--tw-prose-pre-bg': '#1f2937',
          '--tw-prose-th-borders': '#d1d5db',
          '--tw-prose-td-borders': '#e5e7eb',
        } as React.CSSProperties}
      />
      
      {/* Character count */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
        {characterCount} karaktera
      </div>
    </div>
  )
} 