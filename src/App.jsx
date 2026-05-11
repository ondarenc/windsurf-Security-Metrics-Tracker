import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FormPage from './pages/FormPage'
import TablePage from './pages/TablePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TablePage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/dashboard" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App
