import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check localStorage for existing user session
    const savedUser = localStorage.getItem('stayfit_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  // Update authentication state when user changes
  useEffect(() => {
    setIsAuthenticated(!!user);
    if (user) {
      localStorage.setItem('stayfit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('stayfit_user');
    }
  }, [user]);

  const login = (userData) => {
    // In a real app, this would validate credentials with an API
    const userInfo = {
      id: userData.id || Date.now(),
      email: userData.email,
      name: userData.name || userData.email.split('@')[0],
      avatar: userData.avatar || null,
      loginTime: new Date().toISOString()
    };
    setUser(userInfo);
    return userInfo;
  };

  const signup = (userData) => {
    // In a real app, this would register the user via API
    const userInfo = {
      id: Date.now(),
      email: userData.email,
      name: userData.name || userData.email.split('@')[0],
      phone: userData.phone || '',
      avatar: null,
      createdAt: new Date().toISOString()
    };
    setUser(userInfo);
    return userInfo;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stayfit_user');
  };

  const updateProfile = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      return updatedUser;
    }
    return null;
  };

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
