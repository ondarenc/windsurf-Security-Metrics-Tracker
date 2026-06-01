import React from 'react'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'
import { RightPanel } from '../components/dashboard/RightPanel'
import SecurityScorecardOverview from '../components/SecurityScorecardOverview'

export default function SecurityScorecardPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar className="print:hidden" />
      <MainContent pageTitle="Security Scorecard" pageIcon="/logo-securityscorecard.png">
        <SecurityScorecardOverview />
      </MainContent>
      <RightPanel className="print:hidden" />
    </div>
  )
}
