import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'

const HomeTab = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/')}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-white border border-gray-200 border-l-0 rounded-r-lg shadow-md px-3 py-4 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
      title="Go to Home"
      aria-label="Go to Home"
    >
      <Home className="w-5 h-5" />
    </button>
  )
}

export default HomeTab
