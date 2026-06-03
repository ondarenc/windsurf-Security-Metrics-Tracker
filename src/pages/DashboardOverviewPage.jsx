import React from 'react'
import { Gauge, TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import dataManager from '../data/dataManager'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'
import { RightPanel } from '../components/dashboard/RightPanel'
import { OverviewContent } from '../components/dashboard/content/OverviewContent'

function getStatus(value, referenceValue, metricName) {
  if (value === null) return { status: 'No data', color: 'text-muted-foreground' }
  const invertedMetrics = ['IOEs Found', 'Critical IOEs', 'High breach risk issues', 'Medium breach risk issues', 'Low breach risk issues', 'Critical', 'High', 'Medium', 'Low']
  const isInverted = invertedMetrics.includes(metricName)
  const isGood = isInverted ? value <= referenceValue : value >= referenceValue
  if (isGood) {
    return { status: 'Above target', color: 'text-success' }
  }
  return { status: 'Below target', color: 'text-destructive' }
}

function MetricSummaryCards() {
  const navigate = useNavigate()
  const metricCards = [
    { category: 'M365', metric: 'Secure Score', label: 'M365 Secure Score', logo: '/logo-m365.png', color: 'blue', path: '/m365' },
    { category: 'Purple Knight AD', metric: 'Note', label: 'Purple Knight AD', logo: '/logo-purpleknight-ad.png', color: 'purple', path: '/purple-knight-ad' },
    { category: 'Purple Knight Entra-ID', metric: 'Note', label: 'Purple Knight Entra-ID', logo: '/logo-purpleknight-entra.png', color: 'indigo', path: '/purple-knight-entra-id' },
    { category: 'Securityscorecard', metric: 'My Score', label: 'Security Scorecard', logo: '/logo-securityscorecard.png', color: 'teal', path: '/security-scorecard' },
    { category: 'ProjectDiscovery', metric: 'Security Score', label: 'Project Discovery', logo: '/logo-projectdiscovery.png', color: 'cyan', path: '/project-discovery' },
  ]
  const colorMap = {
    blue: { border: 'border-blue-200' },
    purple: { border: 'border-purple-200' },
    indigo: { border: 'border-indigo-200' },
    teal: { border: 'border-teal-200' },
    cyan: { border: 'border-cyan-200' },
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {metricCards.map((card) => {
        const latest = dataManager.getLastEntryByName(card.metric, card.category)
        const target = dataManager.getReferenceValue(card.category, card.metric)
        const status = latest ? getStatus(latest.value, target, card.metric) : { status: 'No data', color: 'text-muted-foreground' }
        const c = colorMap[card.color]
        return (
          <div
            key={card.category}
            onClick={() => navigate(card.path)}
            className={`group bg-card rounded-xl border ${c.border} p-5 text-center hover:shadow-md transition-all duration-200 cursor-pointer`}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              {card.logo && <img src={card.logo} alt={card.label} className="w-8 h-8 object-contain" />}
              <h2 className="text-base font-bold text-foreground text-center">{card.label}</h2>
            </div>
            <div className="text-lg text-muted-foreground mb-1">
              Score: <span className="font-bold text-foreground">{latest ? latest.value : '—'}</span>
            </div>
            <div className={`text-sm font-medium mb-1 ${status.color}`}>
              {status.status}
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              Target score: <span className="font-medium text-foreground">{target}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Last measurement: {latest ? new Date(latest.date).toLocaleDateString() : '—'}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getTrendExplanation(category, metricName) {
  const entries = dataManager.getEntriesByName(metricName, category)
  if (entries.length < 2) return null

  const latest = entries[0]
  const previous = entries[1]
  const diff = latest.value - previous.value
  const absDiff = Math.abs(diff)
  const reference = dataManager.getReferenceValue(category, metricName)
  const invertedMetrics = ['IOEs Found', 'Critical IOEs', 'High breach risk issues', 'Medium breach risk issues', 'Low breach risk issues', 'Critical', 'High', 'Medium', 'Low']
  const isInverted = invertedMetrics.includes(metricName)

  let direction, icon, color
  if (diff > 0) {
    direction = 'up'
    icon = <ArrowUpRight className="w-4 h-4" />
    color = isInverted ? 'text-destructive' : 'text-success'
  } else if (diff < 0) {
    direction = 'down'
    icon = <ArrowDownRight className="w-4 h-4" />
    color = isInverted ? 'text-success' : 'text-destructive'
  } else {
    direction = 'stable'
    icon = <Minus className="w-4 h-4" />
    color = 'text-muted-foreground'
  }

  const isGood = isInverted ? latest.value <= reference : latest.value >= reference
  const wasGood = isInverted ? previous.value <= reference : previous.value >= reference

  let text = ''
  if (direction === 'stable') {
    text = `remained stable at ${latest.value}.`
  } else {
    const changeWord = direction === 'up' ? 'increased' : 'decreased'
    text = `${changeWord} from ${previous.value} to ${latest.value} (${absDiff > 0 ? 'by ' + absDiff : 'no change'}).`
  }

  let statusText = ''
  let statusColor = ''
  if (isGood && wasGood) {
    statusText = ' It stays above target.'
    statusColor = 'text-success'
  } else if (isGood && !wasGood) {
    statusText = ' It is now above target. Good progress!'
    statusColor = 'text-success'
  } else if (!isGood && wasGood) {
    statusText = ' It dropped below target. Attention needed.'
    statusColor = 'text-destructive'
  } else {
    statusText = ' It remains below target.'
    statusColor = 'text-destructive'
  }

  return { text, statusText, statusColor, icon, color, direction }
}

function TrendsExplanation() {
  const items = [
    { category: 'M365', metric: 'Secure Score', label: 'M365 Secure Score' },
    { category: 'Purple Knight AD', metric: 'Note', label: 'Purple Knight AD' },
    { category: 'Purple Knight Entra-ID', metric: 'Note', label: 'Purple Knight Entra-ID' },
    { category: 'Securityscorecard', metric: 'My Score', label: 'Security Scorecard' },
    { category: 'ProjectDiscovery', metric: 'Security Score', label: 'Project Discovery' },
  ]

  const trends = items.map(item => {
    const trend = getTrendExplanation(item.category, item.metric)
    return trend ? { ...item, ...trend } : null
  }).filter(Boolean)

  if (trends.length === 0) return null

  return (
    <div className="bg-card rounded-xl border border-border p-6 mb-6">
      <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Latest Trends
      </h3>
      <div className="space-y-3">
        {trends.map((t) => (
          <div key={t.label} className="flex items-start gap-3 text-sm">
            <span className={`mt-0.5 ${t.color}`}>{t.icon}</span>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t.label}</span>{' '}
              {t.text}
              <span className={t.statusColor}>{t.statusText}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardOverviewPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar className="print:hidden" />
      <MainContent pageTitle="Overview" pageIcon={Gauge}>
        <MetricSummaryCards />
        <TrendsExplanation />
        <OverviewContent />
      </MainContent>
      <RightPanel className="print:hidden" />
    </div>
  )
}
