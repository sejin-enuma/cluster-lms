import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import client from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('cluster-lms-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('cluster-lms-token');
  });

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem('cluster-lms-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cluster-lms-user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('cluster-lms-token', token);
    } else {
      localStorage.removeItem('cluster-lms-token');
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await client.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = response.data;
    setToken(newToken);
    setUser(newUser);

    if (newUser.role === 'enuma_admin') {
      navigate('/enuma-admin/clusters');
    } else {
      navigate(`/clusters/${newUser.clusterId}/student-dashboard`);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('cluster-lms-token');
    localStorage.removeItem('cluster-lms-user');
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
