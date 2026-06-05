import React, { useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Bold, Italic, Heading1, Heading2, Heading3, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react'

const RichTextEditor = ({ content = '', onChange, editable = true }) => {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML())
      }
    },
  })

  // Update editor content when the content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const setBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run()
  }, [editor])

  const setItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run()
  }, [editor])

  const setHeading1 = useCallback(() => {
    editor?.chain().focus().toggleHeading({ level: 1 }).run()
  }, [editor])

  const setHeading2 = useCallback(() => {
    editor?.chain().focus().toggleHeading({ level: 2 }).run()
  }, [editor])

  const setHeading3 = useCallback(() => {
    editor?.chain().focus().toggleHeading({ level: 3 }).run()
  }, [editor])

  const setUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run()
  }, [editor])

  const setAlignment = useCallback((alignment) => {
    editor?.chain().focus().setTextAlign(alignment).run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="rich-text-editor border rounded-lg overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="toolbar flex items-center gap-1 p-2 border-b bg-muted/50 flex-wrap">
        <button
          onClick={setBold}
          className={`p-2 rounded transition-colors ${
            editor.isActive('bold') 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={setItalic}
          className={`p-2 rounded transition-colors ${
            editor.isActive('italic') 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={setUnderline}
          className={`p-2 rounded transition-colors ${
            editor.isActive('underline') 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          onClick={setHeading1}
          className={`p-2 rounded transition-colors ${
            editor.isActive('heading', { level: 1 }) 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={setHeading2}
          className={`p-2 rounded transition-colors ${
            editor.isActive('heading', { level: 2 }) 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={setHeading3}
          className={`p-2 rounded transition-colors ${
            editor.isActive('heading', { level: 3 }) 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          onClick={() => setAlignment('left')}
          className={`p-2 rounded transition-colors ${
            editor.isActive({ textAlign: 'left' }) 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => setAlignment('center')}
          className={`p-2 rounded transition-colors ${
            editor.isActive({ textAlign: 'center' }) 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => setAlignment('right')}
          className={`p-2 rounded transition-colors ${
            editor.isActive({ textAlign: 'right' }) 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => setAlignment('justify')}
          className={`p-2 rounded transition-colors ${
            editor.isActive({ textAlign: 'justify' }) 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="editor-content p-4 min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default RichTextEditor