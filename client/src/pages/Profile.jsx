import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Camera, Shield, Save, History, Trophy, Star } from 'lucide-react';
import { API_URL } from '../utils/api';

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    realName: user?.real_name || '',
    avatarUrl: user?.avatar_url || '',
    isPrivate: user?.is_private || false
  });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/users/matches`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMatches(res.data);
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };
    fetchHistory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated successfully!');
      // Refresh user profile in context
      const userId = localStorage.getItem('userId');
      const profileRes = await axios.get(`${API_URL}/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      login({ ...profileRes.data, token });
    } catch (err) {
      console.error('Update error:', err);
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeInUp">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Profile Settings */}
        <div className="lg:w-1/3 space-y-8">
          <div className="card p-10 space-y-10">
            <div className="relative w-40 h-40 mx-auto">
              <div className="w-full h-full rounded-[2.5rem] bg-dark-input flex items-center justify-center text-6xl overflow-hidden border-4 border-primary/20">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
              <button className="absolute -bottom-4 -right-4 p-4 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
                <Camera size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="label">Real Name</label>
                <input 
                  type="text" 
                  className="input" 
                  value={formData.realName}
                  onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="label">Avatar URL</label>
                <input 
                  type="text" 
                  className="input text-xs" 
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-input rounded-2xl">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-secondary" />
                  <span className="font-bold text-sm">Private Profile</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.isPrivate ? 'bg-primary' : 'bg-dark-border'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isPrivate ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-center font-bold text-sm ${message.includes('success') ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  {message}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary w-full flex items-center justify-center gap-3">
                <Save size={20} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Player Stats & Achievements */}
        <div className="lg:w-2/3 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 bg-gradient-to-br from-primary/20 to-transparent border-primary/20 text-center space-y-2">
              <p className="text-dark-muted font-black uppercase tracking-widest text-xs">Total XP</p>
              <p className="text-4xl font-black text-primary">{user.xp}</p>
            </div>
            <div className="card p-8 bg-gradient-to-br from-secondary/20 to-transparent border-secondary/20 text-center space-y-2">
              <p className="text-dark-muted font-black uppercase tracking-widest text-xs">Matches</p>
              <p className="text-4xl font-black text-secondary">{user.games_played}</p>
            </div>
            <div className="card p-8 bg-gradient-to-br from-success/20 to-transparent border-success/20 text-center space-y-2">
              <p className="text-dark-muted font-black uppercase tracking-widest text-xs">Win Rate</p>
              <p className="text-4xl font-black text-success">
                {user.games_played > 0 ? Math.round((user.wins / user.games_played) * 100) : 0}%
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-3xl font-black flex items-center gap-4"><History className="text-primary" /> Recent Matches</h3>
              <div className="space-y-4">
                {matches.map((match, i) => (
                  <div key={i} className="card p-4 flex items-center justify-between hover:bg-dark-input transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-dark-input rounded-xl flex items-center justify-center font-black group-hover:text-primary uppercase">
                        {match.game_id.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black capitalize text-sm">{match.game_id}</p>
                        <p className="text-[10px] text-dark-muted font-bold tracking-widest">{new Date(match.played_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${match.winner_id === user.id ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                      {match.winner_id === user.id ? 'Win' : 'Loss'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-3xl font-black flex items-center gap-4"><Trophy className="text-warning" /> Achievements</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'First Win', icon: <Star />, color: 'text-warning' },
                  { name: 'Centurion', icon: <Trophy />, color: 'text-primary' },
                  { name: 'Socialite', icon: <User />, color: 'text-secondary' },
                  { name: 'Master', icon: <Shield />, color: 'text-success' }
                ].map((ach, i) => (
                  <div key={i} className="card p-6 text-center space-y-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer group">
                    <div className={`w-12 h-12 mx-auto rounded-2xl bg-dark-input flex items-center justify-center ${ach.color} group-hover:scale-110 transition-transform`}>
                      {ach.icon}
                    </div>
                    <p className="font-black text-xs uppercase tracking-widest">{ach.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;