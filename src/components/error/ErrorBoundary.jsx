import React, { Component } from "react";
import Link from "next/link";

class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by error boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-6 p-8 max-w-2xl">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Something went wrong
              </h1>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 font-mono text-sm">
                  {this.state.error?.message}
                </p>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 primaryBg text-white rounded-md"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;