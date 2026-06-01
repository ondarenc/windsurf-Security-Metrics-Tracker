import React from 'react'
import { Gauge } from 'lucide-react'
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
          <button
            key={card.category}
            onClick={() => navigate(card.path)}
            className={`group bg-card rounded-xl border ${c.border} p-5 text-center hover:shadow-md transition-all duration-200`}
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
          </button>
        )
      })}
    </div>
  )
}

export default function DashboardOverviewPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar className="print:hidden" />
      <MainContent pageTitle="Overview" pageIcon={Gauge}>
        <MetricSummaryCards />
        <OverviewContent />
      </MainContent>
      <RightPanel className="print:hidden" />
    </div>
  )
}
