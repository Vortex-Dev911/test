import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Users, Trophy, Play, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text overflow-hidden selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center p-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-12 animate-fadeInUp">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GAMEHUB PRO
            </h1>
            <p className="text-xl md:text-2xl text-dark-muted font-medium max-w-2xl mx-auto">
              The ultimate destination for competitive multiplayer gaming. 
              Connect, compete, and climb the leaderboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/signup" className="btn btn-primary px-12 py-5 text-xl flex items-center gap-3">
              Get Started <Play fill="white" size={20} />
            </Link>
            <Link to="/login" className="btn btn-secondary px-12 py-5 text-xl flex items-center gap-3">
              Login <ChevronRight size={24} />
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 pt-20">
            <div className="card space-y-4 hover:border-primary/50 transition-colors group">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gamepad2 size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold">10+ Premium Games</h3>
              <p className="text-dark-muted">From classics like Chess to high-octane racing. All built for real-time play.</p>
            </div>
            <div className="card space-y-4 hover:border-primary/50 transition-colors group">
              <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={32} className="text-secondary" />
              </div>
              <h3 className="text-2xl font-bold">Live Multiplayer</h3>
              <p className="text-dark-muted">Challenge friends or join global lobbies. Instant matchmaking and smooth play.</p>
            </div>
            <div className="card space-y-4 hover:border-primary/50 transition-colors group">
              <div className="w-16 h-16 bg-success/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy size={32} className="text-success" />
              </div>
              <h3 className="text-2xl font-bold">Competitive Leaderboard</h3>
              <p className="text-dark-muted">Climb the ranks, unlock achievements, and prove you're the ultimate gamer.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
