import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@store/index';
import {
  loginUser,
  logout as logoutAction,
  clearError,
} from '@store/slices/authSlice';
import type { LoginCredentials } from '@/types/user.types';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook for authentication
 * Provides authentication state and methods
 */
export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  /**
   * Login handler
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await dispatch(loginUser(credentials)).unwrap();
        toast.success(`Welcome back, ${result.user.firstName}!`);
        navigate('/');
        return result;
      } catch (error: any) {
        toast.error(error || 'Login failed');
        throw error;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Logout handler
   */
  const handleLogout = useCallback(() => {
    dispatch(logoutAction());
    toast.success('Logged out successfully');
    navigate('/');
  }, [dispatch, navigate]);

  /**
   * Clear auth errors
   */
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
