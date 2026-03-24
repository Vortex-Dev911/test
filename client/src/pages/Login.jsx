import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Play, ChevronRight } from 'lucide-react';

import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const res = await axios.post('http://localhost:3000/api/auth/login', formData);
        login(res.data);
        navigate('/dashboard');
    } catch (err) {
        setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 text-dark-text relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <div className="card max-w-md w-full p-10 space-y-10 animate-fadeInUp relative z-10">
        <div className="text-center space-y-4">
          <Link to="/" className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            GAMEHUB PRO
          </Link>
          <h2 className="text-4xl font-bold">Welcome Back</h2>
          <p className="text-dark-muted">Log in to continue your gaming journey</p>
        </div>

        {error && <div className="bg-error/10 text-error p-4 rounded-xl text-center font-bold border border-error/20">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-widest">
              <User size={14} /> Username
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-widest">
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full py-4 text-xl flex items-center justify-center gap-3 mt-4">
            Login <ChevronRight size={24} />
          </button>
        </form>

        <div className="text-center space-y-4 pt-6">
          <p className="text-dark-muted">
            Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up now</Link>
          </p>
          <Link to="/" className="text-sm text-dark-muted hover:text-dark-text transition-colors flex items-center justify-center gap-2">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
