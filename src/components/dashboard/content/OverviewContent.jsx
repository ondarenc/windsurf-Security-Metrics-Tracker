import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  BarChart3,
  Search,
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
import dataManager from '../../../data/dataManager'
import { cn } from '../../../lib/utils'

function getLatestValue(metricName, category) {
  const entries = dataManager.getEntriesByName(metricName, category)
  return entries.length > 0 ? entries[0].value : null
}

function getLastDate(metricName, category) {
  const entries = dataManager.getEntriesByName(metricName, category)
  return entries.length > 0 ? new Date(entries[0].date).toLocaleDateString() : '-'
}

function getStatus(value, referenceValue, category, metricName) {
  if (value === null) return { status: 'No data', color: 'text-muted-foreground', bgColor: 'bg-muted' }

  // Inverted logic for certain metrics (lower is better)
  const invertedMetrics = ['IOEs Found', 'Critical IOEs', 'High breach risk issues', 'Medium breach risk issues', 'Low breach risk issues', 'Critical', 'High', 'Medium', 'Low']
  const isInverted = invertedMetrics.includes(metricName)

  const isGood = isInverted ? value <= referenceValue : value >= referenceValue

  if (isGood) {
    return { status: 'Above target', color: 'text-success', bgColor: 'bg-success/10' }
  }
  return { status: 'Below target', color: 'text-destructive', bgColor: 'bg-destructive/10' }
}

const categories = [
  {
    id: 'm365',
    label: 'M365 Secure Score',
    metric: 'Secure Score',
    category: 'M365',
    path: '/m365',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    chartColor: '#4a7ec7',
  },
  {
    id: 'purple-knight-ad',
    label: 'Purple Knight AD',
    metric: 'Note',
    category: 'Purple Knight AD',
    path: '/purple-knight-ad',
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    chartColor: '#7c3aed',
  },
  {
    id: 'purple-knight-entra',
    label: 'Purple Knight Entra-ID',
    metric: 'Note',
    category: 'Purple Knight Entra-ID',
    path: '/purple-knight-entra-id',
    icon: Zap,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    chartColor: '#4f46e5',
  },
  {
    id: 'security-scorecard',
    label: 'Security Scorecard',
    metric: 'My Score',
    category: 'Securityscorecard',
    path: '/security-scorecard',
    icon: BarChart3,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    chartColor: '#0d9488',
  },
  {
    id: 'project-discovery',
    label: 'Project Discovery',
    metric: 'Security Score',
    category: 'ProjectDiscovery',
    path: '/project-discovery',
    icon: Search,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    chartColor: '#0891b2',
  },
]

function getCombinedChartData() {
  // Get each metric's history sorted by date, normalize to % of target
  // Build chart rows by measurement date so all lines are visible
  const seriesData = {}
  const seriesDates = {}
  let maxLen = 0

  categories.forEach((cat) => {
    const entries = dataManager.getEntriesByName(cat.metric, cat.category)
    const ref = dataManager.getReferenceValue(cat.category, cat.metric)
    // Sort oldest → newest
    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date))
    seriesData[cat.id] = sorted.map((entry) =>
      ref > 0 ? Math.round((entry.value / ref) * 100) : entry.value
    )
    seriesDates[cat.id] = sorted.map((entry) => entry.date)
    maxLen = Math.max(maxLen, seriesData[cat.id].length)
  })

  const rows = []
  for (let i = 0; i < maxLen; i++) {
    let dateStr = ''
    for (const cat of categories) {
      if (seriesDates[cat.id] && seriesDates[cat.id][i]) {
        dateStr = new Date(seriesDates[cat.id][i]).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })
        break
      }
    }
    const row = { date: dateStr || `Entry ${i + 1}` }
    categories.forEach((cat) => {
      row[cat.id] = seriesData[cat.id][i] ?? null
    })
    rows.push(row)
  }

  return rows
}

function getLastMeasurementsTable() {
  const dateSet = new Set()
  const valueMap = {}
  categories.forEach((cat) => {
    const entries = dataManager.getEntriesByName(cat.metric, cat.category)
    entries.forEach((entry) => {
      dateSet.add(entry.date)
      if (!valueMap[entry.date]) valueMap[entry.date] = {}
      valueMap[entry.date][cat.id] = entry.value
    })
  })
  const dates = [...dateSet]
    .sort((a, b) => new Date(b) - new Date(a))
    .slice(0, 5)
  return dates.map((date) => ({
    date: new Date(date).toLocaleDateString(),
    ...valueMap[date],
  }))
}

const cardShadow = 'rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px'

export function OverviewContent() {
  const navigate = useNavigate()
  const tableData = getLastMeasurementsTable()

  return (
    <div className="space-y-6">
      {/* Recent Measurements Table */}
      <div
        className="bg-card rounded-2xl p-6 border border-border"
        style={{ boxShadow: cardShadow }}
      >
        <h3 className="text-base font-semibold text-foreground mb-4">Recent Measurements</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Date</th>
                {categories.map((cat) => (
                  <th key={cat.id} className="text-center py-2 px-3 text-muted-foreground font-medium">{cat.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-2 px-3 text-foreground font-medium">{row.date}</td>
                  {categories.map((cat) => (
                    <td key={cat.id} className={`py-2 px-3 text-center font-semibold ${row[cat.id] !== null && row[cat.id] !== undefined ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {row[cat.id] !== null && row[cat.id] !== undefined ? row[cat.id] : '-'}
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
