import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import dataManager from '../data/dataManager'

const ProjectDiscoveryOverview = () => {
  const CATEGORY = 'ProjectDiscovery'

  const getLatestValue = (metricName) => {
    const entries = dataManager.getEntriesByName(metricName, CATEGORY)
    return entries.length > 0 ? entries[0].value : 0
  }

  const getScoreStatus = (score) => {
    if (score >= 80) return { color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200', barColor: 'bg-green-500', label: 'Strong posture (low risk)' }
    if (score >= 60) return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200', barColor: 'bg-yellow-500', label: 'Moderate risk / improvements needed' }
    if (score >= 40) return { color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200', barColor: 'bg-orange-500', label: 'Weak posture (multiple issues)' }
    return { color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200', barColor: 'bg-red-500', label: 'High risk / critical exposure' }
  }

  const getIndicator = (value, previousValue) => {
    if (previousValue === null) {
      return { icon: Minus, color: 'text-gray-500', bgColor: 'bg-gray-100', status: 'No prior data' }
    }
    if (value < previousValue) {
      return { icon: TrendingDown, color: 'text-green-600', bgColor: 'bg-green-100', status: 'Improving' }
    } else if (value > previousValue) {
      return { icon: TrendingUp, color: 'text-red-600', bgColor: 'bg-red-100', status: 'Worsening' }
    } else {
      return { icon: Minus, color: 'text-gray-500', bgColor: 'bg-gray-100', status: 'Stable' }
    }
  }

  const getPreviousValue = (metricName) => {
    const entries = dataManager.getEntriesByName(metricName, CATEGORY)
    return entries.length > 1 ? entries[1].value : null
  }

  // ProjectDiscovery metrics
  const securityScoreValue = getLatestValue('Security Score')
  const securityScoreStatus = getScoreStatus(securityScoreValue)

  const criticalValue = getLatestValue('Critical')
  const criticalPrev = getPreviousValue('Critical')
  const criticalIndicator = getIndicator(criticalValue, criticalPrev)

  const highValue = getLatestValue('High')
  const highPrev = getPreviousValue('High')
  const highIndicator = getIndicator(highValue, highPrev)

  const mediumValue = getLatestValue('Medium')
  const mediumPrev = getPreviousValue('Medium')
  const mediumIndicator = getIndicator(mediumValue, mediumPrev)

  const lowValue = getLatestValue('Low')
  const lowPrev = getPreviousValue('Low')
  const lowIndicator = getIndicator(lowValue, lowPrev)

  return (
    <div className="space-y-6 mb-8">
      {/* Horizontal layout - 2:3 ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 metric-overview-grid">
        {/* Security Score - Bigger on horizontal axis */}
        <div className="lg:col-span-2 print:col-span-2">
          <div className={`bg-white rounded-lg shadow-lg border-2 ${securityScoreStatus.borderColor} p-8 text-center hover:shadow-xl transition-all duration-300 aspect-square flex flex-col justify-center metric-card`}>
            <div className="mb-4">
              <div className={`w-20 h-20 ${securityScoreStatus.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-4xl font-bold ${securityScoreStatus.color}`}>{securityScoreValue}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Score</h2>
            </div>
            <div className={`text-5xl font-bold ${securityScoreStatus.color} mb-3`}>
              {securityScoreValue}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {securityScoreStatus.label}
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div
                className={`${securityScoreStatus.barColor} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(securityScoreValue, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {securityScoreValue}/100
            </div>
          </div>
        </div>

        {/* Active Vulnerabilities - aligned to main metric height */}
        <div className="lg:col-span-3 print:col-span-3">
          <div className="grid grid-cols-2 gap-3 h-full">
            {/* Critical */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-cyan-200 p-4 hover:shadow-xl transition-all duration-300 flex h-full metric-card">
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-sm font-bold text-gray-900 mb-2">Critical</h2>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {criticalValue}
                </div>
                <div className="text-xs text-gray-600">
                  Previous: {criticalPrev !== null ? criticalPrev : '-'}
                </div>
              </div>
              <div className="w-20 flex flex-col items-center justify-center">
                <div className={`w-10 h-10 ${criticalIndicator.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                  <criticalIndicator.icon className={`w-5 h-5 ${criticalIndicator.color}`} />
                </div>
                <div className={`text-xs font-medium ${criticalIndicator.color} text-center`}>
                  {criticalIndicator.status}
                </div>
              </div>
            </div>

            {/* High */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-cyan-200 p-4 hover:shadow-xl transition-all duration-300 flex h-full metric-card">
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-sm font-bold text-gray-900 mb-2">High</h2>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {highValue}
                </div>
                <div className="text-xs text-gray-600">
                  Previous: {highPrev !== null ? highPrev : '-'}
                </div>
              </div>
              <div className="w-20 flex flex-col items-center justify-center">
                <div className={`w-10 h-10 ${highIndicator.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                  <highIndicator.icon className={`w-5 h-5 ${highIndicator.color}`} />
                </div>
                <div className={`text-xs font-medium ${highIndicator.color} text-center`}>
                  {highIndicator.status}
                </div>
              </div>
            </div>

            {/* Medium */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-cyan-200 p-4 hover:shadow-xl transition-all duration-300 flex h-full metric-card">
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-sm font-bold text-gray-900 mb-2">Medium</h2>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {mediumValue}
                </div>
                <div className="text-xs text-gray-600">
                  Previous: {mediumPrev !== null ? mediumPrev : '-'}
                </div>
              </div>
              <div className="w-20 flex flex-col items-center justify-center">
                <div className={`w-10 h-10 ${mediumIndicator.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                  <mediumIndicator.icon className={`w-5 h-5 ${mediumIndicator.color}`} />
                </div>
                <div className={`text-xs font-medium ${mediumIndicator.color} text-center`}>
                  {mediumIndicator.status}
                </div>
              </div>
            </div>

            {/* Low */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-cyan-200 p-4 hover:shadow-xl transition-all duration-300 flex h-full metric-card">
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-sm font-bold text-gray-900 mb-2">Low</h2>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {lowValue}
                </div>
                <div className="text-xs text-gray-600">
                  Previous: {lowPrev !== null ? lowPrev : '-'}
                </div>
              </div>
              <div className="w-20 flex flex-col items-center justify-center">
                <div className={`w-10 h-10 ${lowIndicator.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                  <lowIndicator.icon className={`w-5 h-5 ${lowIndicator.color}`} />
                </div>
                <div className={`text-xs font-medium ${lowIndicator.color} text-center`}>
                  {lowIndicator.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDiscoveryOverview
