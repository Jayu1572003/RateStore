import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

export type UserRole = 'admin' | 'normal_user' | 'store_owner';
export const UserRole = {
  ADMIN: 'admin' as const,
  NORMAL_USER: 'normal_user' as const,
  STORE_OWNER: 'store_owner' as const,
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  store?: {
    id: string;
    name: string;
    email: string;
    address: string;
    avgRating: number | null;
  } | null;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const refetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data);
    } catch (err) {
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, role } = res.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
    
    // Immediately fetch profile
    const profileRes = await api.get('/auth/profile');
    setUser(profileRes.data);

    // Navigate to role landing page
    if (role === UserRole.ADMIN) {
      navigate('/admin/dashboard');
    } else if (role === UserRole.STORE_OWNER) {
      navigate('/owner/dashboard');
    } else {
      navigate('/stores');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
        try {
          const profileRes = await api.get('/auth/profile');
          setUser(profileRes.data);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, refetchProfile }}>
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
