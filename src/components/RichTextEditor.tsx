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
import { supabase } from '@/lib/supabase'

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

    editor.chain().focus().setImage({ src: imageUrl }).run()
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

    setUploadingImage(true)

    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets()
      const blogImagesBucket = buckets?.find(bucket => bucket.name === 'blog-images')
      
      if (!blogImagesBucket) {
        // Try to create bucket
        const { error: createError } = await supabase.storage.createBucket('blog-images', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 5242880
        })
        
        if (createError) {
          throw new Error('Greška pri kreiranju storage bucket-a. Molimo kontaktirajte administratora.')
        }
      }

      const fileName = `editor-images/${Date.now()}-${file.name}`
      
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw new Error(`Upload greška: ${error.message}`)
      }

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

      // Insert image into editor
      editor.chain().focus().setImage({ src: publicUrl }).run()
      toast.success('Slika uspešno uploadovana!')
      
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error(error.message || 'Greška pri upload-u slike')
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="border-b border-gray-200 p-4 bg-white rounded-t-lg">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive('bold') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="h-8 px-2 text-xs"
          >
            H1
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="h-8 px-2 text-xs"
          >
            H2
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className="h-8 px-2 text-xs"
          >
            H3
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Quote */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive('blockquote') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="h-8 w-8 p-0"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        {/* Links and Images */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className="h-8 w-8 p-0"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImageInput(!showImageInput)}
            className="h-8 w-8 p-0"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
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
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Slash Commands */}
        <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              editor.chain().focus().setHorizontalRule().run()
              toast.success('Separator dodat!')
            }}
            className="h-8 px-2 text-xs"
          >
            /separator
          </Button>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Unesite URL..."
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
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
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
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the link extension from StarterKit to avoid duplicate
        link: false,
      }),
      Image,
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
      onFocus?.()
    },
    immediatelyRender: false,
  })

  // Update character count when value changes externally
  React.useEffect(() => {
    if (editor) {
      const textContent = editor.getText()
      setCharacterCount(textContent.length)
    }
  }, [value, editor])

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <MenuBar editor={editor} />
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-4 min-h-[300px] cursor-text [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:focus:ring-0 [&_.ProseMirror]:border-0"
        />
        {/* Character count */}
        <div className="absolute bottom-2 right-4 text-xs text-gray-500 bg-white px-2 py-1 rounded">
          Karaktera: {characterCount}
        </div>
      </div>
    </div>
  )
} 