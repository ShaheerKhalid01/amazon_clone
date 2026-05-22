import apiService from './api';
import type { LoginCredentials, AuthResponse, User } from '@/types/user.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    const data = (response as any)?.data || response;

    const authResponse: AuthResponse = {
      accessToken: data?.accessToken || '',
      refreshToken: data?.refreshToken || '',
      expiresIn: data?.expiresIn || 900,
      user: data?.user || null,
    };

    if (authResponse.accessToken) {
      localStorage.setItem('accessToken', authResponse.accessToken);
      localStorage.setItem('refreshToken', authResponse.refreshToken || '');
      localStorage.setItem('user', JSON.stringify(authResponse.user));
    }

    return authResponse;
  }

  async register(data: any): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    const respData = (response as any)?.data || response;

    const authResponse: AuthResponse = {
      accessToken: respData?.accessToken || '',
      refreshToken: respData?.refreshToken || '',
      expiresIn: respData?.expiresIn || 900,
      user: respData?.user || null,
    };

    if (authResponse.accessToken) {
      localStorage.setItem('accessToken', authResponse.accessToken);
      localStorage.setItem('refreshToken', authResponse.refreshToken || '');
      localStorage.setItem('user', JSON.stringify(authResponse.user));
    }

    return authResponse;
  }

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    return apiService.post('/auth/refresh', { refreshToken: token });
  }

  async logout(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  async getProfile(): Promise<User> {
    return apiService.get<User>('/auth/profile');
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiService.post('/auth/forgot-password', { email });
  }

  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem('user');
      if (!stored || stored === 'undefined' || stored === 'null') return null;
      return JSON.parse(stored);
    } catch { return null; }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
export default authService;