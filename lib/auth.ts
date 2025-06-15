import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from './types';
import { apiClient } from './api';

interface AuthStore extends AuthState {
  login: (idToken: string) => Promise<void>;
  loginAdmin: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string, refreshToken?: string) => Promise<void>; // เพิ่มบรรทัดนี้
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (idToken: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.loginWithLine(idToken);
          apiClient.setToken(response.access_token);
          
          const user = await apiClient.getCurrentUser();
          
          set({
            user,
            token: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginAdmin: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.loginAdmin({ username, password });
          apiClient.setToken(response.access_token);
          
          const user = await apiClient.getCurrentUser();
          
          set({
            user,
            token: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        apiClient.setToken(null);
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await apiClient.refreshToken(refreshToken);
          apiClient.setToken(response.access_token);
          
          set({
            token: response.access_token,
          });
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      // เพิ่มฟังก์ชัน setToken
      setToken: async (token: string, refreshToken?: string) => {
        set({ isLoading: true });
        try {
          apiClient.setToken(token);
          
          // ดึงข้อมูล user จาก token
          const user = await apiClient.getCurrentUser();
          
          set({
            user,
            token,
            refreshToken: refreshToken || get().refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to set token:', error);
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize API client with stored token
if (typeof window !== 'undefined') {
  const storedAuth = localStorage.getItem('auth-storage');
  if (storedAuth) {
    try {
      const parsedAuth = JSON.parse(storedAuth);
      if (parsedAuth.state?.token) {
        apiClient.setToken(parsedAuth.state.token);
      }
    } catch (error) {
      console.error('Failed to parse stored auth:', error);
    }
  }
}