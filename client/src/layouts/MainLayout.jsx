import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Users, Trophy, UserCircle, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex flex-col">
      <header className="sticky top-0 z-50 bg-dark-card/80 backdrop-blur-lg border-b border-dark-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            GAMEHUB PRO
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/games" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
            <Gamepad2 size={20} /> Games
          </Link>
          <Link to="/friends" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
            <Users size={20} /> Friends
          </Link>
          <Link to="/leaderboard" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
            <Trophy size={20} /> Leaderboard
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-dark-input px-4 py-2 rounded-full border border-dark-border">
            <UserCircle size={20} className="text-primary" />
            <span className="font-bold hidden sm:inline">{user.real_name || user.username}</span>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-dark-input rounded-full transition-colors text-error">
            <LogOut size={20} />
          </button>
          
          <button className="md:hidden p-2 hover:bg-dark-input rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-dark-bg/95 backdrop-blur-xl pt-24 px-6 flex flex-col gap-6 animate-fadeInUp">
          <Link to="/games" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold flex items-center gap-4 py-4 border-b border-dark-border">
            <Gamepad2 /> Games
          </Link>
          <Link to="/friends" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold flex items-center gap-4 py-4 border-b border-dark-border">
            <Users /> Friends
          </Link>
          <Link to="/leaderboard" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold flex items-center gap-4 py-4 border-b border-dark-border">
            <Trophy /> Leaderboard
          </Link>
        </div>
      )}

      <main className="flex-1 container mx-auto p-6">
        <Outlet />
      </main>

      <footer className="bg-dark-card border-t border-dark-border py-8 px-6 text-center text-dark-muted">
        <p>&copy; 2026 GameHub Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
