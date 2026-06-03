import React, { useState, useEffect } from 'react'
import followupManager from '../data/followupManager'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'

const FollowupPage = () => {
  const [items, setItems] = useState(followupManager.getVisibleItems())

  useEffect(() => {
    setItems(followupManager.getVisibleItems())
  }, [])

  const getLevelColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600 font-semibold bg-red-50 px-2 py-1 rounded'
      case 'HIGH': return 'text-fuchsia-600 font-semibold bg-fuchsia-50 px-2 py-1 rounded'
      case 'MEDIUM': return 'text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded'
      case 'LOW': return 'text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded'
      default: return 'text-gray-600'
    }
  }

  const getSourceLogo = (source) => {
    switch (source) {
      case 'Purple Knight AD': return '/logo-purpleknight-ad.png'
      case 'Purple Knight Entra-ID': return '/logo-purpleknight-entra.png'
      case 'M365 Secure Score': return '/logo-m365.png'
      case 'SecurityScorecard': return '/logo-securityscorecard.png'
      case 'Project Discovery': return '/logo-projectdiscovery.png'
      default: return null
    }
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <AppSidebar />
        <MainContent>
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vulnerability Follow-up</h1>
              <p className="text-gray-600 mt-1">Track and manage security vulnerabilities</p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No vulnerabilities to display</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Level</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 print-vulnerability-col">Vulnerability</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Service/Ip</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Source</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 print-remediation-col">Remédiation task</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Ticket</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className={getLevelColor(item.level)}>{item.level}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-700 print-vulnerability-cell">{item.vulnerability}</td>
                          <td className="py-3 px-4 text-gray-700">{item.serviceIp || '-'}</td>
                          <td className="py-3 px-4 text-gray-700">
                            <div className="flex items-center gap-2">
                              {getSourceLogo(item.source) && (
                                <img src={getSourceLogo(item.source)} alt={item.source} className="w-5 h-5 object-contain" />
                              )}
                              <span>{item.source}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-700 print-remediation-cell">{item.remediationTask || '-'}</td>
                          <td className="py-3 px-4 text-gray-700">{item.ticket || '-'}</td>
                          <td className="py-3 px-4 text-gray-700">{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </MainContent>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          aside {
            display: none !important;
          }
          .print-vulnerability-col,
          .print-remediation-col {
            width: 200px !important;
            max-width: 200px !important;
          }
          .print-vulnerability-cell,
          .print-remediation-cell {
            width: 200px !important;
            max-width: 200px !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            white-space: normal !important;
          }
          table {
            width: 100% !important;
            page-break-inside: auto !important;
          }
          tr {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
          }
          td {
            page-break-inside: avoid !important;
          }
          thead {
            display: table-header-group !important;
          }
          tbody {
            display: table-row-group !important;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .bg-white {
            background: white !important;
          }
          .border-gray-200 {
            border-color: #e5e7eb !important;
          }
        }
      `}</style>
    </>
  )
}

export default FollowupPage
