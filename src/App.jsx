import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FormPage from './pages/FormPage'
import TablePage from './pages/TablePage'
import PurpleKnightADPage from './pages/PurpleKnightADPage'
import PurpleKnightEntraIDPage from './pages/PurpleKnightEntraIDPage'
import SecurityScorecardPage from './pages/SecurityScorecardPage'
import ProjectDiscoveryPage from './pages/ProjectDiscoveryPage'
import TabbedHomePage from './pages/TabbedHomePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TabbedHomePage />} />
        <Route path="/m365" element={<TablePage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/purple-knight-ad" element={<PurpleKnightADPage />} />
        <Route path="/purple-knight-entra-id" element={<PurpleKnightEntraIDPage />} />
        <Route path="/security-scorecard" element={<SecurityScorecardPage />} />
        <Route path="/project-discovery" element={<ProjectDiscoveryPage />} />
      </Routes>
    </Router>
  )
}

export default App
