import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, getSocket } from '../utils/shared';

const Messaging = ({ friend, onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isOpponentTyping, setIsOpponentTyping] = useState(false);
    const scrollRef = useRef();
    const socketRef = useRef();
    const typingTimeoutRef = useRef();

    useEffect(() => {
        fetchMessages();
        
        socketRef.current = getSocket();
        socketRef.current.emit('join_chat', user.id);

        socketRef.current.on('receive_message', (message) => {
            if (message.sender_id === friend.id) {
                setMessages(prev => [...prev, message]);
                socketRef.current.emit('message_read', { senderId: friend.id, receiverId: user.id });
            }
        });

        socketRef.current.on('opponent_typing', (data) => {
            setIsOpponentTyping(data.isTyping);
        });

        socketRef.current.on('message_status_update', (data) => {
            setMessages(prev => prev.map(m => 
                (m.sender_id === user.id && m.receiver_id === data.senderId) ? { ...m, is_read: true } : m
            ));
        });

        return () => {
            // socketRef.current.disconnect(); // Don't disconnect shared socket
        };
    }, [friend.id, user.id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpponentTyping]);

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        
        socketRef.current.emit('typing', { receiverId: friend.id, isTyping: true });
        
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current.emit('typing', { receiverId: friend.id, isTyping: false });
        }, 2000);
    };

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/api/messages/${friend.id}`);
            setMessages(res.data);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await api.post('/api/messages/send', {
                receiverId: friend.id,
                content: newMessage
            });
            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
            
            socketRef.current.emit('send_message', {
                ...res.data,
                receiverId: friend.id
            });
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    return (
        <div className="flex flex-col h-full bg-dark-card rounded-3xl overflow-hidden border border-dark-border shadow-2xl animate-fadeInUp">
            {/* Header */}
            <div className="p-6 bg-dark-input flex items-center justify-between border-b border-dark-border">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary uppercase">
                        {friend.username.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-black text-sm">{friend.real_name || friend.username}</h4>
                        <p className="text-xs text-dark-muted font-bold uppercase tracking-widest">Chatting Now</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-dark-border rounded-xl transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-dark-border">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-dark-muted font-bold">Loading chat...</div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-dark-muted space-y-4 opacity-30">
                        <MessageSquare size={48} />
                        <p className="font-bold">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.sender_id === user.id ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl font-medium text-sm shadow-lg
                                    ${msg.sender_id === user.id 
                                        ? 'bg-primary text-white rounded-tr-none' 
                                        : 'bg-dark-input text-dark-text rounded-tl-none'}`}
                                >
                                    {msg.content}
                                </div>
                                {msg.sender_id === user.id && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-dark-muted mt-1 px-1">
                                        {msg.is_read ? 'Read' : 'Sent'}
                                    </span>
                                )}
                            </div>
                        ))}
                        {isOpponentTyping && (
                            <div className="flex justify-start">
                                <div className="bg-dark-input text-dark-muted px-4 py-2 rounded-2xl rounded-tl-none text-xs font-black animate-pulse">
                                    {friend.username} is typing...
                                </div>
                            </div>
                        )}
                    </>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-6 bg-dark-input border-t border-dark-border flex gap-4">
                <input
                    type="text"
                    className="input py-3"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleTyping}
                />
                <button type="submit" className="btn btn-primary px-6 py-3">
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default Messaging;
