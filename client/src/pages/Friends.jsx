import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, MessageSquare, Search, Trophy, Check, Clock, Gamepad2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { API_URL, SOCKET_URL } from '../utils/api';

import Messaging from '../components/Messaging';

const Friends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFriends();
  }, []);

  const challengeFriend = async (friendId, gameId = 'tictactoe') => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/games/challenge`, { friendId, gameId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { roomId } = res.data;
      
      // Emit socket event
      const socket = io(SOCKET_URL);
      socket.emit('challenge_player', { 
        challenger: user.username, 
        challenged: friends.find(f => f.id === friendId).username,
        gameId,
        roomId
      });
      socket.disconnect();

      navigate(`/play/${gameId}?room=${roomId}`);
    } catch (err) {
      console.error('Challenge error:', err);
      alert('Failed to send challenge');
    }
  };

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/friends/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(res.data);
    } catch (err) {
      console.error('Error fetching friends:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/users/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(res.data.filter(u => u.id !== user.id));
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };

  const sendFriendRequest = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/friends/request`, { friendId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Emit socket event for real-time notification
      const socket = io(SOCKET_URL);
      socket.emit('friend_request', { 
        receiverId: friendId, 
        senderName: user.real_name || user.username 
      });
      socket.disconnect();

      alert('Friend request sent!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send request');
    }
  };

  return (
    <div className="space-y-12 animate-fadeInUp">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-5xl font-black">Friends</h1>
          <p className="text-xl text-dark-muted font-bold">Connect with other players and challenge them</p>
        </div>
        
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            className="input pl-12 py-4" 
            placeholder="Search players..." 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3"><Search className="text-primary" /> Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((result) => (
              <div key={result.id} className="card p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                    {result.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black">{result.real_name || result.username}</p>
                    <p className="text-xs text-dark-muted font-bold uppercase tracking-widest">Lvl {result.level}</p>
                  </div>
                </div>
                <button 
                  onClick={() => sendFriendRequest(result.id)}
                  className="p-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all"
                >
                  <UserPlus size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Friends List & Messaging */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3"><Users className="text-secondary" /> My Friends</h2>
          {friends.length === 0 ? (
            <div className="card p-12 text-center text-dark-muted font-bold">
              {loading ? 'Loading friends...' : 'No friends yet. Search for players to add them!'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {friends.map((friend) => (
                <div key={friend.id} className="card group hover:border-primary/50 transition-all p-6 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-3xl font-black text-primary relative">
                      {friend.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black">{friend.real_name || friend.username}</h3>
                      <p className="text-dark-muted font-bold text-sm">Lvl {friend.level}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setActiveChat(friend)}
                      className={`flex-1 btn py-3 text-sm flex items-center justify-center gap-2 ${activeChat?.id === friend.id ? 'btn-secondary bg-primary text-white' : 'btn-primary'}`}
                    >
                      <MessageSquare size={16} /> Chat
                    </button>
                    <button 
                      onClick={() => challengeFriend(friend.id)}
                      className="btn btn-secondary p-3 hover:bg-warning/20 hover:text-warning transition-colors"
                    >
                      <Gamepad2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Messaging Sidebar */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3"><MessageSquare className="text-primary" /> Messenger</h2>
          {activeChat ? (
            <div className="h-[600px]">
              <Messaging friend={activeChat} onClose={() => setActiveChat(null)} />
            </div>
          ) : (
            <div className="card p-12 text-center text-dark-muted font-bold h-[600px] flex flex-col items-center justify-center space-y-4 opacity-50 border-dashed border-2">
              <MessageSquare size={48} />
              <p>Select a friend to start chatting</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Friends;
