import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import dataManager from '../data/dataManager'

const PurpleKnightEntraIDOverview = () => {
  const CATEGORY = 'Purple Knight Entra-ID'

  const getLatestValue = (metricName) => {
    const entries = dataManager.getEntriesByName(metricName, CATEGORY)
    return entries.length > 0 ? entries[0].value : 0
  }

  const getIndicator = (value, referenceValue, metricName) => {
    // For IOEs Found and Critical IOEs, lower is better (inverted logic)
    const isInverted = metricName === 'IOEs Found' || metricName === 'Critical IOEs'
    
    if (isInverted) {
      // For inverted metrics: lower is good (Below target), higher is bad (Above target)
      if (value <= referenceValue) {
        return { type: 'good', icon: TrendingDown, color: 'text-green-600', bgColor: 'bg-green-100', status: 'Below' }
      } else {
        return { type: 'poor', icon: TrendingUp, color: 'text-red-600', bgColor: 'bg-red-100', status: 'Above' }
      }
    } else {
      // Normal logic: higher is good (for Note)
      if (value > referenceValue) {
        return { type: 'good', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100', status: 'Above Target' }
      } else {
        return { type: 'poor', icon: TrendingDown, color: 'text-red-600', bgColor: 'bg-red-100', status: 'Below Target' }
      }
    }
  }

  // Purple Knight Entra-ID metrics
  const noteValue = getLatestValue('Note')
  const noteIndicator = getIndicator(noteValue, dataManager.getReferenceValue(CATEGORY, 'Note'), 'Note')

  const ioesFoundValue = getLatestValue('IOEs Found')
  const ioesFoundIndicator = getIndicator(ioesFoundValue, dataManager.getReferenceValue(CATEGORY, 'IOEs Found'), 'IOEs Found')

  const criticalIOEsValue = getLatestValue('Critical IOEs')
  const criticalIOEsIndicator = getIndicator(criticalIOEsValue, dataManager.getReferenceValue(CATEGORY, 'Critical IOEs'), 'Critical IOEs')

  return (
    <div className="space-y-6 mb-8">
      {/* Horizontal layout - 2:3 ratio like M365 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 metric-overview-grid">
        {/* Note - Bigger on horizontal axis like Secure Score */}
        <div className="lg:col-span-2 print:col-span-2">
          <div className="bg-white rounded-lg shadow-lg border-2 border-indigo-200 p-8 text-center hover:shadow-xl transition-all duration-300 aspect-square flex flex-col justify-center metric-card">
            <div className="mb-4">
              <div className={`w-16 h-16 ${noteIndicator.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <noteIndicator.icon className={`w-8 h-8 ${noteIndicator.color}`} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Note</h2>
            </div>
            <div className="text-5xl font-bold text-indigo-600 mb-3">
              {noteValue}
            </div>
            <div className="text-sm text-gray-600">
              Target: {dataManager.getReferenceValue(CATEGORY, 'Note')}
            </div>
            <div className={`text-sm font-medium ${noteIndicator.color} mt-2`}>
              {noteIndicator.status}
            </div>
          </div>
        </div>

        {/* IOEs Found and Critical IOEs - aligned to main metric height */}
        <div className="lg:col-span-3 print:col-span-3">
          <div className="grid grid-cols-1 gap-3 h-full">
            {/* IOEs Found */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-indigo-200 p-4 hover:shadow-xl transition-all duration-300 flex h-full metric-card">
              {/* Left side - Vertical information */}
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-sm font-bold text-gray-900 mb-2">IOEs Found</h2>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {ioesFoundValue}
                </div>
                <div className="text-xs text-gray-600">
                  Target: {dataManager.getReferenceValue(CATEGORY, 'IOEs Found')}
                </div>
              </div>

              {/* Right side - Small graphic and status */}
              <div className="w-20 flex flex-col items-center justify-center">
                <div className={`w-10 h-10 ${ioesFoundIndicator.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                  <ioesFoundIndicator.icon className={`w-5 h-5 ${ioesFoundIndicator.color}`} />
                </div>
                <div className={`text-xs font-medium ${ioesFoundIndicator.color} text-center`}>
                  {ioesFoundIndicator.status}
                </div>
              </div>
            </div>

            {/* Critical IOEs */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-indigo-200 p-4 hover:shadow-xl transition-all duration-300 flex h-full metric-card">
              {/* Left side - Vertical information */}
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-sm font-bold text-gray-900 mb-2">Critical IOEs</h2>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {criticalIOEsValue}
                </div>
                <div className="text-xs text-gray-600">
                  Target: {dataManager.getReferenceValue(CATEGORY, 'Critical IOEs')}
                </div>
              </div>

              {/* Right side - Small graphic and status */}
              <div className="w-20 flex flex-col items-center justify-center">
                <div className={`w-10 h-10 ${criticalIOEsIndicator.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                  <criticalIOEsIndicator.icon className={`w-5 h-5 ${criticalIOEsIndicator.color}`} />
                </div>
                <div className={`text-xs font-medium ${criticalIOEsIndicator.color} text-center`}>
                  {criticalIOEsIndicator.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurpleKnightEntraIDOverview
