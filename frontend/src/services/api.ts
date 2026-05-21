import axios, { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig, 
  AxiosResponse 
} from 'axios';
let _store: any = null;

export const injectStore = (store: any) => {
  _store = store;
};

/**
 * API Service Class
 * Centralized HTTP client with interceptors for auth and error handling
 */
class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request Interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = _store?.getState()?.auth?.accessToken;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add timestamp to prevent caching
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          };
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue requests while refreshing
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => {
                return this.api(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = _store?.getState()?.auth?.refreshToken;

            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await axios.post(
              `${import.meta.env.VITE_API_URL}/auth/refresh`,
              { refreshToken }
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data;
            
            // Update tokens in store
            _store?.dispatch({
              type: 'auth/setTokens',
              payload: { accessToken, refreshToken: newRefreshToken }
            });

            // Process queued requests
            this.failedQueue.forEach(({ resolve }) => resolve());
            this.failedQueue = [];

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // Refresh failed - logout user
            this.failedQueue.forEach(({ reject }) => reject(refreshError));
            this.failedQueue = [];
            
            _store?.dispatch({ type: 'auth/logout' });
            window.location.href = '/login';
            
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        const errorMessage = this.getErrorMessage(error);
        return Promise.reject({
          ...error,
          message: errorMessage,
        });
      }
    );
  }

  /**
   * Extract meaningful error message
   */
  private getErrorMessage(error: AxiosError): string {
    if (error.response?.data) {
      const data = error.response.data as any;
      return data.message || data.error || 'An unexpected error occurred';
    }
    
    if (error.message === 'Network Error') {
      return 'Unable to connect to server. Please check your internet connection.';
    }

    return error.message || 'An unexpected error occurred';
  }

  /**
   * HTTP GET request
   */
  async get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
    return this.api.get(url, { params });
  }

  /**
   * HTTP POST request
   */
  async post<T = any>(url: string, data?: any): Promise<T> {
    return this.api.post(url, data);
  }

  /**
   * HTTP PUT request
   */
  async put<T = any>(url: string, data?: any): Promise<T> {
    return this.api.put(url, data);
  }

  /**
   * HTTP PATCH request
   */
  async patch<T = any>(url: string, data?: any): Promise<T> {
    return this.api.patch(url, data);
  }

  /**
   * HTTP DELETE request
   */
  async delete<T = any>(url: string): Promise<T> {
    return this.api.delete(url);
  }

  /**
   * Upload file
   */
  async upload<T = any>(url: string, formData: FormData): Promise<T> {
    return this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

const apiService = new ApiService();
export default apiService;
