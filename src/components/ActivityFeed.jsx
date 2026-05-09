import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info,
  Activity,
  Clock
} from 'lucide-react'
import clsx from 'clsx'

const ActivityFeed = ({ events = [] }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Activity className="w-5 h-5 text-gray-500" />
    }
  }

  const getEventBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-gray-600" />
        Recent Activity
      </h3>
      
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className={clsx(
              'p-4 rounded-lg border transition-all duration-200 hover:shadow-sm',
              getEventBgColor(event.type)
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getEventIcon(event.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {events.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityFeed
