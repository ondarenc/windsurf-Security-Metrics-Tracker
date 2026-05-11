import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import dataManager from '../data/dataManager'

const CombinedMetricsChart = () => {
  const getChartData = () => {
    const allEntries = dataManager.getAllEntries()
    const metricTypes = ['Secure Score', 'Identity', 'Data', 'Device', 'Apps']
    
    // Get all entries and group by date
    const dateGroups = {}
    allEntries.forEach(entry => {
      if (!dateGroups[entry.date]) {
        dateGroups[entry.date] = {}
      }
      dateGroups[entry.date][entry.name] = entry.value
    })
    
    // Convert to chart data and sort by date
    const chartData = Object.entries(dateGroups)
      .map(([date, metrics]) => ({
        date: format(parseISO(allEntries.find(e => e.date === date)?.timestamp || `${date}T10:00:00.000Z`), 'MMM dd, yyyy'),
        fullDate: date,
        ...metrics
      }))
      .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
      .slice(-10) // Show last 10 entries
    
    return chartData
  }

  const getMetricColor = (metricType) => {
    const colors = {
      'Secure Score': '#dc2626', // Strong red for emphasis
      'Identity': '#3b82f6',   // Blue
      'Data': '#10b981',       // Green
      'Device': '#f59e0b',     // Amber
      'Apps': '#8b5cf6'        // Purple
    }
    return colors[metricType] || '#6b7280'
  }

  const getMetricStrokeWidth = (metricType) => {
    return metricType === 'Secure Score' ? 3 : 1.5
  }

  const chartData = getChartData()
  const metricTypes = ['Secure Score', 'Identity', 'Data', 'Device', 'Apps']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getMetricColor(entry.dataKey) }}
              />
              <span 
                className={`font-medium ${
                  entry.dataKey === 'Secure Score' ? 'text-red-600 font-bold' : 'text-gray-700'
                }`}
              >
                {entry.dataKey}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Combined Metrics Trend</h3>
        <p className="text-sm text-gray-600 mt-1">
          All metrics in one view (Secure Score highlighted)
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
            domain={[0, 'dataMax + 10']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px'
            }}
            iconType="line"
          />
          {metricTypes.map(metric => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={getMetricColor(metric)}
              strokeWidth={getMetricStrokeWidth(metric)}
              dot={{ 
                r: metric === 'Secure Score' ? 5 : 3,
                fill: getMetricColor(metric)
              }}
              activeDot={{ 
                r: metric === 'Secure Score' ? 7 : 5,
                fill: getMetricColor(metric)
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CombinedMetricsChart
