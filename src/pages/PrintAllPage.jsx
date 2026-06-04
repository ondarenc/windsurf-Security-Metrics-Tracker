import React, { useEffect } from 'react'
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import dataManager from '../data/dataManager'
import MetricOverview from '../components/MetricOverview'
import PurpleKnightADOverview from '../components/PurpleKnightADOverview'
import PurpleKnightEntraIDOverview from '../components/PurpleKnightEntraIDOverview'
import SecurityScorecardOverview from '../components/SecurityScorecardOverview'
import ProjectDiscoveryOverview from '../components/ProjectDiscoveryOverview'

function getStatus(value, referenceValue, metricName) {
  if (value === null) return { status: 'No data', color: 'text-gray-500' }
  const invertedMetrics = ['IOEs Found', 'Critical IOEs', 'High breach risk issues', 'Medium breach risk issues', 'Low breach risk issues', 'Critical', 'High', 'Medium', 'Low']
  const isInverted = invertedMetrics.includes(metricName)
  const isGood = isInverted ? value <= referenceValue : value >= referenceValue
  if (isGood) {
    return { status: 'Above target', color: 'text-green-600' }
  }
  return { status: 'Below target', color: 'text-red-600' }
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
    color = isInverted ? 'text-red-600' : 'text-green-600'
  } else if (diff < 0) {
    direction = 'down'
    icon = <ArrowDownRight className="w-4 h-4" />
    color = isInverted ? 'text-green-600' : 'text-red-600'
  } else {
    direction = 'stable'
    icon = <Minus className="w-4 h-4" />
    color = 'text-gray-500'
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
    statusColor = 'text-green-600'
  } else if (isGood && !wasGood) {
    statusText = ' It is now above target. Good progress!'
    statusColor = 'text-green-600'
  } else if (!isGood && wasGood) {
    statusText = ' It dropped below target. Attention needed.'
    statusColor = 'text-red-600'
  } else {
    statusText = ' It remains below target.'
    statusColor = 'text-red-600'
  }

  return { text, statusText, statusColor, icon, color, direction }
}

const PrintAllPage = () => {
  useEffect(() => {
    // Wait for charts to fully render before triggering print
    // Recharts ResponsiveContainer needs time to measure its container
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.print()
        })
      })
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  const Section = ({ title, logo, children }) => (
    <div className="print-page-break">
      <div className="flex items-center gap-4 mb-6">
        {logo && <img src={logo} alt={title} className="w-10 h-10 object-contain" />}
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>
      {children}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Print-only header */}
        <div className="print-only-header mb-8">
          <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <img src="/u.png" alt="Uditis" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-gray-900">Uditis MTS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Security Report</span>
          </div>
          <p className="text-sm text-gray-600 text-center">
            {(() => {
              const now = new Date()
              const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
              const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
              const dayName = days[now.getDay()]
              const dateNum = now.getDate()
              const monthName = months[now.getMonth()]
              const year = now.getFullYear()
              const suffix = (n) => {
                if (n > 3 && n < 21) return 'th'
                switch (n % 10) {
                  case 1: return 'st'
                  case 2: return 'nd'
                  case 3: return 'rd'
                  default: return 'th'
                }
              }
              return `${dayName} the ${dateNum}${suffix(dateNum)} ${monthName} ${year} - Confidential`
            })()}
          </p>
        </div>

        {/* Overview Section */}
        <div className="print-page-break">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Overview</h1>
          
          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {[
              { category: 'M365', metric: 'Secure Score', label: 'M365 Secure Score', logo: '/logo-m365.png' },
              { category: 'Purple Knight AD', metric: 'Note', label: 'Purple Knight AD', logo: '/logo-purpleknight-ad.png' },
              { category: 'Purple Knight Entra-ID', metric: 'Note', label: 'Purple Knight Entra-ID', logo: '/logo-purpleknight-entra.png' },
              { category: 'Securityscorecard', metric: 'My Score', label: 'Security Scorecard', logo: '/logo-securityscorecard.png' },
              { category: 'ProjectDiscovery', metric: 'Security Score', label: 'Project Discovery', logo: '/logo-projectdiscovery.png' },
            ].map((card) => {
              const latest = dataManager.getLastEntryByName(card.metric, card.category)
              const target = dataManager.getReferenceValue(card.category, card.metric)
              const status = latest ? getStatus(latest.value, target, card.metric) : { status: 'No data', color: 'text-gray-500' }
              return (
                <div
                  key={card.category}
                  className="bg-white rounded-lg border border-gray-200 p-4 text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {card.logo && <img src={card.logo} alt={card.label} className="w-8 h-8 object-contain" />}
                    <h2 className="text-base font-bold text-gray-900">{card.label}</h2>
                  </div>
                  <div className="text-lg text-gray-600 mb-1">
                    Score: <span className="font-bold text-gray-900">{latest ? latest.value : '—'}</span>
                  </div>
                  <div className={`text-sm font-medium mb-1 ${status.color}`}>
                    {status.status}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    Target: <span className="font-medium text-gray-900">{target}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Last: {latest ? new Date(latest.date).toLocaleDateString() : '—'}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Trends Explanation */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              Latest Trends
            </h3>
            <div className="space-y-4">
              {[
                { category: 'M365', metric: 'Secure Score', label: 'M365 Secure Score' },
                { category: 'Purple Knight AD', metric: 'Note', label: 'Purple Knight AD' },
                { category: 'Purple Knight Entra-ID', metric: 'Note', label: 'Purple Knight Entra-ID' },
                { category: 'Securityscorecard', metric: 'My Score', label: 'Security Scorecard' },
                { category: 'ProjectDiscovery', metric: 'Security Score', label: 'Project Discovery' },
              ].map(item => {
                const trend = getTrendExplanation(item.category, item.metric)
                if (!trend) return null
                return (
                  <div key={item.category} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`mt-0.5 ${trend.color}`}>
                      {trend.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{item.label}</div>
                      <div className="text-sm text-gray-600">
                        {trend.text}<span className={trend.statusColor}>{trend.statusText}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <Section title="M365 Secure Score" logo="/logo-m365.png">
          <MetricOverview />
        </Section>

        <Section title="Purple Knight AD Score" logo="/logo-purpleknight-ad.png">
          <PurpleKnightADOverview />
        </Section>

        <Section title="Purple Knight Entra-ID" logo="/logo-purpleknight-entra.png">
          <PurpleKnightEntraIDOverview />
        </Section>

        <Section title="Security Scorecard" logo="/logo-securityscorecard.png">
          <SecurityScorecardOverview />
        </Section>

        <Section title="Project Discovery" logo="/logo-projectdiscovery.png">
          <ProjectDiscoveryOverview />
        </Section>
      </div>

      {/* Back button visible only on screen */}
      <div className="fixed bottom-6 right-6 print:hidden">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
        >
          ← Back
        </button>
      </div>

      <style>{`
        @media print {
          .print-only-header {
            display: block !important;
          }
          .print-page-break {
            break-after: page;
            page-break-after: always;
          }
          .print-page-break:last-child {
            break-after: auto;
            page-break-after: auto;
          }
          /* Force 3-column grid for metric squares in print */
          .grid.grid-cols-1.md\\:grid-cols-3.lg\\:grid-cols-5 {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media screen {
          .print-only-header {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default PrintAllPage
