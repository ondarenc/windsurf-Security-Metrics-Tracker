import React, { useState } from 'react'
import { Database, Download, Upload, RefreshCw, FileText, Trash2 } from 'lucide-react'
import dataManager from '../data/dataManager'

const DataFileManager = ({ onDataChanged }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const switchToSampleData = async () => {
    setIsLoading(true)
    setMessage('')
    try {
      // Check if there's existing data and warn user
      const currentData = dataManager.getAllEntries()
      if (currentData.length > 0) {
        const confirmed = window.confirm(
          'This action will remove your current data. Are you sure you exported your data BEFORE continuing?'
        )
        if (!confirmed) {
          setIsLoading(false)
          return
        }
      }
      
      await dataManager.switchDataFile('sample-data.json')
      setMessage('Sample data loaded successfully!')
      if (onDataChanged) onDataChanged()
    } catch (error) {
      setMessage('Error loading sample data')
      console.error(error)
    }
    setIsLoading(false)
  }

  const switchToEmptyData = async () => {
    setIsLoading(true)
    setMessage('')
    try {
      // Check if there's existing data and warn user
      const currentData = dataManager.getAllEntries()
      if (currentData.length > 0) {
        const confirmed = window.confirm(
          'This action will remove your current data. Are you sure you exported your data BEFORE continuing?'
        )
        if (!confirmed) {
          setIsLoading(false)
          return
        }
      }
      
      await dataManager.switchDataFile('empty-data.json')
      setMessage('Empty data loaded successfully!')
      if (onDataChanged) onDataChanged()
    } catch (error) {
      setMessage('Error loading empty data')
      console.error(error)
    }
    setIsLoading(false)
  }

  const exportData = () => {
    try {
      const data = dataManager.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `m365-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setMessage('Data exported successfully!')
    } catch (error) {
      setMessage('Error exporting data')
      console.error(error)
    }
  }

  const importData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (dataManager.importData(data)) {
          setMessage('Data imported successfully!')
          if (onDataChanged) onDataChanged()
        } else {
          setMessage('Error importing data - invalid format')
        }
      } catch (error) {
        setMessage('Error reading file - invalid JSON')
        console.error(error)
      }
    }
    reader.readAsText(file)
    // Reset file input
    event.target.value = ''
  }

  const clearLocalStorage = () => {
    if (window.confirm('Are you sure you want to clear all local data? This will reset to the default data file.')) {
      localStorage.removeItem('metricsData')
      window.location.reload()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md text-sm ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-800 border border-red-200' 
            : 'bg-green-50 text-green-800 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {/* Data File Switcher */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Switch Data Source</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={switchToSampleData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {isLoading ? 'Loading...' : 'Load Sample Data'}
            </button>
            <button
              onClick={switchToEmptyData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {isLoading ? 'Loading...' : 'Load Empty Data'}
            </button>
          </div>
        </div>

        {/* Import/Export */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Import/Export Data</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <label className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
            <button
              onClick={clearLocalStorage}
              className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Local
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-50 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">How it works:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Sample Data:</strong> Pre-populated with example M365 scores</li>
            <li>• <strong>Empty Data:</strong> Fresh start with no entries</li>
            <li>• <strong>Export:</strong> Download your data as JSON file</li>
            <li>• <strong>Import:</strong> Upload data from a JSON file</li>
            <li>• <strong>Reset:</strong> Clear local storage and reload</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DataFileManager
