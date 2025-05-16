import React, { useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import api from '../services/api';
import { AuthContext } from './AuthContextInstance';

export type UserRole = 'admin' | 'manager' | 'cashier' | 'waiter' | 'supervisor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Removido: exportação do api e configuração do axios

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verificar autenticação salva
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Configurar axios com o token
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/login', { email, password });
      const { user: userData, token } = response.data;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      // Configurar axios com o novo token
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success(`Bem-vindo, ${userData.name}!`);
    } catch (error) {
      const message = axios.isAxiosError(error) 
        ? error.response?.data?.error || 'Erro ao fazer login'
        : 'Erro ao fazer login';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    toast.info('Logout realizado com sucesso');
  };

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated: !!user, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
