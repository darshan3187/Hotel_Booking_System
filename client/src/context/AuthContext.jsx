import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('stayease_token') || null);
  const [loading, setLoading] = useState(true);

  // Restore stored session if exists
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('stayease_user');
      const storedToken = localStorage.getItem('stayease_token');
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (err) {
      console.error('Failed to restore auth session:', err);
      localStorage.removeItem('stayease_token');
      localStorage.removeItem('stayease_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('stayease_token', authToken);
    localStorage.setItem('stayease_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('stayease_token');
    localStorage.removeItem('stayease_user');
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin }}>
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
