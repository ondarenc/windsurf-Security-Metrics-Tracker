import React from 'react'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'
import { RightPanel } from '../components/dashboard/RightPanel'
import ProjectDiscoveryOverview from '../components/ProjectDiscoveryOverview'

export default function ProjectDiscoveryPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar className="print:hidden" />
      <MainContent pageTitle="Project Discovery" pageIcon="/logo-projectdiscovery.png">
        <ProjectDiscoveryOverview />
      </MainContent>
      <RightPanel className="print:hidden" />
    </div>
  )
}
