import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export const Loading = () => (
  <div className="min-h-screen bg-dark-bg flex items-center justify-center flex-col gap-6 animate-pulse">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20"></div>
    <p className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      GAMEHUB PRO
    </p>
  </div>
);

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  return children;
};

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error('Uncaught error:', error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-12 card border-dashed border-error/30 bg-error/5 space-y-6">
          <h2 className="text-3xl font-black text-error uppercase tracking-widest">Something went wrong</h2>
          <button className="btn btn-primary px-10" onClick={() => window.location.reload()}>Reload Platform</button>
        </div>
      );
    }
    return this.props.children;
  }
}
