import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Users, Trophy, Play, Star, TrendingUp, History, Shield } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const [matchesRes, leaderboardRes] = await Promise.all([
        axios.get('http://localhost:3000/api/users/matches', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:3000/api/users/leaderboard')
      ]);
      setMatches(matchesRes.data);
      setLeaderboard(leaderboardRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (isMounted) await fetchData();
    };
    load();
    return () => { isMounted = false; };
  }, [fetchData]);

  return (
    <div className="space-y-12 animate-fadeInUp">
      {/* Welcome Banner */}
      <section className="card bg-gradient-to-r from-primary/20 via-secondary/10 to-transparent p-12 border-primary/30 relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-2xl">
          <div className="flex items-center gap-3 bg-primary/20 text-primary px-4 py-1.5 rounded-full w-fit font-bold tracking-widest text-xs uppercase">
            <TrendingUp size={14} /> Level {user.level} • XP: {user.xp} / {user.level * 1000}
          </div>
          <h1 className="text-5xl font-black">Welcome back, {user.real_name || user.username}!</h1>
          <p className="text-xl text-dark-muted">Ready for another challenge? Your win streak is {user.win_streak || 0} games. Keep it going!</p>
          <div className="flex gap-4 pt-4">
            <Link to="/games" className="btn btn-primary flex items-center gap-3 px-8 shadow-[0_0_20px_rgba(129,140,248,0.4)]">
              Play Now <Play size={18} fill="white" />
            </Link>
            <Link to="/friends" className="btn btn-secondary flex items-center gap-3 px-8 hover:bg-primary/10">
              Challenge Friend <Users size={18} />
            </Link>
          </div>
        </div>
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block opacity-30 grayscale group-hover:grayscale-0 transition-all animate-float pointer-events-none">
          <Gamepad2 size={240} className="text-primary rotate-12 drop-shadow-[0_0_30px_rgba(129,140,248,0.3)]" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Matches */}
        <section className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black flex items-center gap-4">
              <History size={28} className="text-primary" /> Recent Matches
            </h2>
            <Link to="/history" className="text-primary font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {matches.length > 0 ? matches.map((match, i) => (
              <div key={i} className="card p-5 flex items-center justify-between hover:bg-dark-input transition-colors cursor-pointer group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-dark-input rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform uppercase">
                    {match.game_id?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h4 className="text-xl font-black capitalize">{match.game_id}</h4>
                    <p className="text-dark-muted font-bold text-sm">Played {new Date(match.played_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-black px-4 py-1.5 rounded-xl ${match.winner_id === user.id ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                    {match.winner_id === user.id ? 'Victory' : 'Defeat'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="card p-12 text-center text-dark-muted font-bold border-dashed border-2">
                No matches played yet.
              </div>
            )}
          </div>
        </section>

        {/* Global Rankings */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black flex items-center gap-4">
              <Trophy size={28} className="text-secondary" /> Rankings
            </h2>
            <Link to="/leaderboard" className="text-secondary font-bold hover:underline">View All</Link>
          </div>
          <div className="card p-2">
            {leaderboard.map((player, i) => (
              <div key={player.id} className="p-4 flex items-center gap-4 hover:bg-dark-input rounded-2xl transition-colors">
                <span className={`text-xl font-black w-8 text-center ${i === 0 ? 'text-warning' : i === 1 ? 'text-dark-muted' : i === 2 ? 'text-secondary' : ''}`}>
                  #{i + 1}
                </span>
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary uppercase">
                  {player.username.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm">{player.real_name || player.username}</p>
                  <p className="text-xs text-dark-muted font-bold">{player.xp} XP</p>
                </div>
                {i === 0 && <Star size={16} fill="#fbbf24" className="text-warning" />}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
