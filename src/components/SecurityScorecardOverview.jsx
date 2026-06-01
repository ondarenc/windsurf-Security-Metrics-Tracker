import React from 'react'
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import dataManager from '../data/dataManager'
import { cn } from '../lib/utils'

const cardShadow = 'rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px'

const SecurityScorecardOverview = () => {
  const CATEGORY = 'Securityscorecard'

  const metrics = [
    { id: 'my-score', label: 'My Score', name: 'My Score', color: '#ef4444', main: true },
    { id: 'high-breach', label: 'High Risk', name: 'High breach risk issues', color: '#7c3aed' },
    { id: 'medium-breach', label: 'Medium Risk', name: 'Medium breach risk issues', color: '#f97316' },
    { id: 'low-breach', label: 'Low Risk', name: 'Low breach risk issues', color: '#06b6d4' },
  ]

  const getLatestValue = (metricName) => {
    const entries = dataManager.getEntriesByName(metricName, CATEGORY)
    return entries.length > 0 ? entries[0].value : null
  }

  const getLastDate = (metricName) => {
    const entries = dataManager.getEntriesByName(metricName, CATEGORY)
    return entries.length > 0 ? new Date(entries[0].date).toLocaleDateString() : '-'
  }

  const getPreviousValue = (metricName) => {
    const entries = dataManager.getEntriesByName(metricName, CATEGORY)
    return entries.length > 1 ? entries[1].value : null
  }

  const getGrade = (score) => {
    if (score >= 90) return { letter: 'A', color: 'text-green-600', bg: 'bg-green-50', bar: 'bg-green-500', label: 'Lowest breach likelihood' }
    if (score >= 80) return { letter: 'B', color: 'text-blue-600', bg: 'bg-blue-50', bar: 'bg-blue-500', label: 'Low risk' }
    if (score >= 70) return { letter: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50', bar: 'bg-yellow-500', label: 'Moderate risk' }
    if (score >= 60) return { letter: 'D', color: 'text-orange-600', bg: 'bg-orange-50', bar: 'bg-orange-500', label: 'Elevated risk' }
    return { letter: 'F', color: 'text-red-600', bg: 'bg-red-50', bar: 'bg-red-500', label: 'High risk' }
  }

  const getIndicator = (value, previousValue) => {
    if (previousValue === null) {
      return { icon: Minus, color: 'text-muted-foreground', status: 'No prior data' }
    }
    if (value < previousValue) {
      return { icon: TrendingDown, color: 'text-success', status: 'Improving' }
    } else if (value > previousValue) {
      return { icon: TrendingUp, color: 'text-destructive', status: 'Worsening' }
    } else {
      return { icon: Minus, color: 'text-muted-foreground', status: 'Stable' }
    }
  }

  const getChartData = () => {
    const seriesData = {}
    const seriesDates = {}
    let maxLen = 0
    metrics.forEach((m) => {
      const entries = dataManager.getEntriesByName(m.name, CATEGORY)
      const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date))
      seriesData[m.id] = sorted.map((entry) => entry.value)
      seriesDates[m.id] = sorted.map((entry) => entry.date)
      maxLen = Math.max(maxLen, seriesData[m.id].length)
    })
    const rows = []
    for (let i = 0; i < maxLen; i++) {
      let dateStr = ''
      for (const m of metrics) {
        if (seriesDates[m.id] && seriesDates[m.id][i]) {
          dateStr = new Date(seriesDates[m.id][i]).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })
          break
        }
      }
      const row = { date: dateStr || `Entry ${i + 1}` }
      metrics.forEach((m) => {
        row[m.id] = seriesData[m.id][i] ?? null
      })
      rows.push(row)
    }
    return rows
  }

  const getTableData = () => {
    const dateSet = new Set()
    const valueMap = {}
    metrics.forEach((m) => {
      const entries = dataManager.getEntriesByName(m.name, CATEGORY)
      entries.forEach((entry) => {
        dateSet.add(entry.date)
        if (!valueMap[entry.date]) valueMap[entry.date] = {}
        valueMap[entry.date][m.id] = entry.value
      })
    })
    const dates = [...dateSet].sort((a, b) => new Date(b) - new Date(a)).slice(0, 3)
    return dates.map((date) => ({
      date: new Date(date).toLocaleDateString(),
      ...valueMap[date],
    }))
  }

  const chartData = getChartData()
  const tableData = getTableData()

  return (
    <div className="space-y-6 mb-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const value = getLatestValue(m.name)
          const lastDate = getLastDate(m.name)
          if (m.name === 'My Score') {
            const grade = getGrade(value ?? 0)
            return (
              <div
                key={m.id}
                className="bg-card rounded-2xl p-4 border border-border min-w-0"
                style={{ boxShadow: cardShadow }}
              >
                <p className="text-xs font-bold text-foreground mb-2 truncate">{m.label}</p>
                <div className="flex items-center justify-between mb-1 gap-2">
                  <p className="text-xl font-semibold text-foreground shrink-0">
                    {value !== null ? value : '-'}
                  </p>
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap ${grade.bg} ${grade.color}`}>
                    {grade.letter}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mb-1 truncate">{grade.label}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span className="truncate">{lastDate}</span>
                </p>
              </div>
            )
          }
          const prev = getPreviousValue(m.name)
          const indicator = getIndicator(value ?? 0, prev)
          const Icon = indicator.icon
          return (
            <div
              key={m.id}
              className="bg-card rounded-2xl p-4 border border-border min-w-0"
              style={{ boxShadow: cardShadow }}
            >
              <p className="text-xs font-bold text-foreground mb-2 truncate">{m.label}</p>
              <div className="flex items-center justify-between mb-1 gap-2">
                <p className="text-xl font-semibold text-foreground shrink-0">
                  {value !== null ? value : '-'}
                </p>
                <div className={cn('flex items-center gap-1 text-xs shrink-0', indicator.color)}>
                  <Icon className="w-3 h-3" />
                  <span className="font-medium whitespace-nowrap">{indicator.status}</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                <Clock className="w-3 h-3 shrink-0" />
                <span className="truncate">{lastDate}</span>
              </p>
            </div>
          )
        })}
      </div>

      {/* Trend Chart */}
      <div className="bg-card rounded-2xl p-6 border border-border" style={{ boxShadow: cardShadow }}>
        <h3 className="text-base font-semibold text-foreground mb-6">Metric Trends</h3>
        <div className="h-[280px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7ea" />
                <XAxis dataKey="date" tick={{ fill: '#767d85', fontSize: 10 }} axisLine={{ stroke: '#e5e7ea' }} label={{ value: 'Measurement dates', position: 'insideBottom', offset: -5, fill: '#767d85', fontSize: 10 }} />
                <YAxis tick={{ fill: '#767d85', fontSize: 12 }} axisLine={{ stroke: '#e5e7ea' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7ea', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelFormatter={(label) => label}
                />
                {metrics.map((m) => (
                  <Line key={m.id} type="monotone" dataKey={m.id} stroke={m.color} strokeWidth={m.main ? 3 : 2} dot={false} connectNulls={true} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">No trend data available</div>
          )}
        </div>
      </div>

      {/* Recent Measurements Table */}
      <div className="bg-card rounded-2xl p-6 border border-border" style={{ boxShadow: cardShadow }}>
        <h3 className="text-base font-semibold text-foreground mb-4">Recent Measurements</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Date</th>
                {metrics.map((m) => (
                  <th key={m.id} className="text-center py-2 px-3 text-muted-foreground font-medium">{m.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-2 px-3 text-foreground font-medium">{row.date}</td>
                  {metrics.map((m) => (
                    <td key={m.id} className={`py-2 px-3 text-center font-semibold ${row[m.id] !== null && row[m.id] !== undefined ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {row[m.id] !== null && row[m.id] !== undefined ? row[m.id] : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SecurityScorecardOverview
