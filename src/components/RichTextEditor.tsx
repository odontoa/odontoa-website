import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CodeBlock from '@tiptap/extension-code-block'
import FontFamily from '@tiptap/extension-font-family'
import FontSize from '@tiptap/extension-font-size'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading2, 
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  Strikethrough,
  Code,
  Table as TableIcon,
  X,
  MoreHorizontal,
  Type,
  Palette,
  Highlighter
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
  blogSlug?: string
}

const MenuBar = ({ editor, blogSlug }: { editor: any; blogSlug?: string }) => {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showTablePopup, setShowTablePopup] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

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

  const insertTable = () => {
    editor.chain().focus().insertTable({ 
      rows: tableRows, 
      cols: tableCols, 
      withHeaderRow: true 
    }).run()
    setShowTablePopup(false)
    toast.success('Tabela dodata!')
  }

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run()
    toast.success('Formatiranje očišćeno!')
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
      // All rich text editor images go to blog-content folder
      const uploadFolder = 'blog-content'
      
      // Create FormData for API upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', uploadFolder)

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
        alt: file.name
      }).run()
      
      const folderInfo = blogSlug ? `u blog-content/${blogSlug}` : 'u editor-images'
      toast.success(`Slika uspešno uploadovana ${folderInfo}!`)
      
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error(error.message || 'Greška pri upload-u slike')
    } finally {
      setUploadingImage(false)
    }
  }

  const fontSizes = [
    { label: 'Small', size: '14px' },
    { label: 'Normal', size: '16px' },
    { label: 'Lead', size: '18px' }
  ]

  const fonts = [
    { label: 'Inter', font: 'Inter, system-ui, -apple-system, sans-serif' },
    { label: 'Manrope', font: 'Manrope, system-ui, sans-serif' },
    { label: 'Merriweather', font: 'Merriweather, serif' }
  ]

  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-3 rounded-t-lg shadow-sm">
      {/* Row 1: Primary Tools */}
      <div className="flex flex-wrap gap-2 items-center mb-3">
        {/* History */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Format */}
        <div className="flex items-center gap-1">
          <Button
            variant={editor.isActive('bold') ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('underline') ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Underline (Ctrl+U)"
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Links */}
        <div className="flex items-center gap-1">
          <Button
            variant={editor.isActive('link') ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Link (Ctrl+K)"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Unlink"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <Button
            variant={editor.isActive('heading', { level: 2 }) ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 3 }) ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            variant={editor.isActive('bulletList') ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Quote */}
        <Button
          variant={editor.isActive('blockquote') ? 'outline' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Insert */}
        <div className="flex items-center gap-1">
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
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Upload Image"
          >
            {uploadingImage ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTablePopup(!showTablePopup)}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Insert Table"
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Colors */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Text Color"
          >
            <Palette className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Clear */}
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFormatting}
          className="h-8 px-3 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-700"
          title="Clear Formatting"
        >
          Clear
        </Button>
      </div>

      {/* Row 2: Secondary Tools */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Font Controls */}
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => {
              const font = e.target.value
              editor.chain().focus().setFontFamily(font).run()
            }}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            {fonts.map((font) => (
              <option key={font.font} value={font.font} style={{ fontFamily: font.font }}>
                {font.label}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => {
              const size = e.target.value
              editor.chain().focus().setFontSize(size).run()
            }}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            {fontSizes.map((size) => (
              <option key={size.size} value={size.size}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <Button
            variant={editor.isActive({ textAlign: 'left' }) ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'center' }) ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 transition-colors"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* More Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="h-8 px-3 rounded-md hover:bg-gray-100 transition-colors text-sm"
          >
            <MoreHorizontal className="h-4 w-4 mr-1" />
            More
          </Button>
          
          {showMoreMenu && (
            <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px]">
              <div className="space-y-2">
                <Button
                  variant={editor.isActive('strike') ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className="w-full justify-start"
                  title="Strikethrough"
                >
                  <Strikethrough className="h-4 w-4 mr-2" />
                  Strikethrough
                </Button>
                
                <Button
                  variant={editor.isActive('code') ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className="w-full justify-start"
                  title="Inline Code"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Inline Code
                </Button>
                
                <Button
                  variant={editor.isActive('codeBlock') ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className="w-full justify-start"
                  title="Code Block"
                >
                  <span className="text-xs font-mono mr-2">{'<>'}</span>
                  Code Block
                </Button>
                
                <Button
                  variant={editor.isActive('subscript') ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleSubscript().run()}
                  className="w-full justify-start"
                  title="Subscript"
                >
                  <span className="text-xs font-medium mr-2">ₓ</span>
                  Subscript
                </Button>
                
                <Button
                  variant={editor.isActive('superscript') ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleSuperscript().run()}
                  className="w-full justify-start"
                  title="Superscript"
                >
                  <span className="text-xs font-medium mr-2">ˣ</span>
                  Superscript
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
          <div className="flex gap-3">
            <Input
              type="url"
              placeholder="Unesite URL linka..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" onClick={setLink} className="px-4">
              Dodaj
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowLinkInput(false)}
              className="px-4"
            >
              Otkaži
            </Button>
          </div>
        </div>
      )}

      {/* Table Popup */}
      {showTablePopup && (
        <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-lg w-80">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Kreiraj tabelu</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTablePopup(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Redovi</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Kolone</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={insertTable} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Kreiraj tabelu
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowTablePopup(false)}
                className="flex-1"
              >
                Otkaži
              </Button>
            </div>
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
  onFocus,
  blogSlug
}) => {
  const [characterCount, setCharacterCount] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  
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
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Strike,
      Subscript,
      Superscript,
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlock,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
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
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none',
        style: 'font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 16px;'
      }
    }
  })

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files) as File[]
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast.error('Molimo odaberite slike za upload')
      return
    }
    
    if (imageFiles.length > 5) {
      toast.error('Možete uploadovati maksimalno 5 slika odjednom')
      return
    }
    
    // Upload each image
    for (const file of imageFiles) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        if (blogSlug) {
          formData.append('folder', `blog-content/${blogSlug}`)
        } else {
          formData.append('folder', 'editor-images')
        }

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Upload greška')
        }

        // Insert image into editor
        editor?.chain().focus().setImage({ 
          src: result.url,
          alt: file.name
        }).run()
        
      } catch (error) {
        console.error('Image upload error:', error)
        toast.error(`Greška pri upload-u ${file.name}`)
      }
    }
    
    if (imageFiles.length > 1) {
      toast.success(`${imageFiles.length} slika uspešno uploadovano!`)
    } else {
      toast.success('Slika uspešno uploadovana!')
    }
  }

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
              <MenuBar editor={editor} blogSlug={blogSlug} />
      
      <div 
        className={`prose prose-lg max-w-none p-6 min-h-[200px] cursor-text transition-colors overflow-y-auto max-h-[600px] ${
          isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
        }`}
        onClick={() => editor?.commands.focus()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
      >
        {isDragOver && (
          <div className="text-center py-8 text-blue-600">
            <div className="text-4xl mb-2">📸</div>
            <p className="text-lg font-medium">Spustite slike ovde za upload</p>
            <p className="text-sm text-blue-500">Podržani formati: JPG, PNG, GIF, WebP</p>
          </div>
        )}
        
        <EditorContent 
          editor={editor} 
          className="focus:outline-none w-full h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[150px] [&_.ProseMirror_p]:mb-4 [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_h1]:mb-6 [&_.ProseMirror_h2]:mb-4 [&_.ProseMirror_h3]:mb-3 [&_.ProseMirror_ul]:mb-4 [&_.ProseMirror_ol]:mb-4 [&_.ProseMirror_blockquote]:mb-4 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-gray-300 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-gray-700 [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:border [&_.ProseMirror_table]:border-gray-300 [&_.ProseMirror_table]:table-fixed [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-gray-300 [&_.ProseMirror_th]:bg-gray-50 [&_.ProseMirror_th]:p-2 [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-gray-300 [&_.ProseMirror_td]:p-2 [&_.ProseMirror_td]:overflow-hidden [&_.ProseMirror_td]:text-ellipsis [&_.ProseMirror_code]:bg-gray-100 [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded [&_.ProseMirror_pre]:bg-gray-900 [&_.ProseMirror_pre]:text-white [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:overflow-x-auto"
        />
      </div>
      
      {/* Character count */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        {characterCount} karaktera
      </div>
    </div>
  )
} 