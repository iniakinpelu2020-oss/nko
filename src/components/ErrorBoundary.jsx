import { Component } from 'react'

/**
 * Error boundary used around the app root, the startup curtain and the 3D
 * hero. A runtime error inside any of them used to leave an empty <div id="root">
 * — a blank white page. Here the failure is contained and something usable is
 * always on screen instead.
 *
 * Usage:
 *   <ErrorBoundary>…</ErrorBoundary>              // branded recovery card
 *   <ErrorBoundary fallback={<StaticScene />}>…</ErrorBoundary>
 *   <ErrorBoundary fallback={null} silent>…</ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    if (!this.props.silent) {
      // Kept as a console report only — never a thrown error.
      console.error('[IDEAL FRESH 360] recovered from a runtime error:', error, info)
    }
  }

  render() {
    if (!this.state.failed) return this.props.children
    if (this.props.fallback !== undefined) return this.props.fallback

    return (
      <div className="fatal" role="alert">
        <div className="fatal-card">
          <p className="eyebrow">Service still available</p>
          <h1 className="h2">Part of this page could not load.</h1>
          <p>
            The rest of the site is fine — something in this section failed on your device. Reload the page, or speak
            to a real person now.
          </p>
          <div className="fatal-actions">
            <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
              Reload the page
            </button>
            <a className="btn btn--outline" href="tel:+447831678297">
              Call +44 7831 678297
            </a>
          </div>
          <a className="fatal-mail" href="mailto:hello@idealfresh360.co.uk">
            hello@idealfresh360.co.uk
          </a>
        </div>
      </div>
    )
  }
}
