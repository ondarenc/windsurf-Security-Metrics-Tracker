import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import dataManager from '../data/dataManager'

const SecurityScorecardOverview = () => {
  const CATEGORY = 'Securityscorecard'

  const getLatestValue = (metricName) => {
    const entries = dataManager.getEntriesByName(metricName, CATEGORY)
    return entries.length > 0 ? entries[0].value : 0
  }

  const getGrade = (score) => {
    if (score >= 90) return { letter: 'A', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200', barColor: 'bg-green-500', label: 'Lowest breach likelihood' }
    if (score >= 80) return { letter: 'B', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200', barColor: 'bg-blue-500', label: 'Low risk' }
    if (score >= 70) return { letter: 'C', color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200', barColor: 'bg-yellow-500', label: 'Moderate risk' }
    if (score >= 60) return { letter: 'D', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200', barColor: 'bg-orange-500', label: 'Elevated risk' }
    return { letter: 'F', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200', barColor: 'bg-red-500', label: 'High risk' }
  }

  const getIndicator = (value, previousValue) => {
    if (previousValue === null) {
      return { icon: Minus, color: 'text-gray-500', bgColor: 'bg-gray-100', status: 'No prior data' }
    }
    // For breach risk issues, lower is better (inverted logic)
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

  // Securityscorecard metrics
  const myScoreValue = getLatestValue('My Score')
  const myScoreGrade = getGrade(myScoreValue)

  const highBreachValue = getLatestValue('High breach risk issues')
  const highBreachPrev = getPreviousValue('High breach risk issues')
  const highBreachIndicator = getIndicator(highBreachValue, highBreachPrev)

  const mediumBreachValue = getLatestValue('Medium breach risk issues')
  const mediumBreachPrev = getPreviousValue('Medium breach risk issues')
  const mediumBreachIndicator = getIndicator(mediumBreachValue, mediumBreachPrev)

  const lowBreachValue = getLatestValue('Low breach risk issues')
  const lowBreachPrev = getPreviousValue('Low breach risk issues')
  const lowBreachIndicator = getIndicator(lowBreachValue, lowBreachPrev)

  return (
    <div className="space-y-6 mb-8">
      {/* Horizontal layout - 2:3 ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 metric-overview-grid">
        {/* My Score - Bigger on horizontal axis */}
        <div className="lg:col-span-2 print:col-span-2">
          <div className={`bg-white rounded-lg shadow-lg border-2 ${myScoreGrade.borderColor} p-8 text-center hover:shadow-xl transition-all duration-300 aspect-square flex flex-col justify-center metric-card`}>
            <div className="mb-4">
              <div className={`w-20 h-20 ${myScoreGrade.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-4xl font-bold ${myScoreGrade.color}`}>{myScoreGrade.letter}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">My Score</h2>
            </div>
            <div className={`text-5xl font-bold ${myScoreGrade.color} mb-3`}>
              {myScoreValue}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {myScoreGrade.label}
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div
                className={`${myScoreGrade.barColor} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(myScoreValue, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {myScoreValue}/100
            </div>
          </div>
        </div>

        {/* Breach Risk Issues - aligned to main metric height */}
        <div className="lg:col-span-3 print:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full">
            {/* High breach risk issues */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-teal-200 p-4 hover:shadow-xl transition-all duration-300 flex h-full metric-card">
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-sm font-bold text-gray-900 mb-2">High breach risk issues</h2>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {highBreachValue}
                </div>
                <div className="text-xs text-gray-600">
                  Previous: {highBreachPrev !== null ? highBreachPrev : '-'}
                </div>
              </div>
              <div className="w-20 flex flex-col items-center justify-center">
                <div className={`w-10 h-10 ${highBreachIndicator.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                  <highBreachIndicator.icon className={`w-5 h-5 ${highBreachIndicator.color}`} />
                </div>
                <div className={`text-xs font-medium ${highBreachIndicator.color} text-center`}>
                  {highBreachIndicator.status}
                </div>
              </div>
            </div>

            {/* Medium breach risk issues */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-teal-200 p-4 hover:shadow-xl transition-all duration-300 flex h-full metric-card">
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-sm font-bold text-gray-900 mb-2">Medium breach risk issues</h2>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {mediumBreachValue}
                </div>
                <div className="text-xs text-gray-600">
                  Previous: {mediumBreachPrev !== null ? mediumBreachPrev : '-'}
                </div>
              </div>
              <div className="w-20 flex flex-col items-center justify-center">
                <div className={`w-10 h-10 ${mediumBreachIndicator.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                  <mediumBreachIndicator.icon className={`w-5 h-5 ${mediumBreachIndicator.color}`} />
                </div>
                <div className={`text-xs font-medium ${mediumBreachIndicator.color} text-center`}>
                  {mediumBreachIndicator.status}
                </div>
              </div>
            </div>

            {/* Low breach risk issues */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-teal-200 p-4 hover:shadow-xl transition-all duration-300 flex h-full metric-card">
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-sm font-bold text-gray-900 mb-2">Low breach risk issues</h2>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {lowBreachValue}
                </div>
                <div className="text-xs text-gray-600">
                  Previous: {lowBreachPrev !== null ? lowBreachPrev : '-'}
                </div>
              </div>
              <div className="w-20 flex flex-col items-center justify-center">
                <div className={`w-10 h-10 ${lowBreachIndicator.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                  <lowBreachIndicator.icon className={`w-5 h-5 ${lowBreachIndicator.color}`} />
                </div>
                <div className={`text-xs font-medium ${lowBreachIndicator.color} text-center`}>
                  {lowBreachIndicator.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecurityScorecardOverview
