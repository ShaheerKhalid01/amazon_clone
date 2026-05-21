import apiService from './api';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User 
} from '@/types/user.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    if (response.accessToken) {
      this.setTokens(response.accessToken, response.refreshToken);
      this.setUser(response.user);
    }
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    if (response.accessToken) {
      this.setTokens(response.accessToken, response.refreshToken);
      this.setUser(response.user);
    }
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } finally {
      this.clearAuth();
    }
  }

  async getProfile(): Promise<User> {
    const user = await apiService.get<User>('/auth/profile');
    this.setUser(user);
    return user;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiService.post('/auth/forgot-password', { email });
  }

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    return apiService.post('/auth/refresh', { refreshToken: token });
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
export default authService;
