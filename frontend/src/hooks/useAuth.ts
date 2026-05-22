import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@services/auth.service';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!user && !!localStorage.getItem('accessToken');

  const login = useCallback(async (credentials: any) => {
    setLoading(true);
    try {
      const result = await authService.login(credentials);
      setUser(result.user);
      toast.success(`Welcome, ${result.user?.firstName}!`);
      navigate('/');
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    navigate('/');
  }, [navigate]);

  return { user, isAuthenticated, loading, login, logout };
}