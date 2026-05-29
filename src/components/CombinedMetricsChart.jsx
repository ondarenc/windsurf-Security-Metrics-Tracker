import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import dataManager from '../data/dataManager'

const CombinedMetricsChart = ({ category = 'M365' }) => {
  const getChartData = () => {
    const metricTypes = dataManager.getMetricTypes(category)
    const allEntries = dataManager.getAllEntries().filter(entry => {
      if (!metricTypes.includes(entry.name)) return false;
      // If entry has a stored category, match exactly
      if (entry.category) return entry.category === category;
      // Legacy entries without category: infer from metric name
      if (category === 'M365') return true; // M365 metrics are unique
      // For shared Purple Knight metrics, legacy entries default to AD
      return category === 'Purple Knight AD';
    })

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
    if (category === 'M365') {
      const colors = {
        'Secure Score': '#dc2626', // Strong red for emphasis
        'Identity': '#3b82f6',   // Blue
        'Data': '#10b981',       // Green
        'Device': '#f59e0b',     // Amber
        'Apps': '#8b5cf6'        // Purple
      }
      return colors[metricType] || '#6b7280'
    } else if (category === 'Securityscorecard') {
      const colors = {
        'My Score': '#0d9488',              // Teal for emphasis
        'High breach risk issues': '#dc2626', // Red for critical
        'Medium breach risk issues': '#f59e0b', // Amber
        'Low breach risk issues': '#3b82f6'   // Blue
      }
      return colors[metricType] || '#6b7280'
    } else if (category === 'ProjectDiscovery') {
      const colors = {
        'Security Score': '#0891b2',  // Cyan for emphasis
        'Critical': '#dc2626',         // Red
        'High': '#f59e0b',             // Amber
        'Medium': '#3b82f6',           // Blue
        'Low': '#10b981'               // Green
      }
      return colors[metricType] || '#6b7280'
    } else {
      const colors = {
        'Note': '#7c3aed',       // Purple for emphasis
        'IOEs Found': '#8b5cf6',  // Light purple
        'Critical IOEs': '#dc2626' // Red for critical
      }
      return colors[metricType] || '#6b7280'
    }
  }

  const getMetricStrokeWidth = (metricType) => {
    if (category === 'M365') {
      return metricType === 'Secure Score' ? 3 : 1.5
    } else if (category === 'Securityscorecard') {
      return metricType === 'My Score' ? 3 : 1.5
    } else if (category === 'ProjectDiscovery') {
      return metricType === 'Security Score' ? 3 : 1.5
    } else {
      return metricType === 'Note' ? 3 : 1.5
    }
  }

  const chartData = getChartData()
  const metricTypes = dataManager.getMetricTypes(category)

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
                  category === 'M365' && entry.dataKey === 'Secure Score' ? 'text-red-600 font-bold' :
                  category === 'Securityscorecard' && entry.dataKey === 'My Score' ? 'text-teal-600 font-bold' :
                  category === 'ProjectDiscovery' && entry.dataKey === 'Security Score' ? 'text-cyan-600 font-bold' :
                  (category === 'Purple Knight AD' || category === 'Purple Knight Entra-ID') && entry.dataKey === 'Note' ? 'text-purple-600 font-bold' : 'text-gray-700'
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
          All {category} metrics in one view ({category === 'M365' ? 'Secure Score' : 'Note'} highlighted)
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
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
              connectNulls
              dot={{
                r: (category === 'M365' && metric === 'Secure Score') || (category === 'Securityscorecard' && metric === 'My Score') || (category === 'ProjectDiscovery' && metric === 'Security Score') || ((category === 'Purple Knight AD' || category === 'Purple Knight Entra-ID') && metric === 'Note') ? 5 : 3,
                fill: getMetricColor(metric)
              }}
              activeDot={{
                r: (category === 'M365' && metric === 'Secure Score') || (category === 'Securityscorecard' && metric === 'My Score') || (category === 'ProjectDiscovery' && metric === 'Security Score') || ((category === 'Purple Knight AD' || category === 'Purple Knight Entra-ID') && metric === 'Note') ? 7 : 5,
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
