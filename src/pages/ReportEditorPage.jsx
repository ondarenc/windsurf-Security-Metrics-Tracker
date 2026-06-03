import React, { useState, useEffect, useRef } from 'react'
import { FileText, Save, Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, Type, Palette } from 'lucide-react'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'
import { RightPanel } from '../components/dashboard/RightPanel'

const STORAGE_KEY = 'uditis_report_content'

const COLORS = [
  '#000000', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#a855f7',
]

function ToolbarButton({ icon: Icon, label, onAction, active, editorRef }) {
  const handleMouseDown = (e) => {
    e.preventDefault()
    
    // Save the current selection before the editor loses focus
    const selection = window.getSelection()
    let savedRange = null
    if (selection.rangeCount > 0) {
      savedRange = selection.getRangeAt(0).cloneRange()
    }
    
    // Call the action with the saved range
    onAction(savedRange)
  }
  
  return (
    <button
      type="button"
      onMouseDown={handleMouseDown}
      title={label}
      className={`p-2 rounded-lg text-sm transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}

export default function ReportEditorPage() {
  const [saved, setSaved] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)
  const editorRef = useRef(null)

  const exec = (command, value = null, savedRange = null) => {
    const editor = editorRef.current
    if (!editor) return
    
    // Focus the editor
    editor.focus()
    
    // Get current selection
    const selection = window.getSelection()
    
    // Try to restore the saved range first
    if (savedRange) {
      try {
        selection.removeAllRanges()
        selection.addRange(savedRange)
      } catch (e) {
        console.error('Error restoring range:', e)
      }
    }
    
    // If there's still no selection in the editor, select all content
    if (selection.rangeCount === 0 || !editor.contains(selection.anchorNode)) {
      const range = document.createRange()
      range.selectNodeContents(editor)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    
    // Execute the command
    document.execCommand(command, false, value)
    triggerSave()
  }

  const triggerSave = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      localStorage.setItem(STORAGE_KEY, html)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const applyColor = (color) => {
    exec('foreColor', color)
    setColorOpen(false)
  }

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && editorRef.current) {
      editorRef.current.innerHTML = stored
    } else if (editorRef.current) {
      editorRef.current.innerHTML = '<p><br></p>'
    }
  }, [])

  // Click outside color picker to close
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.color-picker')) {
        setColorOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <MainContent pageTitle="Report Editor" pageIcon={FileText}>
        <div className="max-w-4xl mx-auto">
          {/* Header with branding */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Uditis MTS Security Metric Tracking System
              </h2>
              <p className="text-sm text-muted-foreground">
                Write your report content below. It will be saved automatically.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-semibold text-foreground">Uditis</span>
                <img src="/u.png" alt="Uditis" className="w-8 h-8 object-contain" />
              </div>
              {saved && (
                <span className="text-xs text-success flex items-center gap-1">
                  <Save className="w-3 h-3" />
                  Saved
                </span>
              )}
            </div>
          </div>

          {/* Editor */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Mini Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-muted/30">
              <ToolbarButton icon={Bold} label="Bold" onAction={(range) => exec('bold', null, range)} editorRef={editorRef} />
              <ToolbarButton icon={Italic} label="Italic" onAction={(range) => exec('italic', null, range)} editorRef={editorRef} />
              <ToolbarButton icon={Underline} label="Underline" onAction={(range) => exec('underline', null, range)} editorRef={editorRef} />
              <div className="w-px h-5 bg-border mx-1" />
              <ToolbarButton icon={Heading1} label="Heading 1" onAction={(range) => exec('formatBlock', '<h1>', range)} editorRef={editorRef} />
              <ToolbarButton icon={Heading2} label="Heading 2" onAction={(range) => exec('formatBlock', '<h2>', range)} editorRef={editorRef} />
              <ToolbarButton icon={Heading3} label="Heading 3" onAction={(range) => exec('formatBlock', '<h3>', range)} editorRef={editorRef} />
              <ToolbarButton icon={Type} label="Paragraph" onAction={(range) => exec('formatBlock', '<p>', range)} editorRef={editorRef} />
              <div className="w-px h-5 bg-border mx-1" />
              <ToolbarButton icon={List} label="Bullet List" onAction={(range) => exec('insertUnorderedList', null, range)} editorRef={editorRef} />
              <ToolbarButton icon={ListOrdered} label="Numbered List" onAction={(range) => exec('insertOrderedList', null, range)} editorRef={editorRef} />
              <div className="w-px h-5 bg-border mx-1" />
              {/* Color Picker */}
              <div className="relative color-picker">
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setColorOpen(!colorOpen)
                  }}
                  title="Text Color"
                  className="p-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Palette className="w-4 h-4" />
                </button>
                {colorOpen && (
                  <div className="absolute top-full left-0 mt-1 p-3 bg-card border border-border rounded-lg shadow-lg grid grid-cols-4 gap-2 z-50">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          applyColor(c)
                        }}
                        className="w-8 h-8 rounded-md border border-border/50 hover:scale-110 transition-transform"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Editable Area */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={triggerSave}
              className="w-full min-h-[500px] max-h-[500px] p-4 overflow-y-auto text-foreground leading-relaxed focus:outline-none"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            />
          </div>

          <div className="mt-4 text-sm text-muted-foreground text-center">
            Content is automatically saved to your browser. View the report at <code className="bg-muted px-1.5 py-0.5 rounded text-xs">/report</code>
          </div>
        </div>
      </MainContent>
      <RightPanel />
    </div>
  )
}
