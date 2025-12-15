import { api, setToken, removeToken, getToken } from '../api';
import type { LoginRequest, RegisterRequest, AuthResponse, Usuario } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    setToken(response.token);
    return response;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    setToken(response.token);
    return response;
  },

  async logout(): Promise<void> {
    removeToken();
  },

  async getCurrentUser(): Promise<Usuario> {
    return api.get<Usuario>('/api/auth/profile');
  },

  isAuthenticated(): boolean {
    return getToken() !== null;
  },

  getToken(): string | null {
    return getToken();
  },
};
