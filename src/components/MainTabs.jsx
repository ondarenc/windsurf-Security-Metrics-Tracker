import React from 'react'
import { NavLink } from 'react-router-dom'
import { BarChart3, Home, Shield, Cloud } from 'lucide-react'

const MainTabs = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-8 grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_1fr] gap-2">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `flex items-center justify-center gap-2 rounded-lg px-4 py-4 text-base font-semibold transition-colors ${
          isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
        }`}
      >
        <Home className="w-5 h-5" />
        Home
      </NavLink>

      <NavLink
        to="/m365"
        className={({ isActive }) => `flex items-center justify-center gap-3 rounded-lg px-6 py-4 text-lg font-semibold transition-colors ${
          isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
        }`}
      >
        <BarChart3 className="w-5 h-5" />
        M365 Secure Score
      </NavLink>

      <NavLink
        to="/purple-knight-ad"
        className={({ isActive }) => `flex items-center justify-center gap-3 rounded-lg px-6 py-4 text-lg font-semibold transition-colors ${
          isActive ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
        }`}
      >
        <Shield className="w-5 h-5" />
        Purple Knight AD Score
      </NavLink>

      <NavLink
        to="/purple-knight-entra-id"
        className={({ isActive }) => `flex items-center justify-center gap-3 rounded-lg px-6 py-4 text-lg font-semibold transition-colors ${
          isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
        }`}
      >
        <Cloud className="w-5 h-5" />
        Purple Knight Entra-ID
      </NavLink>
    </div>
  )
}

export default MainTabs
