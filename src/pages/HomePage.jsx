import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Table, BarChart3, TrendingUp, Settings, Trash2 } from 'lucide-react'
import dataManager from '../data/dataManager'
import DataFileManager from '../components/DataFileManager'

const HomePage = () => {
  const navigate = useNavigate()
  const [showSettings, setShowSettings] = useState(false)
  const [tempReference, setTempReference] = useState(dataManager.getReferenceValue().toString())
  const entries = dataManager.getAllEntries()
  const referenceValue = dataManager.getReferenceValue()

  const stats = {
    total: entries.length,
    aboveReference: entries.filter(e => e.value > referenceValue).length,
    belowReference: entries.filter(e => e.value <= referenceValue).length
  }

  const handleReferenceUpdate = () => {
    const newValue = parseFloat(tempReference)
    if (!isNaN(newValue) && newValue > 0) {
      dataManager.setReferenceValue(newValue)
      navigate(0) // Refresh the page to update stats
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      dataManager.clearAllData()
      navigate(0) // Refresh the page
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">M365 Metrics Tracker</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track and analyze your M365 Score metrics with visual indicators based on reference values
            </p>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="space-y-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Value
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
                    Current target: {referenceValue}
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
              navigate(0) // Refresh the page
            }} />
          </div>
        )}

        {/* Quick Stats */}
        {entries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</div>
              <div className="text-sm font-medium text-gray-600">Total Entries</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.aboveReference}</div>
              <div className="text-sm font-medium text-gray-600">Above Reference ({referenceValue})</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.belowReference}</div>
              <div className="text-sm font-medium text-gray-600">Below Reference</div>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => navigate('/')}
            className="group bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-left hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Table className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">View Data</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Browse all metric entries with detailed tables and charts
            </p>
            <div className="text-green-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
              View all data
              <span className="text-xl">→</span>
            </div>
          </button>

          <button
            onClick={() => navigate('/form')}
            className="group bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-left hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Add Entry</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Fill in the form to add new metric data with date, name, and value
            </p>
            <div className="text-blue-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
              Create new entry
              <span className="text-xl">→</span>
            </div>
          </button>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            Indicator Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-0.5 bg-green-600"></div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Green Check</div>
                <div className="text-sm text-gray-600">Value is above reference</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-green-600"></div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Green Arrow Up</div>
                <div className="text-sm text-gray-600">Above reference AND better than last</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-600"></div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Red Arrow Down</div>
                <div className="text-sm text-gray-600">Value is below reference</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Preview */}
        {entries.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
            <div className="space-y-2">
              {entries.slice(0, 3).map((entry) => {
                const indicator = dataManager.getIndicator(entry)
                return (
                  <div key={entry.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">{entry.name}</span>
                      <span className="text-sm text-gray-600">{entry.value}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
                        indicator.color === 'green' ? 'bg-green-600' : 'bg-red-600'
                      }`}></div>
                    </div>
                  </div>
                )
              })}
            </div>
            {entries.length > 3 && (
              <button
                onClick={() => navigate('/table')}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all {entries.length} entries →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
