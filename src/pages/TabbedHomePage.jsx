import React from 'react'
import { NavLink } from 'react-router-dom'
import { BarChart3, Shield, Cloud, ShieldCheck, Search, Calendar } from 'lucide-react'
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

  const categories = [
    {
      title: 'M365 Secure Score',
      mainMetric: 'Secure Score',
      category: 'M365',
      link: '/m365',
      icon: BarChart3,
      iconBg: 'bg-blue-100',
      iconHover: 'group-hover:bg-blue-200',
      iconColor: 'text-blue-600',
      scoreColor: 'text-blue-600'
    },
    {
      title: 'Purple Knight AD Score',
      mainMetric: 'Note',
      category: 'Purple Knight AD',
      link: '/purple-knight-ad',
      icon: Shield,
      iconBg: 'bg-purple-100',
      iconHover: 'group-hover:bg-purple-200',
      iconColor: 'text-purple-600',
      scoreColor: 'text-purple-600'
    },
    {
      title: 'Purple Knight Entra-ID',
      mainMetric: 'Note',
      category: 'Purple Knight Entra-ID',
      link: '/purple-knight-entra-id',
      icon: Cloud,
      iconBg: 'bg-indigo-100',
      iconHover: 'group-hover:bg-indigo-200',
      iconColor: 'text-indigo-600',
      scoreColor: 'text-indigo-600'
    },
    {
      title: 'Security Scorecard',
      mainMetric: 'My Score',
      category: 'Securityscorecard',
      link: '/security-scorecard',
      icon: ShieldCheck,
      iconBg: 'bg-teal-100',
      iconHover: 'group-hover:bg-teal-200',
      iconColor: 'text-teal-600',
      scoreColor: 'text-teal-600'
    },
    {
      title: 'Project Discovery',
      mainMetric: 'Security Score',
      category: 'ProjectDiscovery',
      link: '/project-discovery',
      icon: Search,
      iconBg: 'bg-cyan-100',
      iconHover: 'group-hover:bg-cyan-200',
      iconColor: 'text-cyan-600',
      scoreColor: 'text-cyan-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Security Metrics Tracker</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the metric area you want to review.
          </p>
        </div>

        <div className="print:hidden">
          <MainTabs />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon
            const latest = getLatest(cat.mainMetric, cat.category)
            return (
              <NavLink
                key={cat.title}
                to={cat.link}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-12 h-12 ${cat.iconBg} rounded-lg flex items-center justify-center ${cat.iconHover} transition-colors mb-4`}>
                  <Icon className={`w-6 h-6 ${cat.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{cat.title}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Score</span>
                    <span className={`text-2xl font-bold ${cat.scoreColor}`}>
                      {latest.value === '-' ? '-' : latest.value}
                    </span>
                  </div>
                  {latest.status && (
                    <div className={`text-sm font-medium ${latest.statusColor}`}>
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
          })}
        </div>
      </div>
    </div>
  )
}

export default TabbedHomePage
