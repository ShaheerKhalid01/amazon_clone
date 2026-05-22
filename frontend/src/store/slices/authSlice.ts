import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@services/auth.service';
import type { User, LoginCredentials } from '@/types/user.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('user');
    if (!stored || stored === 'undefined' || stored === 'null' || stored === '') return null;
    return JSON.parse(stored);
  } catch { return null; }
};

const initialState: AuthState = {
  user: getStoredUser(),
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk('auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth', initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => { state.user = action.payload; state.isAuthenticated = !!action.payload; },
    logout: (state) => { state.user = null; state.accessToken = null; state.refreshToken = null; state.isAuthenticated = false; state.error = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false; state.error = action.payload as string;
    });
  },
});

export const { setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;