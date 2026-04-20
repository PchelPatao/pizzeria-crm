import { defineStore } from 'pinia';
import api from '../api';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    loading: false,
    error: null as string | null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        const response = await api.post('/auth/login', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        
        this.token = response.data.access_token;
        localStorage.setItem('token', this.token!);
        router.push('/');
      } catch (err: any) {
        this.error = err.response?.data?.detail || 'Login failed';
      } finally {
        this.loading = false;
      }
    },
    async register(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        await api.post('/auth/register', { email, password });
        router.push('/');
      } catch (err: any) {
        this.error = err.response?.data?.detail || 'Registration failed';
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      router.push('/login');
    }
  }
});
