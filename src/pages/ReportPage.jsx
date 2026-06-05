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
  const [reportParams, setReportParams] = useState(null)
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
      
      // Extract report parameters from the first report (typically Introduction)
      if (reports.length > 0) {
        const firstReport = reports[0]
        setReportParams({
          logo: firstReport.logo,
          title: firstReport.title,
          client_name: firstReport.client_name,
          report_date: firstReport.report_date,
          document_version: firstReport.document_version
        })
      }
      
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
          {/* Header, Introduction, Objectives and Methodology & Tools - Combined */}
          {reportParams && (
            <section className="bg-card border rounded-lg p-6 print:p-0 print:mb-0 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  {reportParams.logo && (
                    <img src={reportParams.logo} alt="Report Logo" className="h-20 w-auto mb-4" />
                  )}
                </div>
                <div className="flex items-start">
                  <img src="/UditisLogo125.png" alt="Fixed Logo" className="h-20 w-auto" />
                </div>
              </div>
              
              {reportParams.title && (
                <h1 className="report-title" style={{ marginTop: '2rem' }}>{reportParams.title}</h1>
              )}
              
              <div className="flex flex-col gap-1 text-sm" style={{ marginTop: '0.5rem' }}>
                {reportParams.client_name && (
                  <div className="report-field">
                    <span className="report-field-label">Client:</span> <span className="report-field-value">{reportParams.client_name}</span>
                  </div>
                )}
                {reportParams.document_version && (
                  <div className="report-field">
                    <span className="report-field-label">Version:</span> <span className="report-field-value">{reportParams.document_version}</span>
                  </div>
                )}
                {reportParams.report_date && (
                  <div className="report-field">
                    <span className="report-field-label">Date:</span> <span className="report-field-value">{new Date(reportParams.report_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Introduction */}
              {reportSections['Introduction'] && reportSections['Introduction'].map(report => (
                <div key={report.id} className="mb-4">
                  <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: report.content }} />
                </div>
              ))}
            </section>
          )}

          {/* Executive Dashboard & Overview */}
          <section className="bg-card border rounded-lg p-6 print:p-0 page-break-after">
            {reportSections['Executive Dashboard'] && reportSections['Executive Dashboard'].map(report => (
              <div key={report.id} className="mb-6">
                <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: report.content }} />
              </div>
            ))}
            <div className="print:scale-95 print:origin-top-left">
              <MetricSummaryCards />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6 pl-4">
                <TrendsExplanation />
                <RemediationStatistics />
              </div>
            </div>
          </section>

          {/* Followup Content */}
          <section className="bg-card border rounded-lg p-6 print:p-0 page-break-after">
            {/* Action Plan & Remediation Road-map */}
            {reportSections['Action Plan & Remediation Road-map'] && (
              <div className="mb-6">
                {reportSections['Action Plan & Remediation Road-map'].map(report => (
                  <div key={report.id} className="mb-4">
                    <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: report.content }} />
                  </div>
                ))}
              </div>
            )}

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
            <section className="bg-card border rounded-lg p-6 print:p-0 page-break-after">
              {reportSections['Conclusion'].map(report => (
                <div key={report.id} className="mb-4">
                  <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: report.content }} />
                </div>
              ))}
            </section>
          )}

          {/* Appendix: Detailed Analysis by Tool */}
          <section className="bg-card border rounded-lg p-6 print:p-0">
            <h2 className="text-2xl font-bold mb-4">Appendix: Detailed Analysis by Tool</h2>
            
            {reportSections['Appendix'] && (
              <div className="mb-6">
                {reportSections['Appendix'].map(report => (
                  <div key={report.id} className="mb-4">
                    <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: report.content }} />
                  </div>
                ))}
              </div>
            )}

            {/* Security Scorecard */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Security Scorecard</h3>
              <div className="print:scale-95 print:origin-top-left">
                <SecurityScorecardOverview />
              </div>
            </div>

            {/* Project Discovery */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Project Discovery</h3>
              <div className="print:scale-95 print:origin-top-left">
                <ProjectDiscoveryOverview />
              </div>
            </div>

            {/* Purple Knight AD */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Purple Knight AD</h3>
              <div className="print:scale-95 print:origin-top-left">
                <PurpleKnightADOverview />
              </div>
            </div>

            {/* Purple Knight Entra-ID */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Purple Knight Entra-ID</h3>
              <div className="print:scale-95 print:origin-top-left">
                <PurpleKnightEntraIDOverview />
              </div>
            </div>

            {/* M365 Secure Score */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">M365 Secure Score</h3>
              <div className="print:scale-95 print:origin-top-left">
                <MetricOverview />
              </div>
            </div>
          </section>

          {/* Technical Glossary */}
          {reportSections['Technical Glossary'] && (
            <section className="bg-card border rounded-lg p-6 print:p-0">
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