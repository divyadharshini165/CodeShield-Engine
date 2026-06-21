import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

const TOKEN_KEY = 'codeshield_token';
const USER_KEY = 'codeshield_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [stats, setStats] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const persistSession = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
    }
    if (newUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setStats(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      setStats(res.data.stats);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    } catch (err) {
      // Token invalid or expired -- log the user out silently.
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        clearSession();
      }
    }
  }, [clearSession]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, [fetchProfile]);

  const register = async ({ username, email, password }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await api.post('/auth/register', { username, email, password });
      persistSession(res.data.token, res.data.user);
      await fetchProfile();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed. Please try again.';
      setAuthError(message);
      return { success: false, error: message };
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      persistSession(res.data.token, res.data.user);
      await fetchProfile();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setAuthError(message);
      return { success: false, error: message };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        stats,
        isAuthenticated: !!token,
        authError,
        authLoading,
        register,
        login,
        logout,
        refreshProfile: fetchProfile,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
