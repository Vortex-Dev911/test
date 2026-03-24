import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-12 card border-dashed border-error/30 bg-error/5 space-y-6">
          <h2 className="text-3xl font-black text-error uppercase tracking-widest">Something went wrong</h2>
          <p className="text-dark-muted font-bold max-w-md">The game encountered an unexpected error. Don't worry, your stats are safe.</p>
          <button 
            className="btn btn-primary px-10"
            onClick={() => window.location.reload()}
          >
            Reload Platform
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
