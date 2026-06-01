import React from 'react'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'
import { RightPanel } from '../components/dashboard/RightPanel'
import MetricOverview from '../components/MetricOverview'

export default function TablePage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar className="print:hidden" />
      <MainContent pageTitle="M365 Secure Score" pageIcon="/logo-m365.png">
        <MetricOverview />
      </MainContent>
      <RightPanel className="print:hidden" />
    </div>
  )
}
