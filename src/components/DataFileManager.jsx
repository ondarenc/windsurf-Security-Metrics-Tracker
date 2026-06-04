import React, { useState } from 'react'
import { Database, Download, Upload } from 'lucide-react'
import { systemApi } from '../api/api'

const DataFileManager = ({ onDataChanged }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleExport = async () => {
    setIsLoading(true)
    setMessage('')
    try {
      const data = await systemApi.exportData()

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
      )

      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `windsurf-backup-${Date.now()}.json`
      a.click()

      URL.revokeObjectURL(url)
      setMessage('Data exported successfully!')
    } catch (err) {
      console.error(err)
      setMessage('Export failed')
    }
    setIsLoading(false)
  }

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsLoading(true)
    setMessage('')

    try {
      const text = await file.text()
      const json = JSON.parse(text)

      await systemApi.importData(json)

      setMessage('Import successful!')
      if (onDataChanged) onDataChanged()
    } catch (err) {
      console.error(err)
      setMessage('Import failed')
    }
    setIsLoading(false)
    // Reset file input
    event.target.value = ''
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Database Export/Import</h3>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md text-sm ${
          message.includes('Error') || message.includes('failed')
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-green-50 text-green-800 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {/* Import/Export */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              <Download className="w-4 h-4" />
              {isLoading ? 'Exporting...' : 'Export Database'}
            </button>
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              {isLoading ? 'Importing...' : 'Import Database'}
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isLoading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-50 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">How it works:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Export:</strong> Download all metrics and follow-up data from the database as a JSON file</li>
            <li>• <strong>Import:</strong> Upload a JSON file to restore data into the database</li>
            <li>• <strong>Warning:</strong> Importing will clear existing data and replace it with the imported data</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DataFileManager
