import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import followupManager from '../data/followupManager'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'

const FollowupConsolePage = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState(followupManager.getAllItems())

  const [formData, setFormData] = useState({
    level: '',
    vulnerability: '',
    serviceIp: '',
    source: '',
    remediationTask: '',
    ticket: '',
    status: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.level || !formData.vulnerability || !formData.source || !formData.status) {
      alert('Please fill in all required fields')
      return
    }

    followupManager.addItem(formData)
    setItems(followupManager.getAllItems())
    setFormData({
      level: '',
      vulnerability: '',
      serviceIp: '',
      source: '',
      remediationTask: '',
      ticket: '',
      status: ''
    })
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      followupManager.deleteItem(id)
      setItems(followupManager.getAllItems())
    }
  }

  const handleToggleHidden = (id) => {
    followupManager.toggleHidden(id)
    setItems(followupManager.getAllItems())
  }

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

  return (
    <div className="flex h-screen bg-gray-50">
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
            <h1 className="text-2xl font-bold text-gray-900">Follow-up Console</h1>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Vulnerability</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select level</option>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vulnerability *</label>
                  <input
                    type="text"
                    value={formData.vulnerability}
                    onChange={(e) => setFormData({ ...formData, vulnerability: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service/Ip</label>
                  <input
                    type="text"
                    value={formData.serviceIp}
                    onChange={(e) => setFormData({ ...formData, serviceIp: e.target.value })}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source *</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select source</option>
                      <option value="Purple Knight AD">Purple Knight AD</option>
                      <option value="Purple Knight Entra-ID">Purple Knight Entra-ID</option>
                      <option value="M365 Secure Score">M365 Secure Score</option>
                      <option value="SecurityScorecard">SecurityScorecard</option>
                      <option value="Project Discovery">Project Discovery</option>
                    </select>
                    {getSourceLogo(formData.source) && (
                      <img src={getSourceLogo(formData.source)} alt={formData.source} className="w-5 h-5 object-contain" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remédiation task</label>
                  <input
                    type="text"
                    value={formData.remediationTask}
                    onChange={(e) => setFormData({ ...formData, remediationTask: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ticket</label>
                  <input
                    type="text"
                    value={formData.ticket}
                    onChange={(e) => setFormData({ ...formData, ticket: e.target.value })}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Discovered">Discovered</option>
                    <option value="Open">Open</option>
                    <option value="Fix in progress">Fix in progress</option>
                    <option value="Accepted risk">Accepted risk</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Vulnerability
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vulnerabilities</h2>
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No vulnerabilities added yet</p>
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
                    {items.map((item) => (
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
                        <td className="py-3 px-4 text-gray-700">{item.status}</td>
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
          </div>
        </div>
      </MainContent>
    </div>
  )
}

export default FollowupConsolePage
