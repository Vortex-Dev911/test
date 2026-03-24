import React, { Suspense, lazy, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trophy, Users, Info, Settings, Share2, History, MessageSquare, Gamepad2 } from 'lucide-react';
import Loading from '../components/Loading';

// Lazy load games
const TicTacToe = lazy(() => import('../games/TicTacToe'));
const RockPaperScissors = lazy(() => import('../games/RockPaperScissors'));
const Connect4 = lazy(() => import('../games/Connect4'));
const Snake = lazy(() => import('../games/Snake'));
const Pong = lazy(() => import('../games/Pong'));
const Memory = lazy(() => import('../games/Memory'));
const Trivia = lazy(() => import('../games/Trivia'));
const Sudoku = lazy(() => import('../games/Sudoku'));
const ChessGame = lazy(() => import('../games/ChessGame'));
const Poker = lazy(() => import('../games/Poker'));

const Gameplay = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('play');

  const games = {
    tictactoe: { name: 'Tic Tac Toe', icon: '⭕', component: TicTacToe },
    rps: { name: 'Rock Paper Scissors', icon: '✊', component: RockPaperScissors },
    connect4: { name: 'Connect 4', icon: '🔴', component: Connect4 },
    snake: { name: 'Snake Battle', icon: '🐍', component: Snake },
    pong: { name: 'Pong', icon: '🏓', component: Pong },
    memory: { name: 'Memory Match', icon: '🎴', component: Memory },
    trivia: { name: 'Trivia Quiz', icon: '🧠', component: Trivia },
    sudoku: { name: 'Sudoku', icon: '🔢', component: Sudoku },
    chess: { name: 'Chess', icon: '♟️', component: ChessGame },
    poker: { name: 'Poker', icon: '🃏', component: Poker },
    uno: { name: 'UNO', icon: '🎨', component: () => <div className="p-20 text-center card border-dashed border-primary/30"><h2 className="text-4xl font-black">UNO Engine Coming Soon</h2><p className="text-dark-muted font-bold mt-4">We are polishing the card dealer. Stay tuned!</p></div> },
    pool: { name: '8-Ball Pool', icon: '🎱', component: () => <div className="p-20 text-center card border-dashed border-primary/30"><h2 className="text-4xl font-black">Pool Engine Coming Soon</h2><p className="text-dark-muted font-bold mt-4">The physics engine is currently being tuned. Grab a cue later!</p></div> },
    darts: { name: 'Darts', icon: '🎯', component: () => <div className="p-20 text-center card border-dashed border-primary/30"><h2 className="text-4xl font-black">Darts Engine Coming Soon</h2><p className="text-dark-muted font-bold mt-4">Sharpening the tips. Don't blink!</p></div> }
  };

  const game = games[gameId];

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fadeInUp">
        <h2 className="text-5xl font-black">Game Not Found</h2>
        <p className="text-xl text-dark-muted">The game you are looking for does not exist or is currently unavailable.</p>
        <Link to="/games" className="btn btn-primary">Browse All Games</Link>
      </div>
    );
  }

  const GameComponent = game.component;

  return (
    <div className="space-y-12 animate-fadeInUp">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/games')} className="p-4 bg-dark-input hover:bg-dark-border rounded-full transition-all hover:-translate-x-1 border border-dark-border">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary/20 text-primary rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-primary/10">
              {game.icon}
            </div>
            <div>
              <h1 className="text-5xl font-black">{game.name}</h1>
              <p className="text-lg text-dark-muted font-bold flex items-center gap-3">
                <Users size={18} className="text-secondary" /> 1,245 Players Online
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-dark-card p-2 rounded-[30px] border border-dark-border shadow-xl">
          <button onClick={() => setActiveTab('play')} className={`px-8 py-3 rounded-full font-black text-sm transition-all ${activeTab === 'play' ? 'bg-primary text-white shadow-lg' : 'text-dark-muted hover:text-dark-text'}`}>
            <Gamepad2 size={18} className="inline mr-2" /> Play
          </button>
          <button onClick={() => setActiveTab('stats')} className={`px-8 py-3 rounded-full font-black text-sm transition-all ${activeTab === 'stats' ? 'bg-secondary text-white shadow-lg' : 'text-dark-muted hover:text-dark-text'}`}>
            <Trophy size={18} className="inline mr-2" /> Stats
          </button>
          <button onClick={() => setActiveTab('chat')} className={`px-8 py-3 rounded-full font-black text-sm transition-all ${activeTab === 'chat' ? 'bg-success text-white shadow-lg' : 'text-dark-muted hover:text-dark-text'}`}>
            <MessageSquare size={18} className="inline mr-2" /> Chat
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        <div className="xl:col-span-3 space-y-12">
          {activeTab === 'play' && (
            <div className="card bg-dark-bg/50 border-dark-border/50 p-12 min-h-[70vh] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10"></div>
              <Suspense fallback={<Loading />}>
                <GameComponent onWin={(winner) => console.log('Winner:', winner)} />
              </Suspense>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card p-10 space-y-8">
                <h3 className="text-3xl font-black flex items-center gap-4"><History className="text-primary" /> Your History</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 bg-dark-input rounded-2xl border border-dark-border">
                      <div className="flex items-center gap-4">
                        <span className={`w-3 h-3 rounded-full ${i % 2 === 0 ? 'bg-success' : 'bg-error'}`}></span>
                        <p className="font-bold">{i % 2 === 0 ? 'Victory' : 'Defeat'}</p>
                      </div>
                      <p className="text-dark-muted text-sm font-bold tracking-widest">2h ago</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-10 space-y-8">
                <h3 className="text-3xl font-black flex items-center gap-4"><Trophy className="text-secondary" /> Global Ranking</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 hover:bg-dark-input rounded-2xl transition-colors">
                      <span className="w-8 font-black text-center text-dark-muted">#{i}</span>
                      <div className="w-10 h-10 bg-secondary/20 rounded-full"></div>
                      <p className="font-black flex-1">Gamer_{i*23}</p>
                      <p className="text-secondary font-black">{1200 - i*50} XP</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="card p-8 space-y-6">
            <h3 className="text-2xl font-black flex items-center gap-3"><Info className="text-primary" /> How to Play</h3>
            <p className="text-dark-muted font-bold text-sm leading-relaxed">
              Rules of {game.name} are simple. Compete against the bot or challenge a friend to a live match. 
              Winning a match rewards you with 25 XP and boosts your global rank.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="flex-1 btn btn-secondary py-3 text-sm flex items-center justify-center gap-2">
                <Share2 size={16} /> Share
              </button>
              <button className="p-3 bg-dark-input hover:bg-dark-border rounded-xl transition-colors border border-dark-border">
                <Settings size={20} />
              </button>
            </div>
          </div>

          <div className="card bg-primary/5 border-primary/20 p-8 space-y-6">
            <h3 className="text-2xl font-black text-primary flex items-center gap-3"><Trophy size={24} /> High Score</h3>
            <div className="text-center py-6 space-y-2">
              <p className="text-5xl font-black">2,450</p>
              <p className="text-dark-muted font-black tracking-widest text-xs uppercase">Your All-Time Best</p>
            </div>
            <button className="btn btn-primary w-full text-sm">Challenge Personal Best</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gameplay;
