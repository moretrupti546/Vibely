import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vibely_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('vibely_token'));
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('vibely_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('vibely_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Session verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('vibely_token', newToken);
        localStorage.setItem('vibely_user', JSON.stringify(userData));
        showToast(`Welcome back, ${userData.name}! 🎵`, 'success');
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('vibely_token', newToken);
        localStorage.setItem('vibely_user', JSON.stringify(userData));
        showToast('Account created successfully! Enjoy Vibely ✨', 'success');
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('vibely_token');
      localStorage.removeItem('vibely_user');
      showToast('Logged out. See you soon!', 'info');
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('vibely_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
