import React from 'react'
import { AppSidebar } from '../components/dashboard/AppSidebar'
import { MainContent } from '../components/dashboard/MainContent'
import { RightPanel } from '../components/dashboard/RightPanel'
import PurpleKnightEntraIDOverview from '../components/PurpleKnightEntraIDOverview'

export default function PurpleKnightEntraIDPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar className="print:hidden" />
      <MainContent pageTitle="Purple Knight Entra-ID" pageIcon="/logo-purpleknight-entra.png">
        <PurpleKnightEntraIDOverview />
      </MainContent>
      <RightPanel className="print:hidden" />
    </div>
  )
}
