import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FormPage from './pages/FormPage'
import TablePage from './pages/TablePage'
import PurpleKnightADPage from './pages/PurpleKnightADPage'
import PurpleKnightEntraIDPage from './pages/PurpleKnightEntraIDPage'
import SecurityScorecardPage from './pages/SecurityScorecardPage'
import ProjectDiscoveryPage from './pages/ProjectDiscoveryPage'
import PrintAllPage from './pages/PrintAllPage'
import DashboardOverviewPage from './pages/DashboardOverviewPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardOverviewPage />} />
        <Route path="/overview" element={<Navigate to="/" replace />} />
        <Route path="/m365" element={<TablePage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
        <Route path="/purple-knight-ad" element={<PurpleKnightADPage />} />
        <Route path="/purple-knight-entra-id" element={<PurpleKnightEntraIDPage />} />
        <Route path="/security-scorecard" element={<SecurityScorecardPage />} />
        <Route path="/project-discovery" element={<ProjectDiscoveryPage />} />
        <Route path="/print" element={<PrintAllPage />} />
      </Routes>
    </Router>
  )
}

export default App
