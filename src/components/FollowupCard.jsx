import React, { useState, useEffect } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react'
import followupManager from '../data/followupManager'
import { cn } from '../lib/utils'

const cardShadow = 'rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px'

const FollowupCard = ({ source, limit = 5 }) => {
  const [followupItems, setFollowupItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFollowupItems()
  }, [source])

  const loadFollowupItems = async () => {
    setLoading(true)
    try {
      const items = await followupManager.getAllItems()
      const filtered = items
        .filter(item => item.source === source && item.status !== 'Archived')
        .sort((a, b) => {
          const levelOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
          return levelOrder[a.level] - levelOrder[b.level]
        })
        .slice(0, limit)
      setFollowupItems(filtered)
    } catch (error) {
      console.error('Error loading follow-up items:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Fixed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'Fix in progress':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'Open':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Fixed':
        return 'text-green-600'
      case 'Fix in progress':
        return 'text-blue-600'
      case 'Open':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'HIGH':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'LOW':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border" style={{ boxShadow: cardShadow }}>
        <h3 className="text-base font-semibold text-foreground mb-4">Follow-up Items</h3>
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    )
  }

  const openCount = followupItems.filter(item => item.status === 'Open').length
  const inProgressCount = followupItems.filter(item => item.status === 'Fix in progress').length
  const fixedCount = followupItems.filter(item => item.status === 'Fixed').length

  return (
    <div className="bg-card rounded-2xl p-6 border border-border" style={{ boxShadow: cardShadow }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Follow-up Items</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {followupItems.length} items
          </span>
        </div>
      </div>

      {/* Status Summary */}
      <div className="flex gap-2 mb-4">
        {openCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            <span>{openCount} Open</span>
          </div>
        )}
        {inProgressCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
            <Clock className="w-3 h-3" />
            <span>{inProgressCount} In Progress</span>
          </div>
        )}
        {fixedCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            <span>{fixedCount} Fixed</span>
          </div>
        )}
      </div>

      {/* Follow-up Items List */}
      {followupItems.length === 0 ? (
        <div className="text-muted-foreground text-sm py-4 text-center">
          No follow-up items for {source}
        </div>
      ) : (
        <div className="space-y-2">
          {followupItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                'p-3 rounded-lg border transition-colors',
                item.status === 'Open' && 'bg-red-50 border-red-200',
                item.status === 'Fix in progress' && 'bg-blue-50 border-blue-200',
                item.status === 'Fixed' && 'bg-green-50 border-green-200',
                !['Open', 'Fix in progress', 'Fixed'].includes(item.status) && 'bg-gray-50 border-gray-200'
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded border', getLevelColor(item.level))}>
                      {item.level}
                    </span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(item.status)}
                      <span className={cn('text-xs font-medium', getStatusColor(item.status))}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.vulnerability}
                  </p>
                  {item.serviceIp && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {item.serviceIp}
                    </p>
                  )}
                  {item.ticket && item.ticket !== 'not yet ticket' && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      Ticket: {item.ticket}
                    </p>
                  )}
                </div>
              </div>
              {item.remediationTask && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {item.remediationTask}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* View All Link */}
      {followupItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <a
            href="/followup"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View all follow-up items
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  )
}

export default FollowupCard
