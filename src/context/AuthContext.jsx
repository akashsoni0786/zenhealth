import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
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

  useEffect(() => {
    setIsAuthenticated(!!user);
    if (user) {
      localStorage.setItem('stayfit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('stayfit_user');
    }
  }, [user]);

  // ─── Login (API first, localStorage fallback) ───
  const login = async ({ email, password, ...extra }) => {
    // If password provided, try API login
    if (password) {
      try {
        const res = await authAPI.login({ email, password });
        const { user: userData, token, refreshToken } = res.data;
        localStorage.setItem('stayfit_token', token);
        localStorage.setItem('stayfit_refresh_token', refreshToken);
        const userInfo = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          phone: userData.phone || '',
          role: userData.role,
          avatar: extra.avatar || null,
          loginTime: new Date().toISOString(),
        };
        setUser(userInfo);
        return { success: true, user: userInfo };
      } catch (err) {
        // If server is down (network error), fall back to localStorage
        if (!err.status) {
          console.warn('Backend unavailable, using offline login');
          const userInfo = {
            id: extra.id || Date.now(),
            email,
            name: extra.name || email.split('@')[0],
            avatar: extra.avatar || null,
            loginTime: new Date().toISOString(),
          };
          setUser(userInfo);
          return { success: true, user: userInfo, offline: true };
        }
        return { error: err.message || 'Invalid email or password' };
      }
    }

    // Google login — try API first
    if (extra.provider === 'google') {
      try {
        const res = await authAPI.googleAuth({
          email,
          name: extra.name || email.split('@')[0],
          googleId: extra.id || `google_${Date.now()}`,
          avatar: extra.avatar || '',
        });
        const { user: userData, token, refreshToken } = res.data;
        localStorage.setItem('stayfit_token', token);
        localStorage.setItem('stayfit_refresh_token', refreshToken);
        const userInfo = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          phone: userData.phone || '',
          role: userData.role,
          avatar: userData.avatar || extra.avatar || null,
          provider: 'google',
          loginTime: new Date().toISOString(),
        };
        setUser(userInfo);
        return { success: true, user: userInfo };
      } catch (err) {
        if (!err.status) {
          // Backend down — fallback to local
          console.warn('Backend unavailable, using offline Google login');
          const userInfo = {
            id: extra.id || Date.now(),
            email,
            name: extra.name || email.split('@')[0],
            avatar: extra.avatar || null,
            provider: 'google',
            loginTime: new Date().toISOString(),
          };
          setUser(userInfo);
          return { success: true, user: userInfo, offline: true };
        }
        return { error: err.message || 'Google login failed' };
      }
    }

    // No password, no Google — local only
    const userInfo = {
      id: extra.id || Date.now(),
      email,
      name: extra.name || email.split('@')[0],
      avatar: extra.avatar || null,
      provider: extra.provider || 'local',
      loginTime: new Date().toISOString(),
    };
    setUser(userInfo);
    return { success: true, user: userInfo };
  };

  // ─── Signup (API first, localStorage fallback) ───
  const signup = async ({ name, email, password, phone, ...extra }) => {
    if (password) {
      try {
        const res = await authAPI.signup({ name, email, password, phone });
        const { user: userData, token, refreshToken } = res.data;
        localStorage.setItem('stayfit_token', token);
        localStorage.setItem('stayfit_refresh_token', refreshToken);
        const userInfo = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          phone: userData.phone || '',
          role: userData.role,
          avatar: extra.avatar || null,
          createdAt: new Date().toISOString(),
        };
        setUser(userInfo);
        return { success: true, user: userInfo };
      } catch (err) {
        if (!err.status) {
          console.warn('Backend unavailable, using offline signup');
          const userInfo = {
            id: Date.now(),
            email,
            name: name || email.split('@')[0],
            phone: phone || '',
            avatar: null,
            createdAt: new Date().toISOString(),
          };
          setUser(userInfo);
          return { success: true, user: userInfo, offline: true };
        }
        // Return specific error messages from backend
        const errorMsg = err.errors
          ? err.errors.join(', ')
          : err.message || 'Signup failed';
        return { error: errorMsg };
      }
    }

    // Google signup — try API first (same endpoint as login for Google)
    if (extra.provider === 'google') {
      try {
        const res = await authAPI.googleAuth({
          email,
          name: name || email.split('@')[0],
          googleId: extra.id || `google_${Date.now()}`,
          avatar: extra.avatar || '',
        });
        const { user: userData, token, refreshToken } = res.data;
        localStorage.setItem('stayfit_token', token);
        localStorage.setItem('stayfit_refresh_token', refreshToken);
        const userInfo = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          phone: userData.phone || '',
          role: userData.role,
          avatar: userData.avatar || extra.avatar || null,
          provider: 'google',
          createdAt: new Date().toISOString(),
        };
        setUser(userInfo);
        return { success: true, user: userInfo };
      } catch (err) {
        if (!err.status) {
          console.warn('Backend unavailable, using offline Google signup');
          const userInfo = {
            id: extra.id || Date.now(),
            email,
            name: name || email.split('@')[0],
            phone: phone || '',
            avatar: extra.avatar || null,
            provider: 'google',
            createdAt: new Date().toISOString(),
          };
          setUser(userInfo);
          return { success: true, user: userInfo, offline: true };
        }
        return { error: err.message || 'Google signup failed' };
      }
    }

    // No password, no Google — local only
    const userInfo = {
      id: extra.id || Date.now(),
      email,
      name: name || email.split('@')[0],
      phone: phone || '',
      avatar: extra.avatar || null,
      provider: extra.provider || 'local',
      createdAt: new Date().toISOString(),
    };
    setUser(userInfo);
    return { success: true, user: userInfo };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stayfit_user');
    localStorage.removeItem('stayfit_token');
    localStorage.removeItem('stayfit_refresh_token');
  };

  const updateProfile = async (updates) => {
    if (!user) return null;

    // Try API update
    try {
      const res = await authAPI.updateProfile(updates);
      const updatedUser = { ...user, ...res.data.user };
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch {
      // Fallback to local
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      return { success: true, user: updatedUser, offline: true };
    }
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
