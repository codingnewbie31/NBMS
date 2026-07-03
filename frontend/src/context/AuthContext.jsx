import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Authentication State
  const [user, setUser] = useState(null);

  // Session Initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('nbms_user');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Login Handler
  const login = (userData) => {
    localStorage.setItem('nbms_user', JSON.stringify(userData));
    setUser(userData);
  };

  // Logout Handler
  const logout = () => {
    localStorage.removeItem('nbms_user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}