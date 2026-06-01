import React from 'react'
import { Activity, Clock, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'
import dataManager from '../../data/dataManager'

function getRecentEntries() {
  const entries = dataManager.getAllEntries()
  return entries.slice(0, 5).map((entry) => ({
    id: entry.id,
    title: `${entry.name}: ${entry.value}`,
    time: new Date(entry.date).toLocaleDateString(),
    category: entry.category || 'M365',
    status: 'success',
  }))
}

function getCategoryStats() {
  const categories = ['M365', 'Purple Knight AD', 'Purple Knight Entra-ID', 'Securityscorecard', 'ProjectDiscovery']
  return categories.map((cat) => {
    const types = dataManager.getMetricTypes(cat)
    const totalEntries = types.reduce((sum, type) => {
      return sum + dataManager.getEntriesByMetricType(type, 100, cat).length
    }, 0)
    return { name: cat, entries: totalEntries }
  })
}

export function RightPanel({ className }) {
  const recentActivity = getRecentEntries()
  const categoryStats = getCategoryStats()
  const totalEntries = dataManager.getAllEntries().length

  return (
    <aside className={cn('w-[280px] h-screen bg-card border-l border-border flex flex-col shrink-0 overflow-hidden', className)}>
      {/* System Status */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground">Data Overview</h3>
          <span className="flex items-center gap-1.5 text-xs font-medium text-success">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            Active
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Total Entries</p>
            <p className="text-lg font-semibold text-foreground">{totalEntries}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Categories</p>
            <p className="text-lg font-semibold text-foreground">5</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          Recent Entries
        </h3>
        <div className="space-y-3">
          {recentActivity.length > 0 ? recentActivity.map((item) => (
            <div
              key={item.id}
              className="w-full flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/60 transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-success/10">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </p>
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground text-center py-4">No entries yet</p>
          )}
        </div>
      </div>

      {/* Category Stats */}
      <div className="p-5 flex-1 overflow-y-auto">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          Categories
        </h3>
        <div className="space-y-2">
          {categoryStats.map((cat) => (
            <div
              key={cat.name}
              className="w-full flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/60 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium bg-muted text-muted-foreground">
                {cat.entries}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {cat.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {cat.entries} entries
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
