// Fixed import
import React from 'react';
import { ERROR_BOUNDARY } from '../constants';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    if (import.meta.env.MODE === 'development') {
      logError('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <h2 className="error-boundary-title">{ERROR_BOUNDARY.TITLE}</h2>
            <p className="error-boundary-message">
              {ERROR_BOUNDARY.MESSAGE}
            </p>
            {import.meta.env.MODE === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary className="error-boundary-summary">{ERROR_BOUNDARY.ERROR_DETAILS}</summary>
                <pre className="error-boundary-stack">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <button 
              className="error-boundary-button"
              onClick={() => window.location.reload()}
            >
              {ERROR_BOUNDARY.REFRESH_BUTTON}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 