import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ChevronRight, Check, X } from 'lucide-react';
import { api } from '../utils/shared';
import { useAuth } from '../context/AuthContext';

const AuthCard = ({ children, title, subtitle, footer }) => (
  <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 relative overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
    <div className="card max-w-lg w-full p-10 space-y-10 animate-fadeInUp relative z-10">
      <div className="text-center space-y-4">
        <Link to="/" className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">GAMEHUB PRO</Link>
        <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
        <p className="text-dark-muted">{subtitle}</p>
      </div>
      {children}
      <div className="text-center space-y-4 pt-6">
        <p className="text-dark-muted">{footer}</p>
        <Link to="/" className="text-sm text-dark-muted hover:text-dark-text flex items-center justify-center gap-2">← Back to home</Link>
      </div>
    </div>
  </div>
);

export const Login = () => {
  const [fd, setFd] = useState({ username: '', password: '' }), [err, setErr] = useState(''), n = useNavigate(), { login } = useAuth();
  const sub = async (e) => {
    e.preventDefault(); setErr('');
    try { const r = await api.post('/api/auth/login', fd); login(r.data); n('/dashboard'); }
    catch (e) { setErr(e.response?.data?.error || 'Login failed'); }
  };
  return (
    <AuthCard title="Welcome Back" subtitle="Log in to continue your journey" footer={<>Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link></>}>
      {err && <div className="bg-error/10 text-error p-4 rounded-xl text-center font-bold border border-error/20">{err}</div>}
      <form onSubmit={sub} className="space-y-6">
        <div className="space-y-2"><label className="label"><User size={12} className="inline mr-2"/>Username</label><input className="input" type="text" value={fd.username} onChange={e=>setFd({...fd, username:e.target.value})} /></div>
        <div className="space-y-2"><label className="label"><Lock size={12} className="inline mr-2"/>Password</label><input className="input" type="password" value={fd.password} onChange={e=>setFd({...fd, password:e.target.value})} /></div>
        <button className="btn btn-primary w-full py-4 text-xl flex items-center justify-center gap-3">Login <ChevronRight /></button>
      </form>
    </AuthCard>
  );
};

export const Signup = () => {
  const [fd, setFd] = useState({ realName:'', username:'', email:'', password:'', confirmPassword:'' }), [err, setErr] = useState(''), n = useNavigate(), { login } = useAuth();
  const valid = fd.realName.length>=2 && fd.username.length>=3 && fd.email.includes('@') && fd.password.length>=6 && fd.password===fd.confirmPassword;
  const sub = async (e) => {
    e.preventDefault(); setErr('');
    try { const r = await api.post('/api/auth/signup', fd); login(r.data); n('/dashboard'); }
    catch (e) { setErr(e.response?.data?.error || 'Signup failed'); }
  };
  return (
    <AuthCard title="Create Account" subtitle="Join the ultimate gaming community" footer={<>Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login</Link></>}>
      {err && <div className="bg-error/10 text-error p-4 rounded-xl text-center font-bold border border-error/20">{err}</div>}
      <form onSubmit={sub} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><label className="label">Real Name</label><input className="input" value={fd.realName} onChange={e=>setFd({...fd, realName:e.target.value})} /></div>
          <div className="space-y-2"><label className="label">Username</label><input className="input" value={fd.username} onChange={e=>setFd({...fd, username:e.target.value})} /></div>
        </div>
        <div className="space-y-2"><label className="label">Email</label><input className="input" type="email" value={fd.email} onChange={e=>setFd({...fd, email:e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><label className="label">Password</label><input className="input" type="password" value={fd.password} onChange={e=>setFd({...fd, password:e.target.value})} /></div>
          <div className="space-y-2"><label className="label">Confirm</label><input className="input" type="password" value={fd.confirmPassword} onChange={e=>setFd({...fd, confirmPassword:e.target.value})} /></div>
        </div>
        {fd.confirmPassword && <div className={`text-sm font-bold flex items-center gap-2 ${fd.password===fd.confirmPassword?'text-success':'text-error'}`}>{fd.password===fd.confirmPassword?<Check size={16}/>:<X size={16}/>}{fd.password===fd.confirmPassword?'Match':'Mismatch'}</div>}
        <button disabled={!valid} className="btn btn-primary w-full py-4 text-xl flex items-center justify-center gap-3">Sign Up <ChevronRight /></button>
      </form>
    </AuthCard>
  );
};
