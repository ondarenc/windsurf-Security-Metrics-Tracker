import React, { useState, useEffect } from 'react'
import { FileText, Printer, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'
import { RightPanel } from '../components/dashboard/RightPanel'
import { reportsApi, followupApi } from '../lib/api'
import { MetricSummaryCards, TrendsExplanation, RemediationStatistics } from './OverviewPage'
import SecurityScorecardOverview from '../components/SecurityScorecardOverview'
import ProjectDiscoveryOverview from '../components/ProjectDiscoveryOverview'
import PurpleKnightADOverview from '../components/PurpleKnightADOverview'
import PurpleKnightEntraIDOverview from '../components/PurpleKnightEntraIDOverview'
import MetricOverview from '../components/MetricOverview'
import '../index.css'

function ReportPage() {
  const navigate = useNavigate()
  const [reportSections, setReportSections] = useState({})
  const [followupData, setFollowupData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = async () => {
    try {
      // Load all report sections
      const sections = ['Introduction', 'Executive Dashboard', 'Action Plan & Remediation Road-map', 'Conclusion', 'Appendix', 'Technical Glossary']
      const reports = await reportsApi.getAll()
      
      const sectionsMap = {}
      sections.forEach(section => {
        const sectionReports = reports.filter(r => r.section === section)
        if (sectionReports.length > 0) {
          sectionsMap[section] = sectionReports
        }
      })
      
      setReportSections(sectionsMap)
      
      // Load followup data
      const followup = await followupApi.getAll()
      setFollowupData(followup)
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading report data:', error)
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <AppSidebar className="print:hidden" />
        <MainContent pageTitle="Report" pageIcon={FileText}>
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Loading report...</div>
          </div>
        </MainContent>
        <RightPanel className="print:hidden" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar className="print:hidden" />
      <MainContent pageTitle="Report" pageIcon={FileText}>
        {/* Print Button */}
        <div className="mb-6 flex items-center gap-4 print:hidden">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors ml-auto"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>

        {/* Report Content */}
        <div className="space-y-8 print:space-y-4">
          {/* Introduction */}
          {reportSections['Introduction'] && (
            <section className="bg-card border rounded-lg p-6 print:border-none print:p-0">
              {reportSections['Introduction'].map(report => (
                <div key={report.id} className="mb-4">
                  <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: report.content }} />
                </div>
              ))}
            </section>
          )}

          {/* Executive Dashboard & Overview */}
          <section className="bg-card border rounded-lg p-6 print:border-none print:p-0">
            {reportSections['Executive Dashboard'] && reportSections['Executive Dashboard'].map(report => (
              <div key={report.id} className="mb-6">
                <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: report.content }} />
              </div>
            ))}
            <div className="print:scale-95 print:origin-top-left">
              <MetricSummaryCards />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <TrendsExplanation />
                <RemediationStatistics />
              </div>
            </div>
          </section>

          {/* Followup Content */}
          <section className="bg-card border rounded-lg p-6 print:border-none print:p-0">
            <h2 className="text-2xl font-bold mb-4">Vulnerability Follow-up</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm print:text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Level</th>
                    <th className="text-left p-2">Vulnerability</th>
                    <th className="text-left p-2">Source</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {followupData.map(item => (
                    <tr key={item.id} className="border-b print:border-t">
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                          item.level === 'HIGH' ? 'bg-fuchsia-100 text-fuchsia-700' :
                          item.level === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.level}
                        </span>
                      </td>
                      <td className="p-2">{item.vulnerability}</td>
                      <td className="p-2">{item.source}</td>
                      <td className="p-2">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Conclusion */}
          {reportSections['Conclusion'] && (
            <section className="bg-card border rounded-lg p-6 print:border-none print:p-0">
              {reportSections['Conclusion'].map(report => (
                <div key={report.id} className="mb-4">
                  <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: report.content }} />
                </div>
              ))}
            </section>
          )}

          {/* Appendix */}
          {reportSections['Appendix'] && (
            <section className="bg-card border rounded-lg p-6 print:border-none print:p-0">
              {reportSections['Appendix'].map(report => (
                <div key={report.id} className="mb-4">
                  <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: report.content }} />
                </div>
              ))}
            </section>
          )}

          {/* Security Scorecard */}
          <section className="bg-card border rounded-lg p-6 print:border-none print:p-0">
            <h2 className="text-2xl font-bold mb-4">Security Scorecard</h2>
            <div className="print:scale-95 print:origin-top-left">
              <SecurityScorecardOverview />
            </div>
          </section>

          {/* Project Discovery */}
          <section className="bg-card border rounded-lg p-6 print:border-none print:p-0">
            <h2 className="text-2xl font-bold mb-4">Project Discovery</h2>
            <div className="print:scale-95 print:origin-top-left">
              <ProjectDiscoveryOverview />
            </div>
          </section>

          {/* Purple Knight AD */}
          <section className="bg-card border rounded-lg p-6 print:border-none print:p-0">
            <h2 className="text-2xl font-bold mb-4">Purple Knight AD</h2>
            <div className="print:scale-95 print:origin-top-left">
              <PurpleKnightADOverview />
            </div>
          </section>

          {/* Purple Knight Entra-ID */}
          <section className="bg-card border rounded-lg p-6 print:border-none print:p-0">
            <h2 className="text-2xl font-bold mb-4">Purple Knight Entra-ID</h2>
            <div className="print:scale-95 print:origin-top-left">
              <PurpleKnightEntraIDOverview />
            </div>
          </section>

          {/* M365 Secure Score */}
          <section className="bg-card border rounded-lg p-6 print:border-none print:p-0">
            <h2 className="text-2xl font-bold mb-4">M365 Secure Score</h2>
            <div className="print:scale-95 print:origin-top-left">
              <MetricOverview />
            </div>
          </section>

          {/* Technical Glossary */}
          {reportSections['Technical Glossary'] && (
            <section className="bg-card border rounded-lg p-6 print:border-none print:p-0">
              {reportSections['Technical Glossary'].map(report => (
                <div key={report.id} className="mb-4">
                  <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: report.content }} />
                </div>
              ))}
            </section>
          )}
        </div>
      </MainContent>
      <RightPanel className="print:hidden" />
    </div>
  )
}

export default ReportPage