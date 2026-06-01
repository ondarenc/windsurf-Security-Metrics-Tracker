import React from 'react'
import { NavLink } from 'react-router-dom'
import { BarChart3, Calendar } from 'lucide-react'
import MainTabs from '../components/MainTabs'
import dataManager from '../data/dataManager'

const TabbedHomePage = () => {
  const getLatest = (metricName, category) => {
    const entries = dataManager.getEntriesByName(metricName, category)
    if (entries.length === 0) return { value: '-', date: '-', status: null }
    const entry = entries[0]
    const ref = dataManager.getReferenceValue(category, metricName)
    const isAbove = entry.value >= ref
    return {
      value: entry.value,
      date: new Date(entry.date).toLocaleDateString(),
      status: isAbove ? 'Above target' : 'Below target',
      statusColor: isAbove ? 'text-green-600' : 'text-red-600'
    }
  }

  const m365Card = {
    title: 'M365 Secure Score',
    mainMetric: 'Secure Score',
    category: 'M365',
    link: '/m365',
    logo: '/logo-m365.png',
    iconBg: 'bg-blue-100',
    iconHover: 'group-hover:bg-blue-200',
    scoreColor: 'text-blue-600'
  }

  const purpleRow = [
    {
      title: 'Purple Knight AD Score',
      mainMetric: 'Note',
      category: 'Purple Knight AD',
      link: '/purple-knight-ad',
      logo: '/logo-purpleknight-ad.png',
      iconBg: 'bg-purple-100',
      iconHover: 'group-hover:bg-purple-200',
      scoreColor: 'text-purple-600'
    },
    {
      title: 'Purple Knight Entra-ID',
      mainMetric: 'Note',
      category: 'Purple Knight Entra-ID',
      link: '/purple-knight-entra-id',
      logo: '/logo-purpleknight-entra.png',
      iconBg: 'bg-indigo-100',
      iconHover: 'group-hover:bg-indigo-200',
      scoreColor: 'text-indigo-600'
    }
  ]

  const bottomRow = [
    {
      title: 'Security Scorecard',
      mainMetric: 'My Score',
      category: 'Securityscorecard',
      link: '/security-scorecard',
      logo: '/logo-securityscorecard.png',
      iconBg: 'bg-teal-100',
      iconHover: 'group-hover:bg-teal-200',
      scoreColor: 'text-teal-600'
    },
    {
      title: 'Project Discovery',
      mainMetric: 'Security Score',
      category: 'ProjectDiscovery',
      link: '/project-discovery',
      logo: '/logo-projectdiscovery.png',
      iconBg: 'bg-cyan-100',
      iconHover: 'group-hover:bg-cyan-200',
      scoreColor: 'text-cyan-600'
    }
  ]

  const renderCard = (cat) => {
    const latest = getLatest(cat.mainMetric, cat.category)
    return (
      <NavLink
        key={cat.title}
        to={cat.link}
        className="group bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all duration-200"
      >
        <div className={`w-16 h-16 ${cat.iconBg} rounded-lg flex items-center justify-center ${cat.iconHover} transition-colors mb-6`}>
          <img src={cat.logo} alt={cat.title} className="w-10 h-10 object-contain" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{cat.title}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-500">Score</span>
            <span className={`text-3xl font-bold ${cat.scoreColor}`}>
              {latest.value === '-' ? '-' : latest.value}
            </span>
          </div>
          {latest.status && (
            <div className={`text-sm font-medium text-center ${latest.statusColor}`}>
              {latest.status}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>last entry: {latest.date}</span>
          </div>
        </div>
      </NavLink>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Security Metrics Tracker</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the metric area you want to review.
          </p>
        </div>

        <div className="print:hidden">
          <MainTabs />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Summary</h2>
          <a href="/overview" className="text-sm text-chart-1 hover:text-chart-1/80 font-medium">
            Open Dashboard →
          </a>
        </div>

        <div className="space-y-8">
          {/* Row 1 — M365 alone */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-xl mx-auto">
            {renderCard(m365Card)}
          </div>
          {/* Row 2 — Purple Knight cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {purpleRow.map(renderCard)}
          </div>
          {/* Row 3 — Security Scorecard + Project Discovery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bottomRow.map(renderCard)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabbedHomePage
