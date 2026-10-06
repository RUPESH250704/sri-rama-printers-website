import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const ADMIN_PIN = process.env.REACT_APP_ADMIN_PIN || '1234';
const BACKEND_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || '';
const BACKEND_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || '';
const STORAGE_KEY = 'pin_unlocked';

interface AuthContextType {
  isUnlocked: boolean;
  unlock: (pin: string) => Promise<boolean>;
  lock: () => void;
  loading: boolean;
  user: { name: string; isAdmin: boolean; email: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    const token = localStorage.getItem('token');
    if (saved === 'true' && token) {
      setIsUnlocked(true);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const unlock = async (pin: string): Promise<boolean> => {
    if (pin !== ADMIN_PIN) return false;
    try {
      const response = await api.post('/auth/login', {
        email: BACKEND_EMAIL,
        password: BACKEND_PASSWORD,
      });
      localStorage.setItem('token', response.data.token);
      setIsUnlocked(true);
      sessionStorage.setItem(STORAGE_KEY, 'true');
      return true;
    } catch {
      return false;
    }
  };

  const lock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('token');
  };

  const user = isUnlocked ? { name: 'Admin', isAdmin: true, email: '' } : null;

  return (
    <AuthContext.Provider value={{ isUnlocked, unlock, lock, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
