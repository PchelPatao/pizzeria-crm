<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  await authStore.login(email.value, password.value)
}
</script>

<template>
  <div class="min-h-screen flex bg-slate-50 dark:bg-slate-950">
    <!-- Left panel - Branding -->
    <div class="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-500 via-red-500 to-red-700 flex-col items-center justify-center p-12 relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full"></div>
      <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-black/10 rounded-full"></div>
      <div class="absolute top-1/2 left-1/4 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2"></div>

      <div class="relative text-center">
        <div class="text-8xl mb-6">🍕</div>
        <h1 class="text-4xl font-bold text-white mb-3">Pizzeria CRM</h1>
        <p class="text-red-100 text-lg max-w-sm">Управляйте заказами эффективно и без стресса</p>

        <div class="mt-10 grid grid-cols-2 gap-4 text-left">
          <div class="bg-white/10 backdrop-blur rounded-xl p-4">
            <p class="text-white font-semibold text-2xl">📦</p>
            <p class="text-white font-bold mt-1">Заказы</p>
            <p class="text-red-100 text-sm">Отслеживайте каждый заказ в реальном времени</p>
          </div>
          <div class="bg-white/10 backdrop-blur rounded-xl p-4">
            <p class="text-white font-semibold text-2xl">📊</p>
            <p class="text-white font-bold mt-1">Статистика</p>
            <p class="text-red-100 text-sm">Следите за выручкой и загрузкой кухни</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right panel - Login form -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Logo for mobile -->
        <div class="flex items-center gap-3 mb-8 lg:hidden">
          <div class="text-3xl">🍕</div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Pizzeria CRM</h1>
        </div>

        <div class="mb-8">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Добро пожаловать!</h2>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Войдите в свой аккаунт</p>
        </div>

        <div v-if="authStore.error" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-6 border border-red-200 dark:border-red-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ authStore.error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all"
              placeholder="admin@pizza.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Пароль</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white pr-11 transition-all"
                placeholder="••••••••"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg v-if="authStore.loading" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            {{ authStore.loading ? 'Вход...' : 'Войти' }}
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

