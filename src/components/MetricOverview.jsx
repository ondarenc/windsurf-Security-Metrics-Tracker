import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import dataManager from '../data/dataManager'

const MetricOverview = () => {
  const CATEGORY = 'M365'

  const getLatestValue = (metricType) => {
    const entries = dataManager.getEntriesByMetricType(metricType, 1, CATEGORY)
    return entries.length > 0 ? entries[0].value : 0
  }

  const getIndicator = (value, referenceValue) => {
    if (value >= referenceValue) {
      return { type: 'good', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' }
    } else {
      return { type: 'poor', icon: TrendingDown, color: 'text-red-600', bgColor: 'bg-red-100' }
    }
  }

  const secureScoreValue = getLatestValue('Secure Score')
  const secureScoreIndicator = getIndicator(secureScoreValue, dataManager.getReferenceValue(CATEGORY))
  const referenceValue = dataManager.getReferenceValue(CATEGORY)

  const otherMetrics = ['Identity', 'Data', 'Device', 'Apps']
  const otherMetricsData = otherMetrics.map(metric => ({
    name: metric,
    value: getLatestValue(metric),
    indicator: getIndicator(getLatestValue(metric), referenceValue)
  }))

  return (
    <div className="space-y-6 mb-8">
      {/* Horizontal layout - 2:3 ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 metric-overview-grid">
        {/* Secure Score - Bigger on horizontal axis */}
        <div className="lg:col-span-2 print:col-span-2">
          <div className="bg-white rounded-lg shadow-lg border-2 border-red-200 p-8 text-center hover:shadow-xl transition-all duration-300 aspect-square flex flex-col justify-center metric-card">
            <div className="mb-4">
              <div className={`w-16 h-16 ${secureScoreIndicator.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <secureScoreIndicator.icon className={`w-8 h-8 ${secureScoreIndicator.color}`} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Score</h2>
            </div>
            <div className="text-5xl font-bold text-red-600 mb-3">
              {secureScoreValue}%
            </div>
            <div className="text-sm text-gray-600">
              Target: {referenceValue}
            </div>
            <div className={`text-sm font-medium ${secureScoreIndicator.color} mt-2`}>
              {secureScoreValue >= referenceValue ? 'Above Target' : 'Below Target'}
            </div>
          </div>
        </div>

        {/* Other 4 Metrics - Vertical info left + graphic/status right */}
        <div className="lg:col-span-3 print:col-span-3">
          <div className="grid grid-cols-2 gap-3 h-full">
            {otherMetricsData.map((metric) => (
              <div key={metric.name} className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 hover:shadow-xl transition-all duration-300 flex h-full metric-card">
                {/* Left side - Vertical information */}
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-sm font-bold text-gray-900 mb-2">{metric.name}</h2>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {metric.value}%
                  </div>
                  <div className="text-xs text-gray-600">
                    Target: {referenceValue}
                  </div>
                </div>
                
                {/* Right side - Small graphic and status */}
                <div className="w-20 flex flex-col items-center justify-center">
                  <div className={`w-10 h-10 ${metric.indicator.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                    <metric.indicator.icon className={`w-5 h-5 ${metric.indicator.color}`} />
                  </div>
                  <div className={`text-xs font-medium ${metric.indicator.color} text-center`}>
                    {metric.value >= referenceValue ? 'Above' : 'Below'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetricOverview
