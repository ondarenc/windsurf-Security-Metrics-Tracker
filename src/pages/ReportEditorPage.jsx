import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, FileText, Upload } from 'lucide-react'
import RichTextEditor from '../components/RichTextEditor'

const reportSections = [
  'Introduction',
  'Executive Dashboard',
  'Action Plan & Remediation Road-map',
  'Conclusion',
  'Appendix',
  'Technical Glossary'
]

function ReportEditorPage() {
  const navigate = useNavigate()
  const [section, setSection] = useState('Introduction')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [savedReports, setSavedReports] = useState([])
  const [selectedReportId, setSelectedReportId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Load saved reports when component mounts
  useEffect(() => {
    loadSavedReports()
  }, [])

  // Load saved reports from API
  const loadSavedReports = async () => {
    try {
      const response = await fetch('/api/reports')
      const reports = await response.json()
      setSavedReports(reports)
    } catch (error) {
      console.error('Error loading reports:', error)
    }
  }

  // Load reports for selected section
  useEffect(() => {
    if (section) {
      loadReportsForSection(section)
    }
  }, [section])

  const loadReportsForSection = async (sectionName) => {
    try {
      const response = await fetch(`/api/reports?section=${encodeURIComponent(sectionName)}`)
      const reports = await response.json()
      setSavedReports(reports)
      setSelectedReportId(null)
      setTitle('')
      setContent('')
    } catch (error) {
      console.error('Error loading reports for section:', error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setSaveMessage('')
    
    try {
      const reportData = {
        section,
        title: title || section,
        content
      }

      let response
      if (selectedReportId) {
        // Update existing report
        response = await fetch(`/api/reports/${selectedReportId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportData)
        })
      } else {
        // Create new report
        response = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportData)
        })
      }

      if (response.ok) {
        const savedReport = await response.json()
        setSelectedReportId(savedReport.id)
        setSaveMessage('Report saved successfully!')
        loadSavedReports()
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        setSaveMessage('Error saving report')
      }
    } catch (error) {
      console.error('Error saving report:', error)
      setSaveMessage('Error saving report')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoad = (reportId) => {
    const report = savedReports.find(r => r.id === reportId)
    if (report) {
      setSelectedReportId(report.id)
      setTitle(report.title || '')
      setContent(report.content)
      setSection(report.section)
      setSaveMessage('')
    }
  }

  const handleNewReport = () => {
    setSelectedReportId(null)
    setTitle('')
    setContent('')
    setSaveMessage('')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">Report Editor</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNewReport}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                New
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Section Selection and Saved Reports */}
            <div className="lg:col-span-1">
              <div className="bg-card border rounded-lg p-4">
                <h2 className="font-semibold mb-4">Report Section</h2>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary mb-6"
                >
                  {reportSections.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>

                <h2 className="font-semibold mb-4">Saved Reports</h2>
                {savedReports.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No saved reports for this section</p>
                ) : (
                  <div className="space-y-2">
                    {savedReports.map((report) => (
                      <div
                        key={report.id}
                        onClick={() => handleLoad(report.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedReportId === report.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="font-medium text-sm truncate">
                          {report.title || report.section}
                        </div>
                        <div className="text-xs opacity-75">
                          {new Date(report.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Editor */}
            <div className="lg:col-span-2">
              <div className="bg-card border rounded-lg p-4">
                {/* Title Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Report Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter report title..."
                  />
                </div>

                {/* Rich Text Editor */}
                <div>
                  <label className="block text-sm font-medium mb-2">Report Content</label>
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                  />
                </div>

                {/* Save Message */}
                {saveMessage && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    saveMessage.includes('success')
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-destructive/10 text-destructive border border-destructive/20'
                  }`}>
                    {saveMessage}
                  </div>
                )}

                {/* Tips */}
                <div className="mt-6 bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Tips for using the editor:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Select a report section from the dropdown</li>
                    <li>• Use the toolbar buttons to format text (Bold, Italic, Underline)</li>
                    <li>• Add headings using H1, H2, H3 buttons for structure</li>
                    <li>• Use alignment buttons to position text</li>
                    <li>• Click "Save" to save your report</li>
                    <li>• Click on saved reports to load and edit them</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportEditorPage