import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, TrendingUp, Save, ArrowLeft, Plus } from 'lucide-react'
import dataManager from '../data/dataManager'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'
import { RightPanel } from '../components/dashboard/RightPanel'

const FormPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    date: '',
    category: 'M365' // Default to M365
  })
  const getInitialMetricValues = (category) => {
    return dataManager.getMetricTypes(category).reduce((values, metric) => ({
      ...values,
      [metric]: ''
    }), {})
  }
  const [metricValues, setMetricValues] = useState(getInitialMetricValues('M365'))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCategoryChange = (e) => {
    const category = e.target.value
    setFormData(prev => ({
      ...prev,
      category
    }))
    setMetricValues(getInitialMetricValues(category))
  }

  const handleMetricValueChange = (metricName, e) => {
    const value = e.target.value
    setMetricValues(prev => ({
      ...prev,
      [metricName]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const metricTypes = dataManager.getMetricTypes(formData.category)

      // Validation
      if (!formData.date || metricTypes.some(metric => metricValues[metric] === '')) {
        setMessage('Please fill in all fields')
        setIsSubmitting(false)
        return
      }

      const invalidMetric = metricTypes.find(metric => isNaN(parseFloat(metricValues[metric])))
      if (invalidMetric) {
        setMessage(`Please enter a valid number for ${invalidMetric}`)
        setIsSubmitting(false)
        return
      }

      metricTypes.forEach(metric => {
        dataManager.addEntry({
          date: formData.date,
          name: metric,
          value: metricValues[metric],
          category: formData.category
        })
      })
      
      // Reset form
      setFormData({
        date: '',
        category: formData.category
      })
      setMetricValues(getInitialMetricValues(formData.category))
      
      setMessage('Data saved successfully!')
      setIsSubmitting(false)
    } catch (error) {
      setMessage('Error saving data. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <MainContent pageTitle="Add Entry" pageIcon={Plus}>
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors print:hidden"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Category Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Select Category
          </h3>
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Solution
            </label>
            <select
              value={formData.category}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="M365">M365 Metrics</option>
              <option value="Purple Knight AD">Purple Knight AD</option>
              <option value="Purple Knight Entra-ID">Purple Knight Entra-ID</option>
              <option value="Securityscorecard">Security Scorecard</option>
              <option value="ProjectDiscovery">Project Discovery</option>
            </select>
          </div>
        </div>

        {/* Main Form - Metric Values */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              For any solution, please, add all Metric values (no blank fields)
            </p>

            {/* Date Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                Metric Values
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataManager.getMetricTypes(formData.category).map(metric => (
                  <div key={metric}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {metric}
                    </label>
                    <input
                      type="number"
                      value={metricValues[metric] || ''}
                      onChange={(e) => handleMetricValueChange(metric, e)}
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Enter ${metric} value`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-md text-sm ${
                message.includes('success') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : 'Save Entries'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/table')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                View Table
              </button>
            </div>
          </form>
        </div>
      </MainContent>
      <RightPanel />
    </div>
  )
}

export default FormPage
