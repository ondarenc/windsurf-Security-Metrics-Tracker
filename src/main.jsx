import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Import dev data generator for development
if (import.meta.env.DEV) {
  import('./data/generateDevData.js').then(module => {
    window.generateDevData = module.generateRandomEntries;
    console.log('🔧 Dev data generator loaded. Call window.generateDevData() to generate random vulnerability data.');
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
