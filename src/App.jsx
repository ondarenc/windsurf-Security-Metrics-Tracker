import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import FormPage from './pages/FormPage'
import TablePage from './pages/TablePage'
import PurpleKnightADPage from './pages/PurpleKnightADPage'
import PurpleKnightEntraIDPage from './pages/PurpleKnightEntraIDPage'
import SecurityScorecardPage from './pages/SecurityScorecardPage'
import ProjectDiscoveryPage from './pages/ProjectDiscoveryPage'
import PrintAllPage from './pages/PrintAllPage'
import OverviewPage from './pages/OverviewPage'
import FollowupConsolePage from './pages/FollowupConsolePage'
import FollowupPage from './pages/FollowupPage'
import MetricTargetSetup from './pages/MetricTargetSetup'
import AllMetricsPage from './pages/AllMetricsPage'
import AllVulnerabilitiesPage from './pages/AllVulnerabilitiesPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/overview" element={<Navigate to="/" replace />} />
        <Route path="/m365" element={<TablePage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
        <Route path="/purple-knight-ad" element={<PurpleKnightADPage />} />
        <Route path="/purple-knight-entra-id" element={<PurpleKnightEntraIDPage />} />
        <Route path="/security-scorecard" element={<SecurityScorecardPage />} />
        <Route path="/project-discovery" element={<ProjectDiscoveryPage />} />
        <Route path="/print" element={<PrintAllPage />} />
        <Route path="/followup-console" element={<FollowupConsolePage />} />
        <Route path="/followup" element={<FollowupPage />} />
        <Route path="/metric-target-setup" element={<MetricTargetSetup />} />
        <Route path="/all-metrics" element={<AllMetricsPage />} />
        <Route path="/all-vulnerabilities" element={<AllVulnerabilitiesPage />} />
      </Routes>
    </Router>
  )
}

export default App
