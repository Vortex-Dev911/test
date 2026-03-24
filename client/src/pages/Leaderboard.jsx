import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Star, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/users/leaderboard');
        setPlayers(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankBadge = (index) => {
    if (index === 0) return { label: 'GOD', class: 'bg-warning text-dark-bg ring-4 ring-warning/50 animate-pulse scale-110 shadow-[0_0_20px_rgba(251,191,36,0.8)]' };
    if (index < 100) return { label: 'MASTER', class: 'bg-slate-300 text-dark-bg border-2 border-white/50 shadow-lg shadow-slate-200/20' };
    if (index < 1000) return { label: 'PLATINUM', class: 'bg-primary/20 text-primary border border-primary/50' };
    return { label: 'DIAMOND', class: 'bg-secondary/20 text-secondary border border-secondary/50' };
  };

  return (
    <div className="space-y-12 animate-fadeInUp">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-5xl font-black flex items-center gap-4">
            <Trophy size={48} className="text-warning" /> Global Rankings
          </h1>
          <p className="text-xl text-dark-muted font-bold">The top players from around the world</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted group-focus-within:text-primary transition-colors" size={20} />
            <input type="text" className="input pl-12 py-4" placeholder="Search players..." />
          </div>
          <button className="p-4 bg-dark-input hover:bg-dark-border rounded-xl transition-colors border border-dark-border">
            <Filter size={24} />
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-dark-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-dark-input/50 text-dark-muted uppercase text-xs tracking-[0.2em] font-black">
              <tr>
                <th className="px-8 py-6">Rank</th>
                <th className="px-8 py-6">Player</th>
                <th className="px-8 py-6">Level</th>
                <th className="px-8 py-6">XP Points</th>
                <th className="px-8 py-6">Tier</th>
                <th className="px-8 py-6">W / L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/30 font-bold">
              {players.map((player, i) => {
                const badge = getRankBadge(i);
                return (
                  <tr key={player.id} className={`transition-colors group ${i === 0 ? 'bg-warning/5' : ''}`}>
                    <td className="px-8 py-6">
                      <span className={`text-2xl font-black ${i === 0 ? 'text-warning' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-secondary' : 'text-dark-muted/50'}`}>
                        #{i + 1}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold uppercase transition-transform group-hover:scale-110
                          ${i === 0 ? 'bg-warning text-dark-bg ring-4 ring-warning/30' : 'bg-primary/20 text-primary'}`}>
                          {player.username.charAt(0)}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className={`text-xl font-black ${i === 0 ? 'text-warning' : ''}`}>{player.real_name || player.username}</p>
                          {i === 0 && <Star size={16} fill="#fbbf24" className="text-warning animate-spin-slow" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xl font-black">
                      <span className={i === 0 ? 'text-warning' : 'text-primary'}>Lvl {player.level}</span>
                    </td>
                    <td className="px-8 py-6 text-xl">
                      {player.xp.toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] ${badge.class}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-success">{player.wins || 0}</span>
                      <span className="mx-2 opacity-30">/</span>
                      <span className="text-error">{player.losses || 0}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
