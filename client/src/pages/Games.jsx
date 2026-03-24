import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Gamepad2, Star, TrendingUp, Play, Circle, HandMetal, Trophy, Hash, Smartphone, Brain, Grid, Clover } from 'lucide-react';

const Games = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const games = [
    { id: 'tictactoe', name: 'Tic Tac Toe', icon: <Circle className="text-primary" />, desc: 'Classic 3x3 strategy battle', category: '2-player', hot: true },
    { id: 'rps', name: 'Rock Paper Scissors', icon: <HandMetal className="text-secondary" />, desc: 'Hand game battle for quick wins', category: '2-player', hot: true },
    { id: 'connect4', name: 'Connect 4', icon: <div className="w-12 h-12 bg-rose-500 rounded-full" />, desc: 'Connect four in a row to win', category: '2-player', new: true },
    { id: 'chess', name: 'Chess', icon: <Trophy className="text-warning" />, desc: 'Ultimate strategic battle of wits', category: 'strategy' },
    { id: 'snake', name: 'Snake Battle', icon: <Hash className="text-success" />, desc: 'Last snake standing in arena', category: 'action', hot: true },
    { id: 'pong', name: 'Pong', icon: <Smartphone className="text-info" />, desc: 'Classic paddle game with a twist', category: 'action' },
    { id: 'memory', name: 'Memory Match', icon: <Brain className="text-primary" />, desc: 'Find matching pairs and win points', category: 'puzzle' },
    { id: 'trivia', name: 'Trivia Quiz', icon: <Grid className="text-secondary" />, desc: 'Test your knowledge against others', category: 'puzzle', new: true },
    { id: 'poker', name: 'Poker', icon: <Clover className="text-success" />, desc: 'High stakes Texas Hold\'em poker', category: 'cards' },
    { id: 'sudoku', name: 'Sudoku', icon: <Grid className="text-primary" />, desc: 'Solve complex number puzzles', category: 'puzzle', new: true },
  ];

  const filteredGames = games.filter(g => 
    (category === 'all' || g.category === category) &&
    (g.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-12 animate-fadeInUp">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-5xl font-black">All Games</h1>
          <p className="text-xl text-dark-muted font-bold">Explore our collection of 10+ premium games</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              className="input pl-12 py-4" 
              placeholder="Search games..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 bg-dark-input p-1 rounded-2xl border border-dark-border">
            {['all', '2-player', 'strategy', 'action', 'puzzle', 'cards'].map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-black capitalize transition-all ${category === cat ? 'bg-primary text-white shadow-lg' : 'text-dark-muted hover:text-dark-text'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredGames.map((game) => (
          <Link 
            key={game.id} 
            to={`/play/${game.id}`}
            className="card group hover:border-primary/50 hover:-translate-y-2 transition-all p-8 space-y-8 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-start justify-between">
                <div className="w-20 h-20 bg-dark-input rounded-3xl flex items-center justify-center text-5xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
                  {game.icon}
                </div>
                {game.hot && <span className="bg-error/20 text-error px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-2 border border-error/20"><TrendingUp size={12} /> Hot</span>}
                {game.new && <span className="bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-2 border border-secondary/20"><Star size={12} fill="#a78bfa" /> New</span>}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black group-hover:text-primary transition-colors">{game.name}</h3>
                <p className="text-dark-muted font-bold text-sm leading-relaxed">{game.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-dark-border/50">
                <div className="flex items-center gap-2 text-dark-muted font-black text-xs uppercase tracking-widest">
                  <Gamepad2 size={16} className="text-primary" /> {game.category}
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <Play size={20} fill="currentColor" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="card p-20 text-center space-y-6 bg-dark-input/50 border-dashed border-2 border-dark-border">
          <Search size={80} className="text-dark-muted mx-auto opacity-30" />
          <h3 className="text-3xl font-black text-dark-muted">No games found for "{search}"</h3>
          <p className="text-dark-muted font-bold">Try searching for something else or browse categories.</p>
          <button onClick={() => { setSearch(''); setCategory('all'); }} className="btn btn-secondary">Clear All Filters</button>
        </div>
      )}
    </div>
  );
};

export default Games;
