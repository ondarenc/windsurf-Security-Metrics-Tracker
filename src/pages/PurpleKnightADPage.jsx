import React from 'react'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'
import { RightPanel } from '../components/dashboard/RightPanel'
import PurpleKnightADOverview from '../components/PurpleKnightADOverview'

export default function PurpleKnightADPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar className="print:hidden" />
      <MainContent pageTitle="Purple Knight AD" pageIcon="/logo-purpleknight-ad.png">
        <PurpleKnightADOverview />
      </MainContent>
      <RightPanel className="print:hidden" />
    </div>
  )
}
