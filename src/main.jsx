import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", background: "#0F0A1E", color: "#FDE68A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", fontFamily: "sans-serif" }}>
          <h2 style={{ color: "#F59E0B", fontSize: 24, marginBottom: 12 }}>वैदिक गणना प्रणाली / System Notice</h2>
          <p style={{ color: "rgba(241,231,208,0.85)", fontSize: 15, maxWidth: 480, lineHeight: 1.6, marginBottom: 20 }}>
            An unexpected error occurred while rendering the page. Please reload the page to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: "linear-gradient(90deg, #F59E0B, #D97706)", border: "none", color: "#0F0A1E", padding: "12px 28px", borderRadius: 20, fontSize: 15, fontWeight: 800, cursor: "pointer" }}
          >
            Reload Website / पुनः लोड करें
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

