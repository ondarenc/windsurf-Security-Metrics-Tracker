import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import dataManager from '../data/dataManager'

const UnifiedMetricTable = ({ category = 'M365' }) => {
  const getLatestEntries = (limit = 3) => {
    const allEntries = dataManager.getAllEntries()
    const metricTypes = dataManager.getMetricTypes(category)

    // Get latest entries for each metric type, filtered by category
    const latestByMetric = {}
    metricTypes.forEach(metric => {
      const metricEntries = allEntries.filter(e => {
        if (e.name !== metric) return false;
        // If entry has a stored category, match exactly
        if (e.category) return e.category === category;
        // Legacy entries without category: infer from metric name
        if (category === 'M365') return true; // M365 metrics are unique
        // For shared Purple Knight metrics, legacy entries default to AD
        return category === 'Purple Knight AD';
      }).slice(0, limit)
      latestByMetric[metric] = metricEntries
    })

    return latestByMetric
  }

  const getIndicator = (value, referenceValue, metricName) => {
    // For IOEs Found, Critical IOEs, and breach risk issues, lower is better (inverted logic)
    const isInverted = metricName === 'IOEs Found' || metricName === 'Critical IOEs'
      || metricName === 'High breach risk issues' || metricName === 'Medium breach risk issues' || metricName === 'Low breach risk issues'

    if (isInverted) {
      // For inverted metrics: lower is good, higher is bad
      if (value <= referenceValue) {
        return { type: 'good', icon: TrendingDown, color: 'text-green-600', bgColor: 'bg-green-100' }
      } else {
        return { type: 'poor', icon: TrendingUp, color: 'text-red-600', bgColor: 'bg-red-100' }
      }
    } else {
      // Normal logic: higher is good
      if (value > referenceValue) {
        return { type: 'good', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' }
      } else {
        return { type: 'poor', icon: TrendingDown, color: 'text-red-600', bgColor: 'bg-red-100' }
      }
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
  const referenceValue = dataManager.getReferenceValue(category, category === 'M365' ? 'Secure Score' : 'IOEs Found')
  const metricTypes = dataManager.getMetricTypes(category)

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
                    category === 'M365' && metric === 'Secure Score' ? 'text-red-600' :
                    category === 'Securityscorecard' && metric === 'My Score' ? 'text-teal-600' :
                    (category === 'Purple Knight AD' || category === 'Purple Knight Entra-ID') && metric === 'Note' ? 'text-purple-600' : 'text-gray-500'
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
                  {latestEntries[metricTypes[0]]?.[rowIndex] 
                    ? formatDate(latestEntries[metricTypes[0]][rowIndex].date)
                    : '-'
                  }
                </td>
                {metricTypes.map(metric => (
                  <td key={metric} className="px-6 py-4 whitespace-nowrap">
                    {latestEntries[metric]?.[rowIndex] ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          getIndicator(latestEntries[metric][rowIndex].value, dataManager.getReferenceValue(category, metric), metric).bgColor
                        }`}>
                          {React.createElement(
                            getIndicator(latestEntries[metric][rowIndex].value, dataManager.getReferenceValue(category, metric), metric).icon,
                            { className: `w-3 h-3 ${getIndicator(latestEntries[metric][rowIndex].value, dataManager.getReferenceValue(category, metric), metric).color}` }
                          )}
                        </div>
                        <span className={`text-sm font-medium ${
                          getIndicator(latestEntries[metric][rowIndex].value, dataManager.getReferenceValue(category, metric), metric).color
                        }`}>
                          {latestEntries[metric][rowIndex].value}{category === 'M365' ? '%' : ''}
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
