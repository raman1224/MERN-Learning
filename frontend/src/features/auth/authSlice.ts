import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../../types';

axios.defaults.withCredentials = true;

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const register = createAsyncThunk<User, RegisterCredentials>(
  'auth/register',
  async ({ name, email, password }) => {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    return response.data;
  }
);

export const login = createAsyncThunk<User, LoginCredentials>(
  'auth/login',
  async ({ email, password }) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await axios.post(`${API_URL}/logout`);
  return null;
});

export const getMe = createAsyncThunk('auth/getMe', async () => {
  const response = await axios.get(`${API_URL}/me`);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
