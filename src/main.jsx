import React, { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

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
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "var(--page)",
            color: "var(--ink)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-6)",
            textAlign: "center",
            fontFamily: "var(--font-sans)",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-8) var(--space-6)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-3)" }} aria-hidden="true">
              ☸️
            </div>
            <h2
              style={{
                color: "var(--ink)",
                fontSize: "var(--text-xl)",
                marginBottom: "var(--space-2)",
              }}
            >
              वैदिक गणना प्रणाली / System Notice
            </h2>
            <p
              style={{
                color: "var(--ink-secondary)",
                fontSize: "var(--text-base)",
                lineHeight: "var(--leading-normal)",
                marginBottom: "var(--space-6)",
              }}
            >
              An unexpected display issue occurred while loading this view. You can reload the page to refresh calculations safely.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: "var(--accent)",
                color: "#FFFFFF",
                border: "none",
                padding: "var(--space-3) var(--space-6)",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--text-base)",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              Reload Page / पुनः लोड करें
            </button>
          </div>
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
);
