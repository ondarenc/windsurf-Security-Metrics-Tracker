import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BarChart3, Database, Printer, AlertTriangle, DatabaseBackup, Plus, Table, Target, Shield, FileText } from 'lucide-react'
import dataManager from '../data/dataManager'
import DataFileManager from '../components/DataFileManager'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'
import { RightPanel } from '../components/dashboard/RightPanel'
import { metricsApi, followupApi } from '../lib/api'

const HomePage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showSettings, setShowSettings] = useState(searchParams.get('settings') === 'open')
  const [metricsCount, setMetricsCount] = useState(0)
  const [vulnerabilitiesCount, setVulnerabilitiesCount] = useState(0)
  const [totalEntries, setTotalEntries] = useState(0)

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [metrics, followup] = await Promise.all([
          metricsApi.getAll(),
          followupApi.getAll()
        ])
        setMetricsCount(metrics.length)
        setVulnerabilitiesCount(followup.length)
        setTotalEntries(metrics.length + followup.length)
      } catch (error) {
        console.error('Error loading counts:', error)
      }
    }
    loadCounts()
  }, [])

  
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <MainContent>
        {/* Dashboard Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Track and analyze your metrics
            </p>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-8 print:hidden">
            <DataFileManager onDataChanged={() => {
              navigate(0) // Refresh the page
            }} />
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reporting Column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reporting</h2>
            <div className="space-y-4">
              {/* Total Entries Button */}
              <button className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Total Entries</h3>
                </div>
                <div className="space-y-1 text-gray-600">
                  <div className="text-sm">Total: <span className="font-semibold">{totalEntries}</span></div>
                  <div className="text-sm">Metrics: <span className="font-semibold">{metricsCount}</span></div>
                  <div className="text-sm">Vulnerabilities: <span className="font-semibold">{vulnerabilitiesCount}</span></div>
                </div>
              </button>

              {/* All Metrics Button */}
              <button
                onClick={() => navigate('/all-metrics')}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Table className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">All Metrics</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  View all metrics in table format with delete capability
                </p>
              </button>

              {/* All Vulnerabilities Button */}
              <button
                onClick={() => navigate('/all-vulnerabilities')}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">All Vulnerabilities</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  View all vulnerabilities regardless of status
                </p>
              </button>

              {/* Print All Button */}
              <button
                onClick={() => navigate('/print')}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200 print:hidden"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Printer className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Print all Metrics</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Generate a printable report with all metrics and trends
                </p>
              </button>

              {/* Report Editor Button */}
              <button
                onClick={() => navigate('/report-editor')}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Report Editor</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Create and manage security reports with rich text editor
                </p>
              </button>
            </div>
          </div>

          {/* Management Column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Management</h2>
            <div className="space-y-4">
              {/* Add Entry Button */}
              <button
                onClick={() => navigate('/form')}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Add Metric</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Add new metric data with date, name, and value
                </p>
              </button>

              {/* Follow-up Manager Button */}
              <button
                onClick={() => navigate('/followup-console')}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200 print:hidden"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Add Vulnerability</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Manage and track vulnerability follow-up items
                </p>
              </button>

              {/* Import/Export Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200 print:hidden"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <DatabaseBackup className="w-5 h-5 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Import/Export</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Export and import database data
                </p>
              </button>

              {/* Metric Target Setup Button */}
              <button
                onClick={() => navigate('/metric-target-setup')}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Metric Target Setup</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Configure target values for all metric categories
                </p>
              </button>
            </div>
          </div>
        </div>
      </MainContent>
      <RightPanel />
    </div>
  )
}

export default HomePage
