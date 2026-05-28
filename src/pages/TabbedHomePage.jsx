import React from 'react'
import { NavLink } from 'react-router-dom'
import { BarChart3, Shield, Cloud, ShieldCheck } from 'lucide-react'
import MainTabs from '../components/MainTabs'

const TabbedHomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Security Metrics Tracker</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the metric area you want to review.
          </p>
        </div>

        <MainTabs />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NavLink
            to="/m365"
            className="group bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">M365 Secure Score</h2>
            <p className="text-gray-600 mb-4">Review Secure Score, Identity, Data, Device, and Apps metrics.</p>
            <div className="text-blue-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
              Open M365 metrics
              <span className="text-xl">→</span>
            </div>
          </NavLink>

          <NavLink
            to="/purple-knight-ad"
            className="group bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Purple Knight AD Score</h2>
            <p className="text-gray-600 mb-4">Review Note, IOEs Found, and Critical IOEs metrics.</p>
            <div className="text-purple-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
              Open Purple Knight AD
              <span className="text-xl">→</span>
            </div>
          </NavLink>

          <NavLink
            to="/purple-knight-entra-id"
            className="group bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors mb-4">
              <Cloud className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Purple Knight Entra-ID</h2>
            <p className="text-gray-600 mb-4">Review Note, IOEs Found, and Critical IOEs metrics for Entra-ID.</p>
            <div className="text-indigo-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
              Open Purple Knight Entra-ID
              <span className="text-xl">→</span>
            </div>
          </NavLink>

          <NavLink
            to="/security-scorecard"
            className="group bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors mb-4">
              <ShieldCheck className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Security Scorecard</h2>
            <p className="text-gray-600 mb-4">Review My Score and breach risk issues with grade indicators.</p>
            <div className="text-teal-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
              Open Security Scorecard
              <span className="text-xl">→</span>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default TabbedHomePage
