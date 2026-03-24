import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Play, ChevronRight, Check, X } from 'lucide-react';

import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    realName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const res = await axios.post('http://localhost:3000/api/auth/signup', formData);
        login(res.data);
        navigate('/dashboard');
    } catch (err) {
        setError(err.response?.data?.error || 'Signup failed');
    }
  };

  const isPasswordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const isFormValid = formData.realName.length >= 2 && 
                      formData.username.length >= 3 && 
                      formData.email.includes('@') && 
                      formData.password.length >= 6 && 
                      isPasswordMatch;

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 text-dark-text relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <div className="card max-w-lg w-full p-10 space-y-10 animate-fadeInUp relative z-10">
        <div className="text-center space-y-4">
          <Link to="/" className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            GAMEHUB PRO
          </Link>
          <h2 className="text-4xl font-bold tracking-tight">Create Account</h2>
          <p className="text-dark-muted">Join the ultimate gaming community</p>
        </div>

        {error && <div className="bg-error/10 text-error p-4 rounded-xl text-center font-bold border border-error/20">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-widest">
                <User size={12} /> Real Name
              </label>
              <input
                type="text"
                className="input"
                placeholder="Full Name"
                value={formData.realName}
                onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-widest">
                <User size={12} /> Username
              </label>
              <input
                type="text"
                className="input"
                placeholder="GamerTag"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-widest">
              <Mail size={12} /> Email Address
            </label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-widest">
                <Lock size={12} /> Password
              </label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-widest">
                <Lock size={12} /> Confirm
              </label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className={`flex items-center gap-2 text-sm font-bold ${isPasswordMatch ? 'text-success' : 'text-error'}`}>
              {isPasswordMatch ? <Check size={16} /> : <X size={16} />}
              {isPasswordMatch ? 'Passwords match' : 'Passwords do not match'}
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid}
            className="btn btn-primary w-full py-4 text-xl flex items-center justify-center gap-3 mt-4"
          >
            Create Account <ChevronRight size={24} />
          </button>
        </form>

        <div className="text-center space-y-4 pt-6">
          <p className="text-dark-muted">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login here</Link>
          </p>
          <Link to="/" className="text-sm text-dark-muted hover:text-dark-text transition-colors flex items-center justify-center gap-2">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
