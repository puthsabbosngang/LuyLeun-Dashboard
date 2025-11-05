'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { setAuthStateChangeCallback } from '@/lib/api/authAPI';

interface StaffInfo {
  id: number;
  full_name: string;
  role: string;
  phone?: string;
}

interface User {
  id: number;
  username: string;
  type: string;
  role?: string;
  staff?: StaffInfo;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>(''); // Add session ID to force re-renders

  // Force re-read user data from localStorage
  const refreshUser = useCallback(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('userData');

    if (token && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        
        const newSessionId = Date.now().toString();
        setSessionId(newSessionId);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('userData');

    if (token && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }

    setLoading(false);
    
    // Register callback for auth state changes
    setAuthStateChangeCallback(refreshUser);
  }, [refreshUser]);

  const login = (token: string, userData: User) => {
    if (typeof window === 'undefined') return;

    try {
      const currentUser = user;
      const switchingUsers = currentUser && currentUser.id !== userData.id;
      
      if (switchingUsers) {
        localStorage.removeItem('customPermissions');
      }
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      const newSessionId = Date.now().toString();
      setSessionId(newSessionId);
      setUser(userData);
    } catch (error) {
      console.error('Failed to save auth data:', error);
    }
  };

  const logout = () => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    setSessionId('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
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
