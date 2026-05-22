import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import PurpleKnightEntraIDOverview from '../components/PurpleKnightEntraIDOverview'
import UnifiedMetricTable from '../components/UnifiedMetricTable'
import CombinedMetricsChart from '../components/CombinedMetricsChart'
import MainTabs from '../components/MainTabs'

const PurpleKnightEntraIDPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <MainTabs />
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purple Knight Entra-ID</h1>
              <p className="text-gray-600 mt-2">View and analyze Purple Knight Entra-ID security metrics</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/form')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
            </div>
          </div>
        </div>

        {/* Purple Knight Entra-ID Overview */}
        <PurpleKnightEntraIDOverview />

        {/* Table and Charts */}
        <UnifiedMetricTable category="Purple Knight Entra-ID" />
        <CombinedMetricsChart category="Purple Knight Entra-ID" />

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

export default PurpleKnightEntraIDPage
