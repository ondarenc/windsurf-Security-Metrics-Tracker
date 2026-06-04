import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, ArrowLeft } from 'lucide-react'
import { metricsApi } from '../lib/api'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'

const AllMetricsPage = () => {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMetrics()
  }, [])

  const loadMetrics = async () => {
    try {
      const data = await metricsApi.getAll()
      setMetrics(data)
    } catch (error) {
      console.error('Error loading metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this metric?')) {
      try {
        await metricsApi.delete(id)
        loadMetrics()
      } catch (error) {
        console.error('Error deleting metric:', error)
        alert('Failed to delete metric')
      }
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <MainContent>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">All Metrics</h1>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Metric Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">No metrics found</td>
                    </tr>
                  ) : (
                    metrics.map((metric) => (
                      <tr key={metric.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-700">{metric.id}</td>
                        <td className="py-3 px-4 text-gray-700">{metric.metric_type}</td>
                        <td className="py-3 px-4 text-gray-700">{metric.metric_name}</td>
                        <td className="py-3 px-4 text-gray-700">{metric.value}</td>
                        <td className="py-3 px-4 text-gray-700">{metric.date}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDelete(metric.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">Total: {metrics.length} metrics</p>
          </div>
        </div>
      </MainContent>
    </div>
  )
}

export default AllMetricsPage
