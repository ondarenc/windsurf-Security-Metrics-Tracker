import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const MetricHorizontalCard = ({ metricType, entries, referenceValue }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getMetricColor = (metricType) => {
    const colors = {
      'Identity': '#3b82f6', // blue
      'Data': '#10b981', // green
      'Device': '#f59e0b', // amber
      'Apps': '#8b5cf6', // purple
      'Secure Score': '#ef4444' // red
    }
    return colors[metricType] || '#6b7280'
  }

  const formatChartData = (entries) => {
    return entries
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(entry => ({
        date: format(parseISO(entry.date), 'MMM dd'),
        fullDate: entry.date,
        value: entry.value
      }))
  }

  const getLatestValue = () => {
    return entries.length > 0 ? entries[0]?.value : 0
  }

  const getChangeIndicator = () => {
    if (entries.length < 2) return null
    const latest = entries[0]?.value || 0
    const previous = entries[1]?.value || 0
    if (latest > previous) return { icon: TrendingUp, color: 'text-green-600', text: 'up' }
    if (latest < previous) return { icon: TrendingDown, color: 'text-red-600', text: 'down' }
    return { icon: Minus, color: 'text-gray-600', text: 'same' }
  }

  const getStatusIndicator = (value) => {
    if (value >= referenceValue) return { type: 'good', color: 'text-green-600', text: 'Good' }
    return { type: 'poor', color: 'text-red-600', text: 'Poor' }
  }

  const latestValue = getLatestValue()
  const changeIndicator = getChangeIndicator()
  const statusIndicator = getStatusIndicator(latestValue)
  const chartData = formatChartData(entries)
  const metricColor = getMetricColor(metricType)

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No data for {metricType}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{metricType}</h3>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{latestValue}</div>
              <div className={`text-sm ${statusIndicator.color}`}>{statusIndicator.text}</div>
            </div>
            {changeIndicator && (
              <div className={`flex items-center gap-1 ${changeIndicator.color}`}>
                <changeIndicator.icon className="w-4 h-4" />
                <span className="text-sm">{changeIndicator.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Table - 40% (Left) */}
        <div className="w-2/5 p-4 border-r border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Last 3 Values</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entries.slice(0, 3).map((entry, index) => {
                  const status = getStatusIndicator(entry.value)
                  return (
                    <tr key={entry.id} className={index === 0 ? 'bg-blue-50' : ''}>
                      <td className="px-2 py-2 whitespace-nowrap text-gray-900">
                        {formatDate(entry.date)}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-900">
                        {entry.value}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span className={status.color}>{status.text}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mini Chart - 60% (Right) */}
        <div className="w-3/5 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Trend</h4>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                fontSize={10}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={10}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '6px',
                  fontSize: '11px'
                }}
                labelStyle={{ color: '#111827', fontWeight: 600 }}
                formatter={(value, name) => [value, 'Score']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={metricColor}
                strokeWidth={2}
                dot={{ fill: metricColor, r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default MetricHorizontalCard
