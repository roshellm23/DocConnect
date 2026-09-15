import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // True until we check localStorage

  // On mount, restore session from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('docconnect_token');
      const storedUser = localStorage.getItem('docconnect_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Corrupted storage — clear it
      localStorage.removeItem('docconnect_token');
      localStorage.removeItem('docconnect_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('docconnect_token', newToken);
    localStorage.setItem('docconnect_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('docconnect_token');
    localStorage.removeItem('docconnect_user');
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('docconnect_user', JSON.stringify(updatedUser));
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      updateUser,
      isAuthenticated,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
