import { Component, type ErrorInfo, type ReactNode } from 'react'

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() { return { failed: true } }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('EnggXR interface error', error, info)
  }

  render() {
    if (this.state.failed) return <main className="fatal-state"><div><span>ENGGXR RECOVERY</span><h1>We could not load this view.</h1><p>Your saved profile is still on this device. Reload the app to continue.</p><button onClick={() => window.location.reload()}>Reload EnggXR</button></div></main>
    return this.props.children
  }
}
