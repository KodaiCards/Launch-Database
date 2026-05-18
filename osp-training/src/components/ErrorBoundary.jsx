/**
 * ErrorBoundary — catches React rendering errors and displays a diagnostic panel
 * instead of unmounting the tree to a blank page.
 *
 * Wraps LessonRouter and the App root so learners see actionable error messages
 * instead of a blank screen when a component crashes.
 */

import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-ospnavy to-slate-900">
          <div className="max-w-md w-full">
            {/* Error panel */}
            <div className="rounded-lg border border-red-500/50 bg-red-950/20 backdrop-blur p-6 shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-3xl">⚠️</div>
                <div>
                  <h1 className="text-lg font-bold text-red-200">Something went wrong</h1>
                  <p className="text-sm text-red-300/80 mt-1">
                    The lesson encountered an error while rendering.
                  </p>
                </div>
              </div>

              {/* Error message */}
              <div className="mb-4 p-3 rounded bg-red-900/30 border border-red-500/20">
                <p className="text-sm font-mono text-red-100 break-words">
                  {this.state.error?.toString()}
                </p>
              </div>

              {/* Diagnostic details (dev-friendly) */}
              {this.state.errorInfo && (
                <details className="mb-4">
                  <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300 mb-2">
                    Technical details
                  </summary>
                  <div className="text-xs font-mono text-slate-400 bg-black/40 p-2 rounded border border-slate-600/50 max-h-40 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                  </div>
                </details>
              )}

              {/* Reload button */}
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.reload();
                }}
                className="w-full px-4 py-2 rounded bg-amber-500 hover:bg-amber-600 text-black font-semibold transition"
              >
                Reload page
              </button>

              {/* Back link */}
              <a
                href="#/"
                className="block mt-3 text-center text-sm text-slate-400 hover:text-amber-300 transition"
              >
                ← Back to courses
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
