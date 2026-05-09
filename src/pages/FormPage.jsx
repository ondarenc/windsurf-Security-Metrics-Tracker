import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, User, TrendingUp, Save, ArrowLeft } from 'lucide-react'
import dataManager from '../data/dataManager'

const FormPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    value: ''
  })
  const [referenceValue, setReferenceValue] = useState(dataManager.getReferenceValue().toString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleReferenceChange = (e) => {
    const value = e.target.value
    setReferenceValue(value)
    dataManager.setReferenceValue(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      // Validation
      if (!formData.date || !formData.name || !formData.value) {
        setMessage('Please fill in all fields')
        setIsSubmitting(false)
        return
      }

      const value = parseFloat(formData.value)
      if (isNaN(value)) {
        setMessage('Please enter a valid number for value')
        setIsSubmitting(false)
        return
      }

      // Add entry
      dataManager.addEntry(formData)
      
      // Reset form
      setFormData({
        date: '',
        name: '',
        value: ''
      })
      
      setMessage('Data saved successfully!')
      setIsSubmitting(false)
    } catch (error) {
      setMessage('Error saving data. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Add New Entry</h1>
          <p className="text-gray-600 mt-2">Fill in the form to add a new metric entry</p>
        </div>

        {/* Reference Value Setting */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Reference Value
          </h3>
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Parameter
            </label>
            <input
              type="number"
              value={referenceValue}
              onChange={handleReferenceChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter reference value"
            />
            <p className="text-xs text-gray-500 mt-1">
              Values above this will be marked as good
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Metric Type
              </label>
              <select
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select metric type</option>
                {dataManager.getMetricTypes().map(metric => (
                  <option key={metric} value={metric}>
                    {metric}
                  </option>
                ))}
              </select>
            </div>

            {/* Value Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                Value
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter metric value"
                required
              />
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
                {isSubmitting ? 'Saving...' : 'Save Entry'}
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
      </div>
    </div>
  )
}

export default FormPage
