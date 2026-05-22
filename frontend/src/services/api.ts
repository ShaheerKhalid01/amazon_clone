import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      timeout: 15000,
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    });
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      async (error: AxiosError) => {
        let message = 'An unexpected error occurred';
        if (error.response?.data) {
          const data = error.response.data as any;
          message = data?.message || data?.error || message;
        } else if (error.message === 'Network Error') {
          message = 'Unable to connect to server';
        }
        return Promise.reject({ ...error, message });
      }
    );
  }

  async get<T = any>(url: string, params?: Record<string, any>): Promise<T> { return this.api.get(url, { params }); }
  async post<T = any>(url: string, data?: any): Promise<T> { return this.api.post(url, data); }
  async put<T = any>(url: string, data?: any): Promise<T> { return this.api.put(url, data); }
  async patch<T = any>(url: string, data?: any): Promise<T> { return this.api.patch(url, data); }
  async delete<T = any>(url: string): Promise<T> { return this.api.delete(url); }
}

const apiService = new ApiService();
export default apiService;