import React, { useEffect } from 'react'
import MetricOverview from '../components/MetricOverview'
import PurpleKnightADOverview from '../components/PurpleKnightADOverview'
import PurpleKnightEntraIDOverview from '../components/PurpleKnightEntraIDOverview'
import SecurityScorecardOverview from '../components/SecurityScorecardOverview'
import ProjectDiscoveryOverview from '../components/ProjectDiscoveryOverview'

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
