import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, ArrowLeft } from 'lucide-react'
import followupManager from '../data/followupManager'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'

const AllVulnerabilitiesPage = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSource, setSelectedSource] = useState('All')

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    const allItems = await followupManager.getAllItems()
    setItems(allItems)
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this vulnerability?')) {
      await followupManager.deleteItem(id)
      loadItems()
    }
  }

  const handleToggleHidden = async (id) => {
    await followupManager.toggleHidden(id)
    loadItems()
  }

  const handleStatusChange = async (id, newStatus) => {
    await followupManager.updateItem(id, { status: newStatus })
    loadItems()
  }

  const getUniqueSources = () => {
    const sources = [...new Set(items.map(item => item.source))]
    return ['All', ...sources.sort()]
  }

  const filteredItems = selectedSource === 'All' 
    ? items 
    : items.filter(item => item.source === selectedSource)

  const getLevelColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600 font-semibold'
      case 'HIGH': return 'text-fuchsia-600 font-semibold'
      case 'MEDIUM': return 'text-orange-600 font-semibold'
      case 'LOW': return 'text-blue-600 font-semibold'
      default: return 'text-gray-600'
    }
  }

  const getSourceLogo = (source) => {
    switch (source) {
      case 'Purple Knight AD': return '/logo-purpleknight-ad.png'
      case 'Purple Knight Entra-ID': return '/logo-purpleknight-entra.png'
      case 'M365 Secure Score': return '/logo-m365.png'
      case 'SecurityScorecard': return '/logo-securityscorecard.png'
      case 'Project Discovery': return '/logo-projectdiscovery.png'
      default: return null
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <MainContent>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">All Vulnerabilities</h1>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Filter by Source:</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getUniqueSources().map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {filteredItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No vulnerabilities found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Hide</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Level</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Vulnerability</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Service/Ip</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Source</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Remédiation task</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Ticket</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={item.hidden}
                            onChange={() => handleToggleHidden(item.id)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className={getLevelColor(item.level)}>{item.level}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{item.vulnerability}</td>
                        <td className="py-3 px-4 text-gray-700">{item.serviceIp || '-'}</td>
                        <td className="py-3 px-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            {getSourceLogo(item.source) && (
                              <img src={getSourceLogo(item.source)} alt={item.source} className="w-5 h-5 object-contain" />
                            )}
                            <span>{item.source}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{item.remediationTask || '-'}</td>
                        <td className="py-3 px-4 text-gray-700">{item.ticket || '-'}</td>
                        <td className="py-3 px-4">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className="px-2 py-1 border borderf-lteredIgray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="Discovered">Discovered</option>
                            <option value="Open">Open</option>
                            <option value="Fix in progress">Fix in progress</option>
                            <option value="Accepted risk">Accepted risk</option>
                            <option value="Fixed">Fixed</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">Total: {items.length} vulnerabilities</p>
          </div>
        </div>
      </MainContent>
    </div>
  )
}

export default AllVulnerabilitiesPage
