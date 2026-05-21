import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '@store/index';
import { loginUser, logout as logoutAction, clearError } from '@store/slices/authSlice';
import type { LoginCredentials } from '@/types/user.types';
import toast from 'react-hot-toast';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await dispatch(loginUser(credentials)).unwrap();
        toast.success(`Welcome back, ${result.user.firstName}!`);
        navigate('/');
        return result;
      } catch (error: any) {
        const msg = typeof error === 'string' ? error : error?.message || 'Login failed';
        toast.error(msg);
        throw error;
      }
    },
    [dispatch, navigate]
  );

  const handleLogout = useCallback(() => {
    dispatch(logoutAction());
    toast.success('Logged out successfully');
    navigate('/');
  }, [dispatch, navigate]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout: handleLogout,
    clearError: handleClearError,
  };
}