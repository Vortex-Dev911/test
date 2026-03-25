import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/shared';

const AuthContext = createContext(null);

export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (userId) => {
        try {
            const res = await api.get(`/api/users/profile/${userId}`);
            setUser(res.data);
        } catch (err) {
            console.error('Error fetching profile:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
            fetchUserProfile(userId);
        } else {
            setLoading(false);
        }
    }, []);

    const login = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        fetchUserProfile(data.userId);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
