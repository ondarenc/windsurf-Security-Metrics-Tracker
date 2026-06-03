import React, { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'
import { RightPanel } from '../components/dashboard/RightPanel'

const STORAGE_KEY = 'uditis_report_content'

export default function ReportPage() {
  const [content, setContent] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setContent(stored)
    }
  }, [])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <MainContent pageTitle="Report" pageIcon={FileText}>
        <div className="max-w-4xl mx-auto">
          {content ? (
            <div className="bg-card rounded-xl border border-border p-8">
              <div
                className="prose prose-sm max-w-none dark:prose-invert text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No report content yet</h3>
              <p className="text-muted-foreground">
                Go to the Report Editor to write your report. It will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </MainContent>
      <RightPanel />
    </div>
  )
}
