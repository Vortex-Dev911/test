import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { Loading, ProtectedRoute, ErrorBoundary } from './components/Shared';
import { AuthProvider } from './context/AuthContext';

import ParticleBackground from './components/ParticleBackground';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Auth').then(m => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/Auth').then(m => ({ default: m.Signup })));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Games = lazy(() => import('./pages/Games'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Friends = lazy(() => import('./pages/Friends'));
const Gameplay = lazy(() => import('./pages/Gameplay'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ParticleBackground />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/games" element={<Games />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/play/:gameId" element={<Gameplay />} />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
