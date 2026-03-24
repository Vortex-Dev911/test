import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Users, Trophy, UserCircle, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
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
        <div className="flex flex-col items-center gap-4">
          <p>&copy; 2026 GameHub Pro. All rights reserved.</p>
          <button 
            onClick={() => setIsCreditsOpen(true)}
            className="flex items-center gap-2 hover:text-primary transition-colors font-black text-xs uppercase tracking-widest"
          >
            <Shield size={14} className="text-secondary" /> Credits & Info
          </button>
        </div>
      </footer>

      {isCreditsOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-dark-bg/95 backdrop-blur-2xl animate-fadeIn">
          <div className="card max-w-2xl w-full p-12 space-y-10 relative border-primary/20 shadow-primary/10">
            <button onClick={() => setIsCreditsOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-dark-input rounded-xl transition-colors">
              <X size={24} />
            </button>
            
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">VORTEX</h2>
              <p className="text-dark-muted font-bold tracking-widest uppercase text-sm">Lead Developer & Creator</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-xl font-black flex items-center gap-3"><Trophy className="text-warning" /> Project Info</h4>
                <ul className="space-y-4 text-sm font-bold text-dark-muted">
                  <li className="flex justify-between"><span>Version</span> <span className="text-dark-text">v2.8.0-Alpha</span></li>
                  <li className="flex justify-between"><span>Status</span> <span className="text-success">Live & Stable</span></li>
                  <li className="flex justify-between"><span>Region</span> <span className="text-dark-text">Global</span></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-xl font-black flex items-center gap-3"><Gamepad2 className="text-primary" /> Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Vite', 'Node.js', 'Express', 'SQL', 'Socket.io', 'Tailwind'].map(tech => (
                    <span key={tech} className="px-3 py-1 bg-dark-input rounded-lg text-[10px] font-black uppercase border border-dark-border">{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-dark-border text-center space-y-6">
              <p className="text-dark-muted font-bold">Follow the development journey on social media</p>
              <div className="flex justify-center gap-6">
                {['Github', 'Discord', 'Twitter', 'Portfolio'].map(social => (
                  <a key={social} href="#" className="btn btn-secondary px-6 py-2 text-[10px]">{social}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
