import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Table, BarChart3, TrendingUp, Settings, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import dataManager from '../data/dataManager'
import DataFileManager from '../components/DataFileManager'
import MainTabs from '../components/MainTabs'

const HomePage = () => {
  const navigate = useNavigate()
  const [showSettings, setShowSettings] = useState(false)
  const [showTargetSettings, setShowTargetSettings] = useState(false)
  const [m365Target, setM365Target] = useState(dataManager.getReferenceValue('M365', 'Secure Score').toString())
  const [purpleKnightADTargets, setPurpleKnightADTargets] = useState({
    'Note': dataManager.getReferenceValue('Purple Knight AD', 'Note').toString(),
    'IOEs Found': dataManager.getReferenceValue('Purple Knight AD', 'IOEs Found').toString(),
    'Critical IOEs': dataManager.getReferenceValue('Purple Knight AD', 'Critical IOEs').toString()
  })
  const [purpleKnightEntraIDTargets, setPurpleKnightEntraIDTargets] = useState({
    'Note': dataManager.getReferenceValue('Purple Knight Entra-ID', 'Note').toString(),
    'IOEs Found': dataManager.getReferenceValue('Purple Knight Entra-ID', 'IOEs Found').toString(),
    'Critical IOEs': dataManager.getReferenceValue('Purple Knight Entra-ID', 'Critical IOEs').toString()
  })
  const [securityscorecardTargets, setSecurityscorecardTargets] = useState({
    'My Score': dataManager.getReferenceValue('Securityscorecard', 'My Score').toString(),
    'High breach risk issues': dataManager.getReferenceValue('Securityscorecard', 'High breach risk issues').toString(),
    'Medium breach risk issues': dataManager.getReferenceValue('Securityscorecard', 'Medium breach risk issues').toString(),
    'Low breach risk issues': dataManager.getReferenceValue('Securityscorecard', 'Low breach risk issues').toString()
  })
  const [projectDiscoveryTargets, setProjectDiscoveryTargets] = useState({
    'Security Score': dataManager.getReferenceValue('ProjectDiscovery', 'Security Score').toString(),
    'Critical': dataManager.getReferenceValue('ProjectDiscovery', 'Critical').toString(),
    'High': dataManager.getReferenceValue('ProjectDiscovery', 'High').toString(),
    'Medium': dataManager.getReferenceValue('ProjectDiscovery', 'Medium').toString(),
    'Low': dataManager.getReferenceValue('ProjectDiscovery', 'Low').toString()
  })
  const entries = dataManager.getAllEntries()
  const referenceValue = dataManager.getReferenceValue('M365', 'Secure Score')

  const stats = {
    total: entries.length,
    aboveReference: entries.filter(e => e.value > referenceValue).length,
    belowReference: entries.filter(e => e.value <= referenceValue).length
  }

  const handleM365TargetUpdate = () => {
    const newValue = parseFloat(m365Target)
    if (!isNaN(newValue) && newValue > 0) {
      dataManager.getMetricTypes('M365').forEach(metric => {
        dataManager.setReferenceValue('M365', metric, newValue)
      })
      navigate(0) // Refresh the page to update stats
    }
  }

  const handlePurpleKnightADTargetChange = (metricName, value) => {
    setPurpleKnightADTargets(prev => ({
      ...prev,
      [metricName]: value
    }))
  }

  const handlePurpleKnightADTargetUpdate = () => {
    const metricTypes = dataManager.getMetricTypes('Purple Knight AD')
    const hasInvalidValue = metricTypes.some(metric => isNaN(parseFloat(purpleKnightADTargets[metric])))
    if (!hasInvalidValue) {
      metricTypes.forEach(metric => {
        dataManager.setReferenceValue('Purple Knight AD', metric, purpleKnightADTargets[metric])
      })
      navigate(0) // Refresh the page to update stats
    }
  }

  const handlePurpleKnightEntraIDTargetChange = (metricName, value) => {
    setPurpleKnightEntraIDTargets(prev => ({
      ...prev,
      [metricName]: value
    }))
  }

  const handlePurpleKnightEntraIDTargetUpdate = () => {
    const metricTypes = dataManager.getMetricTypes('Purple Knight Entra-ID')
    const hasInvalidValue = metricTypes.some(metric => isNaN(parseFloat(purpleKnightEntraIDTargets[metric])))
    if (!hasInvalidValue) {
      metricTypes.forEach(metric => {
        dataManager.setReferenceValue('Purple Knight Entra-ID', metric, purpleKnightEntraIDTargets[metric])
      })
      navigate(0) // Refresh the page to update stats
    }
  }

  const handleSecurityscorecardTargetChange = (metricName, value) => {
    setSecurityscorecardTargets(prev => ({
      ...prev,
      [metricName]: value
    }))
  }

  const handleSecurityscorecardTargetUpdate = () => {
    const metricTypes = dataManager.getMetricTypes('Securityscorecard')
    const hasInvalidValue = metricTypes.some(metric => isNaN(parseFloat(securityscorecardTargets[metric])))
    if (!hasInvalidValue) {
      metricTypes.forEach(metric => {
        dataManager.setReferenceValue('Securityscorecard', metric, securityscorecardTargets[metric])
      })
      navigate(0) // Refresh the page to update stats
    }
  }

  const handleProjectDiscoveryTargetChange = (metricName, value) => {
    setProjectDiscoveryTargets(prev => ({
      ...prev,
      [metricName]: value
    }))
  }

  const handleProjectDiscoveryTargetUpdate = () => {
    const metricTypes = dataManager.getMetricTypes('ProjectDiscovery')
    const hasInvalidValue = metricTypes.some(metric => isNaN(parseFloat(projectDiscoveryTargets[metric])))
    if (!hasInvalidValue) {
      metricTypes.forEach(metric => {
        dataManager.setReferenceValue('ProjectDiscovery', metric, projectDiscoveryTargets[metric])
      })
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
        <div className="print:hidden">
          <MainTabs />
        </div>
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Metrics Tracker Dashboard</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track and analyze your M365 Score metrics with visual indicators based on reference values
            </p>
          </div>

        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="space-y-6 mb-8 print:hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <button
                onClick={() => setShowTargetSettings(!showTargetSettings)}
                className="w-full flex items-center justify-between text-left mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-900">Target Settings</h3>
                {showTargetSettings ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {!showTargetSettings && (
                <p className="text-sm text-gray-500 mb-2">Please open the drop-down menu to manage</p>
              )}

              {showTargetSettings && (
              <div className="space-y-6">
                <div className="border border-blue-100 rounded-lg p-4 bg-blue-50/40">
                  <h4 className="font-semibold text-gray-900 mb-3">M365 Secure Score Targets</h4>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Value for all M365 metrics
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={m365Target}
                      onChange={(e) => setM365Target(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter M365 target value"
                    />
                    <button
                      onClick={handleM365TargetUpdate}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Current target: {referenceValue}
                  </p>
                </div>

                <div className="border border-purple-100 rounded-lg p-4 bg-purple-50/40">
                  <h4 className="font-semibold text-gray-900 mb-3">Purple Knight AD Score Targets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {dataManager.getMetricTypes('Purple Knight AD').map(metric => (
                      <div key={metric}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {metric} Target
                        </label>
                        <input
                          type="number"
                          value={purpleKnightADTargets[metric]}
                          onChange={(e) => handlePurpleKnightADTargetChange(metric, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder={`Enter ${metric} target`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Current: {dataManager.getReferenceValue('Purple Knight AD', metric)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handlePurpleKnightADTargetUpdate}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Update Purple Knight AD Targets
                  </button>
                </div>

                <div className="border border-indigo-100 rounded-lg p-4 bg-indigo-50/40">
                  <h4 className="font-semibold text-gray-900 mb-3">Purple Knight Entra-ID Targets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {dataManager.getMetricTypes('Purple Knight Entra-ID').map(metric => (
                      <div key={metric}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {metric} Target
                        </label>
                        <input
                          type="number"
                          value={purpleKnightEntraIDTargets[metric]}
                          onChange={(e) => handlePurpleKnightEntraIDTargetChange(metric, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder={`Enter ${metric} target`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Current: {dataManager.getReferenceValue('Purple Knight Entra-ID', metric)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handlePurpleKnightEntraIDTargetUpdate}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Update Purple Knight Entra-ID Targets
                  </button>
                </div>

                <div className="border border-teal-100 rounded-lg p-4 bg-teal-50/40">
                  <h4 className="font-semibold text-gray-900 mb-3">Security Scorecard Targets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dataManager.getMetricTypes('Securityscorecard').map(metric => (
                      <div key={metric}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {metric} Target
                        </label>
                        <input
                          type="number"
                          value={securityscorecardTargets[metric]}
                          onChange={(e) => handleSecurityscorecardTargetChange(metric, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder={`Enter ${metric} target`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Current: {dataManager.getReferenceValue('Securityscorecard', metric)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleSecurityscorecardTargetUpdate}
                    className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                  >
                    Update Security Scorecard Targets
                  </button>
                </div>

                <div className="border border-cyan-100 rounded-lg p-4 bg-cyan-50/40">
                  <h4 className="font-semibold text-gray-900 mb-3">Project Discovery Targets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dataManager.getMetricTypes('ProjectDiscovery').map(metric => (
                      <div key={metric}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {metric} Target
                        </label>
                        <input
                          type="number"
                          value={projectDiscoveryTargets[metric]}
                          onChange={(e) => handleProjectDiscoveryTargetChange(metric, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder={`Enter ${metric} target`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Current: {dataManager.getReferenceValue('ProjectDiscovery', metric)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleProjectDiscoveryTargetUpdate}
                    className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
                  >
                    Update Project Discovery Targets
                  </button>
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
              )}
            </div>

            <DataFileManager onDataChanged={() => {
              navigate(0) // Refresh the page
            }} />
          </div>
        )}

        {/* Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Settings Card */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200 print:hidden"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Manage target values and data settings
            </p>
            <div className="text-gray-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
              Open settings
              <span className="text-xl">→</span>
            </div>
          </button>

          {/* Total Entries Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center flex flex-col justify-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</div>
            <div className="text-sm font-medium text-gray-600">Total Entries</div>
          </div>

          {/* Add Entry Card */}
          <button
            onClick={() => navigate('/form')}
            className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200"
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
                const indicator = dataManager.getIndicator(entry, entry.category || 'M365')
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
