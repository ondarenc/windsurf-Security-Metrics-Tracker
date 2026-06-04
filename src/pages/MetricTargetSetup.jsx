import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import dataManager from '../data/dataManager'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'

const MetricTargetSetup = () => {
  const navigate = useNavigate()
  
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

  const handleM365TargetUpdate = () => {
    const newValue = parseFloat(m365Target)
    if (!isNaN(newValue) && newValue > 0) {
      dataManager.getMetricTypes('M365').forEach(metric => {
        dataManager.setReferenceValue('M365', metric, newValue)
      })
      alert('M365 targets updated successfully!')
      navigate(0)
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
      alert('Purple Knight AD targets updated successfully!')
      navigate(0)
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
      alert('Purple Knight Entra-ID targets updated successfully!')
      navigate(0)
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
      alert('Security Scorecard targets updated successfully!')
      navigate(0)
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
      alert('Project Discovery targets updated successfully!')
      navigate(0)
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <MainContent pageTitle="Metric Target Setup">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Metric Target Setup</h1>
          </div>

          {/* M365 Secure Score Targets */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">M365 Secure Score Targets</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Value for all M365 metrics
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="number"
                value={m365Target}
                onChange={(e) => setM365Target(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter M365 target value"
              />
              <button
                onClick={handleM365TargetUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Update
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Current target: {dataManager.getReferenceValue('M365', 'Secure Score')}
            </p>
          </div>

          {/* Purple Knight AD Score Targets */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Purple Knight AD Score Targets</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update Purple Knight AD Targets
            </button>
          </div>

          {/* Purple Knight Entra-ID Targets */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Purple Knight Entra-ID Targets</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update Purple Knight Entra-ID Targets
            </button>
          </div>

          {/* Security Scorecard Targets */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Scorecard Targets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update Security Scorecard Targets
            </button>
          </div>

          {/* Project Discovery Targets */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Discovery Targets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update Project Discovery Targets
            </button>
          </div>
        </div>
      </MainContent>
    </div>
  )
}

export default MetricTargetSetup
