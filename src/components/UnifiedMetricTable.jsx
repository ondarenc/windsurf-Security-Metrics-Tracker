import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import dataManager from '../data/dataManager'

const UnifiedMetricTable = () => {
  const getLatestEntries = (limit = 3) => {
    const allEntries = dataManager.getAllEntries()
    const metricTypes = ['Secure Score', 'Identity', 'Data', 'Device', 'Apps']
    
    // Get latest entries for each metric type
    const latestByMetric = {}
    metricTypes.forEach(metric => {
      const metricEntries = allEntries.filter(e => e.name === metric).slice(0, limit)
      latestByMetric[metric] = metricEntries
    })
    
    return latestByMetric
  }

  const getIndicator = (value, referenceValue) => {
    if (value > referenceValue) {
      return { type: 'good', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' }
    } else {
      return { type: 'poor', icon: TrendingDown, color: 'text-red-600', bgColor: 'bg-red-100' }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const latestEntries = getLatestEntries(3)
  const referenceValue = dataManager.getReferenceValue()
  const metricTypes = ['Secure Score', 'Identity', 'Data', 'Device', 'Apps']

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Metrics Overview</h3>
        <p className="text-sm text-gray-600 mt-1">
          Last 3 entries for all metrics (Target: {referenceValue})
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              {metricTypes.map(metric => (
                <th 
                  key={metric} 
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    metric === 'Secure Score' ? 'text-red-600' : 'text-gray-500'
                  }`}
                >
                  {metric}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[0, 1, 2].map(rowIndex => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {latestEntries['Secure Score']?.[rowIndex] 
                    ? formatDate(latestEntries['Secure Score'][rowIndex].date)
                    : '-'
                  }
                </td>
                {metricTypes.map(metric => (
                  <td key={metric} className="px-6 py-4 whitespace-nowrap">
                    {latestEntries[metric]?.[rowIndex] ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          getIndicator(latestEntries[metric][rowIndex].value, referenceValue).bgColor
                        }`}>
                          {React.createElement(
                            getIndicator(latestEntries[metric][rowIndex].value, referenceValue).icon,
                            { className: `w-3 h-3 ${getIndicator(latestEntries[metric][rowIndex].value, referenceValue).color}` }
                          )}
                        </div>
                        <span className={`text-sm font-medium ${
                          metric === 'Secure Score' ? 'text-red-600 font-bold' : 'text-gray-900'
                        }`}>
                          {latestEntries[metric][rowIndex].value}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UnifiedMetricTable
