import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import dataManager from '../data/dataManager'
import MetricOverview from '../components/MetricOverview'
import UnifiedMetricTable from '../components/UnifiedMetricTable'
import CombinedMetricsChart from '../components/CombinedMetricsChart'

const TablePage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Create print styles
    const style = document.createElement('style')
    style.textContent = `
      @media print {
        .metric-overview-grid {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 8px !important;
          display: grid !important;
          grid-template-columns: repeat(5, 1fr) !important;
          gap: 2px !important;
        }
        .metric-card {
          box-shadow: none !important;
          padding: 8px !important;
        }
        .page-container {
          max-width: none !important;
          margin: 0 !important;
          padding: 8px !important;
        }
      }
    `
    style.setAttribute('media', 'print')
    document.head.appendChild(style)

    return () => {
      // Cleanup
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 page-container">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">M365 Secure Score</h1>
              <p className="text-gray-600 mt-2">View and analyze all metric entries by type</p>
            </div>
            
            <div className="flex gap-3">
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

        {/* New Layout Components */}
        <MetricOverview />
        <UnifiedMetricTable />
        <CombinedMetricsChart />

        {/* Discrete Dashboard Link */}
        <div className="text-center mt-12 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-gray-600 text-sm underline transition-colors"
          >
            ← Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default TablePage
