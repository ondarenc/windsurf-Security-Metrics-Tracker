import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Plus, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  TrendingUp,
  Trash2,
  Settings
} from 'lucide-react'
import dataManager from '../data/dataManager'
import GlobalAverageChart from '../components/GlobalAverageChart'
import DataFileManager from '../components/DataFileManager'

const IndicatorIcon = ({ type, color }) => {
  const iconClass = `w-5 h-5 ${
    color === 'green' ? 'text-green-600' : 'text-red-600'
  }`

  switch (type) {
    case 'good':
      return <Check className={iconClass} />
    case 'improving':
      return <ArrowUp className={iconClass} />
    case 'poor':
      return <ArrowDown className={iconClass} />
    default:
      return null
  }
}

const MetricTable = ({ metricType, entries, referenceValue }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{metricType}</h3>
        <p className="text-sm text-gray-600 mt-1">
          Last {entries.length} values (Reference: {referenceValue})
        </p>
      </div>
      
      {entries.length === 0 ? (
        <div className="text-center py-8">
          <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No data for {metricType}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => {
                const indicator = dataManager.getIndicator(entry)
                return (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">{entry.value}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <IndicatorIcon type={indicator.type} color={indicator.color} />
                        <span className={`capitalize ${
                          indicator.color === 'green' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {indicator.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {referenceValue}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const TablePage = () => {
  const navigate = useNavigate()
  const [metricTables, setMetricTables] = useState([])
  const [referenceValue, setReferenceValue] = useState(dataManager.getReferenceValue())
  const [showSettings, setShowSettings] = useState(false)
  const [tempReference, setTempReference] = useState(referenceValue.toString())
  const [globalAverageData, setGlobalAverageData] = useState([])

  useEffect(() => {
    loadMetricTables()
    loadGlobalAverage()
  }, [])

  const loadMetricTables = () => {
    const metricTypes = dataManager.getMetricTypes()
    const tables = metricTypes.map(metricType => ({
      type: metricType,
      entries: dataManager.getEntriesByMetricType(metricType, 3) // Last 3 values only
    }))
    setMetricTables(tables)
  }

  const loadGlobalAverage = () => {
    const avgData = dataManager.getGlobalAverageData()
    setGlobalAverageData(avgData)
  }

  const handleReferenceUpdate = () => {
    const newValue = parseFloat(tempReference)
    if (!isNaN(newValue)) {
      dataManager.setReferenceValue(newValue)
      setReferenceValue(newValue)
      setShowSettings(false)
      loadMetricTables() // Reload to update indicators
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      dataManager.clearAllData()
      loadMetricTables()
      loadGlobalAverage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
              
              <h1 className="text-3xl font-bold text-gray-900">M365 Score</h1>
              <p className="text-gray-600 mt-2">View and analyze all metric entries by type</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              
              <button
                onClick={() => navigate('/form')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="space-y-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reference Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference Value
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={tempReference}
                      onChange={(e) => setTempReference(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter reference value"
                    />
                    <button
                      onClick={handleReferenceUpdate}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Current reference: {referenceValue}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Actions
                  </label>
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>

            <DataFileManager onDataChanged={() => {
              loadMetricTables()
              loadGlobalAverage()
            }} />
          </div>
        )}

        {/* Global Average Chart */}
        <div className="mb-8">
          <GlobalAverageChart data={globalAverageData} />
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Indicator Legend</h3>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Good (above reference)</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Improving (above reference & last entry)</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowDown className="w-4 h-4 text-red-600" />
              <span className="text-gray-700">Poor (below reference)</span>
            </div>
          </div>
        </div>

        {/* Metric Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {metricTables.map((table) => (
            <MetricTable
              key={table.type}
              metricType={table.type}
              entries={table.entries}
              referenceValue={referenceValue}
            />
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-600">Total Entries</h4>
            <p className="text-2xl font-bold text-gray-900">
              {metricTables.reduce((sum, table) => sum + table.entries.length, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-600">Above Reference</h4>
            <p className="text-2xl font-bold text-green-600">
              {metricTables.reduce((sum, table) => 
                sum + table.entries.filter(e => e.value > referenceValue).length, 0
              )}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-600">Below Reference</h4>
            <p className="text-2xl font-bold text-red-600">
              {metricTables.reduce((sum, table) => 
                sum + table.entries.filter(e => e.value <= referenceValue).length, 0
              )}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-600">Metric Types</h4>
            <p className="text-2xl font-bold text-blue-600">
              {metricTables.filter(table => table.entries.length > 0).length}/{metricTables.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TablePage
