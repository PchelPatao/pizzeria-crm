import { defineStore } from 'pinia';
import api from './api';

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  items: any;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [] as Order[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchOrders() {
      this.loading = true;
      try {
        const response = await api.get('/orders');
        this.orders = response.data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async updateOrderStatus(orderId: number, status: string) {
      try {
        const response = await api.patch(`/orders/${orderId}/status`, { status });
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = response.data;
        }
      } catch (err: any) {
        this.error = err.message;
      }
    },
    async createOrder(orderData: any) {
      try {
        const response = await api.post('/orders', orderData);
        this.orders.push(response.data);
      } catch (err: any) {
        this.error = err.message;
      }
    },
    async updateOrder(orderId: number, orderData: any) {
        try {
          const response = await api.put(`/orders/${orderId}`, orderData);
          const index = this.orders.findIndex(o => o.id === orderId);
          if (index !== -1) {
            this.orders[index] = response.data;
          }
        } catch (err: any) {
          this.error = err.message;
        }
    },
    async deleteOrder(orderId: number) {
      try {
        await api.delete(`/orders/${orderId}`);
        this.orders = this.orders.filter(o => o.id !== orderId);
      } catch (err: any) {
        this.error = err.message;
      }
    }
  },
});
