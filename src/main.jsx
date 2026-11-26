import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './styles.css'
import './resilience.css'

const container = document.getElementById('root')

if (container) {
  // The markup inside #root is the static boot fallback from index.html. It is
  // visible only if the bundle never runs (blocked script, 404, old deploy);
  // React replaces it on the first successful render.
  createRoot(container).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  )
}
