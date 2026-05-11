import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format, parseISO } from 'date-fns'

const HistoricalCharts = ({ data }) => {
  const formatChartData = (entries) => {
    return entries
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(entry => ({
        date: format(parseISO(entry.timestamp), 'MMM dd'),
        fullDate: entry.date,
        value: entry.value
      }))
  }

  const getMetricColor = (metricType) => {
    const colors = {
      'Identity': '#3b82f6', // blue
      'Data': '#10b981', // green
      'Device': '#f59e0b', // amber
      'Apps': '#8b5cf6' // purple
    }
    return colors[metricType] || '#6b7280'
  }

  const metricTypes = ['Identity', 'Data', 'Device', 'Apps']
  const chartData = metricTypes.map(metricType => ({
    type: metricType,
    entries: data.filter(entry => entry.name === metricType),
    color: getMetricColor(metricType)
  })).filter(metric => metric.entries.length > 0)

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Trends</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No historical data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Historical Trends</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartData.map((metric) => {
          const formattedData = formatChartData(metric.entries)
          
          return (
            <div key={metric.type} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: metric.color }}
                />
                {metric.type} Metrics
              </h4>
              
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    fontSize={11}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={11}
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    labelStyle={{ color: '#111827', fontWeight: 600 }}
                    formatter={(value, name) => [value, 'Score']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={metric.color}
                    strokeWidth={2}
                    dot={{ fill: metric.color, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="mt-3 text-xs text-gray-500 text-center">
                {metric.entries.length} data points • Latest: {metric.entries[0]?.value || 'N/A'}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Chart Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <span className="font-medium">X-Axis:</span> Timeline (dates)
          </div>
          <div>
            <span className="font-medium">Y-Axis:</span> Metric values (scores)
          </div>
          <div>
            <span className="font-medium">Data Points:</span> All historical entries
          </div>
          <div>
            <span className="font-medium">Update:</span> Real-time with new entries
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoricalCharts
