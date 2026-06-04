import React from 'react'
import { AlertCircle, Shield } from 'lucide-react'
import { Button } from '../ui/button'

export function MainContent({ children, pageTitle, pageIcon }) {
  const Icon = pageIcon

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Header */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-border bg-card shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Uditis MTS
          </h1>
          <p className="text-sm text-muted-foreground">Security Metric Tracking System</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Page Title + Icon */}
          {pageTitle && (
            <div className="flex items-center gap-2 pr-4 border-r border-border">
              {Icon && typeof Icon === 'string' ? (
                <img src={Icon} alt={pageTitle} className="w-6 h-6 object-contain" />
              ) : Icon ? (
                <Icon className="w-5 h-5 text-muted-foreground" />
              ) : null}
              <span className="text-sm font-semibold text-foreground">{pageTitle}</span>
            </div>
          )}

          {/* Primary Actions */}
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={() => window.location.href = '/form'}>
              <AlertCircle className="w-4 h-4" />
              <span>Add Metric</span>
            </Button>
            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.location.href = '/followup-console'}>
              <Shield className="w-4 h-4" />
              <span>Add Vulnerability</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
