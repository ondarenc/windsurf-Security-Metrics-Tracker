import React, { useState, useEffect } from 'react'
import { Gauge, TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, AlertTriangle, FileText, CheckCircle, TrendingDown as TrendingDownIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import dataManager from '../data/dataManager'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'
import { RightPanel } from '../components/dashboard/RightPanel'
import { OverviewContent } from '../components/dashboard/content/OverviewContent'
import { followupApi } from '../lib/api'

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
  const [vulnerabilityLevels, setVulnerabilityLevels] = useState({ critical: 0, high: 0, medium: 0 })

  useEffect(() => {
    const loadVulnerabilityCounts = async () => {
      try {
        const followup = await followupApi.getAll()
        const critical = followup.filter(f => f.level === 'CRITICAL').length
        const high = followup.filter(f => f.level === 'HIGH').length
        const medium = followup.filter(f => f.level === 'MEDIUM').length
        setVulnerabilityLevels({ critical, high, medium })
      } catch (error) {
        console.error('Error loading vulnerability counts:', error)
      }
    }
    loadVulnerabilityCounts()
  }, [])

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
    yellow: { border: 'border-yellow-200' },
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
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
      {/* Vulnerabilities Card */}
      <div
        onClick={() => navigate('/all-vulnerabilities')}
        className={`group bg-card rounded-xl border ${colorMap.yellow.border} p-5 text-center hover:shadow-md transition-all duration-200 cursor-pointer`}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
          <h2 className="text-base font-bold text-foreground text-center">Vulnerabilities</h2>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">
            Critical: <span className="font-bold text-red-600">{vulnerabilityLevels.critical}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            High: <span className="font-bold text-fuchsia-600">{vulnerabilityLevels.high}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Medium: <span className="font-bold text-orange-600">{vulnerabilityLevels.medium}</span>
          </div>
        </div>
      </div>
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

function RemediationStatistics() {
  const [remediationStats, setRemediationStats] = useState([])

  useEffect(() => {
    const calculateRemediationStats = async () => {
      try {
        const followup = await followupApi.getAll()
        const stats = []
        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        // Count fixed vulnerabilities in the last week
        const fixedLastWeek = followup.filter(f => 
          f.status === 'Fixed' && 
          new Date(f.created_at) >= oneWeekAgo
        ).length
        if (fixedLastWeek > 0) {
          stats.push({
            icon: <CheckCircle className="w-4 h-4 text-success" />,
            text: `Fixed ${fixedLastWeek} vulnerabilities in the last week`,
            color: 'text-success'
          })
        }

        // Count fixed critical vulnerabilities
        const fixedCritical = followup.filter(f => 
          f.status === 'Fixed' && 
          f.level === 'CRITICAL'
        ).length
        if (fixedCritical > 0) {
          stats.push({
            icon: <CheckCircle className="w-4 h-4 text-success" />,
            text: `Fixed ${fixedCritical} CRITICAL vulnerabilities overall`,
            color: 'text-success'
          })
        }

        // Count vulnerabilities that changed to "Fixed" from other statuses
        const recentlyFixed = followup.filter(f => 
          f.status === 'Fixed' && 
          new Date(f.created_at) >= oneMonthAgo
        ).length
        if (recentlyFixed > 0) {
          stats.push({
            icon: <TrendingDownIcon className="w-4 h-4 text-success" />,
            text: `${recentlyFixed} vulnerabilities resolved in the last month`,
            color: 'text-success'
          })
        }

        // Count "Accepted risk" status (shows risk management)
        const acceptedRisk = followup.filter(f => f.status === 'Accepted risk').length
        if (acceptedRisk > 0) {
          stats.push({
            icon: <CheckCircle className="w-4 h-4 text-blue-600" />,
            text: `${acceptedRisk} risks properly assessed and accepted`,
            color: 'text-blue-600'
          })
        }

        // Count current critical vulnerabilities (show progress if low)
        const currentCritical = followup.filter(f => f.level === 'CRITICAL' && f.status !== 'Fixed').length
        if (currentCritical === 0) {
          stats.push({
            icon: <CheckCircle className="w-4 h-4 text-success" />,
            text: 'No active CRITICAL vulnerabilities - excellent security posture',
            color: 'text-success'
          })
        } else if (currentCritical <= 3) {
          stats.push({
            icon: <CheckCircle className="w-4 h-4 text-success" />,
            text: `Only ${currentCritical} active CRITICAL vulnerabilities - manageable`,
            color: 'text-success'
          })
        }

        // Compare high vs critical (show positive if critical is lower)
        const currentHigh = followup.filter(f => f.level === 'HIGH' && f.status !== 'Fixed').length
        if (currentHigh > currentCritical) {
          stats.push({
            icon: <TrendingDownIcon className="w-4 h-4 text-success" />,
            text: `CRITICAL count (${currentCritical}) lower than HIGH (${currentHigh}) - prioritization working`,
            color: 'text-success'
          })
        }

        setRemediationStats(stats)
      } catch (error) {
        console.error('Error calculating remediation stats:', error)
      }
    }
    calculateRemediationStats()
  }, [])

  if (remediationStats.length === 0) return null

  return (
    <div className="bg-card rounded-xl border border-border p-6 mb-6">
      <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-success" />
        Remediation Progress
      </h3>
      <div className="space-y-3">
        {remediationStats.map((stat, index) => (
          <div key={index} className="flex items-start gap-3 text-sm">
            <span className={`mt-0.5 ${stat.color}`}>{stat.icon}</span>
            <p className="text-muted-foreground">
              {stat.text}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TrendsExplanation />
          <RemediationStatistics />
        </div>
        <OverviewContent />
      </MainContent>
      <RightPanel className="print:hidden" />
    </div>
  )
}

// Export components for use in ReportPage
export { MetricSummaryCards, TrendsExplanation, RemediationStatistics }
