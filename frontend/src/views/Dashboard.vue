<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useOrderStore } from '../store'
import OrderCard from '../components/OrderCard.vue'
import CreateOrderModal from '../components/CreateOrderModal.vue'
import { useAuthStore } from '../store/auth'

const store = useOrderStore()
const authStore = useAuthStore()

onMounted(() => {
  store.fetchOrders()
})

const statuses = ['New', 'Preparing', 'Ready', 'Delivered']
const isCreateModalOpen = ref(false)

const statusConfig: Record<string, { label: string; color: string; dot: string; badge: string }> = {
  'New': {
    label: 'Новые',
    color: 'border-t-sky-500',
    dot: 'bg-sky-500',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  },
  'Preparing': {
    label: 'Готовятся',
    color: 'border-t-amber-500',
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  'Ready': {
    label: 'Готовы',
    color: 'border-t-green-500',
    dot: 'bg-green-500',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  },
  'Delivered': {
    label: 'Доставлены',
    color: 'border-t-slate-400',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  },
}

const totalRevenue = computed(() =>
  store.orders.reduce((sum, o) => sum + o.total_price, 0)
)

const todayOrders = computed(() => {
  const today = new Date().toDateString()
  return store.orders.filter(o => new Date(o.created_at).toDateString() === today).length
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950 pb-20 sm:pb-0">
    <!-- Top Navigation Bar -->
    <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center">
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-sm font-bold shadow flex-shrink-0">🍕</div>
          <div>
            <h1 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">Pizzeria CRM</h1>
            <p class="text-xs text-slate-400 leading-tight hidden sm:block">Управление заказами</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 sm:gap-3">
          <!-- Refresh: visible on all screens -->
          <button
            @click="store.fetchOrders()"
            :disabled="store.loading"
            class="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Обновить"
          >
            <svg :class="{ 'animate-spin': store.loading }" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
          </button>
          <!-- New order: hidden on mobile (shown in bottom bar) -->
          <button
            @click="isCreateModalOpen = true"
            class="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14m-7-7h14"/></svg>
            Новый заказ
          </button>
          <!-- New employee: icon-only on mobile -->
          <router-link
            to="/register"
            class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-1.5"
            title="Добавить сотрудника"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            <span class="hidden sm:inline">Новый сотрудник</span>
          </router-link>
          <div class="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
          <div class="text-right hidden sm:block">
            <p class="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[160px]">{{ authStore.token ? 'Администратор' : '' }}</p>
          </div>
          <button
            @click="authStore.logout()"
            class="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Выйти"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="bg-white dark:bg-slate-900 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p class="text-xs text-slate-500 font-medium mb-0.5">Всего заказов</p>
          <p class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{{ store.orders.length }}</p>
        </div>
        <div class="bg-white dark:bg-slate-900 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p class="text-xs text-slate-500 font-medium mb-0.5">Сегодня</p>
          <p class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{{ todayOrders }}</p>
        </div>
        <div class="bg-white dark:bg-slate-900 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p class="text-xs text-slate-500 font-medium mb-0.5">В работе</p>
          <p class="text-xl sm:text-2xl font-bold text-amber-600">{{ store.orders.filter(o => o.status === 'Preparing').length }}</p>
        </div>
        <div class="bg-white dark:bg-slate-900 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p class="text-xs text-slate-500 font-medium mb-0.5">Выручка</p>
          <p class="text-xl sm:text-2xl font-bold text-green-600">{{ totalRevenue.toLocaleString('ru-RU') }} ₽</p>
        </div>
      </div>

      <!-- Kanban Board: horizontal scroll on mobile, grid on desktop -->
      <div class="-mx-3 sm:mx-0">
        <div class="flex sm:grid sm:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-0 px-3 sm:px-0 snap-x snap-mandatory sm:snap-none kanban-scroll">
          <div
            v-for="status in statuses"
            :key="status"
            class="bg-white dark:bg-slate-900 rounded-xl border-t-4 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-shrink-0 w-72 sm:w-auto snap-start"
            :class="statusConfig[status].color"
          >
            <!-- Column Header -->
            <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span :class="statusConfig[status].dot" class="w-2 h-2 rounded-full"></span>
                <h2 class="font-semibold text-sm text-slate-700 dark:text-slate-200">{{ statusConfig[status].label }}</h2>
              </div>
              <span :class="statusConfig[status].badge" class="text-xs font-bold px-2 py-0.5 rounded-full">
                {{ store.orders.filter(o => o.status === status).length }}
              </span>
            </div>

            <!-- Cards -->
            <div class="p-3 space-y-2.5 min-h-[340px] sm:min-h-[480px]">
              <div v-if="store.loading" class="flex items-center justify-center py-12">
                <svg class="animate-spin text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              </div>
              <template v-else>
                <OrderCard
                  v-for="order in store.orders.filter(o => o.status === status)"
                  :key="order.id"
                  :order="order"
                  :allStatuses="statuses"
                />
                <div
                  v-if="store.orders.filter(o => o.status === status).length === 0"
                  class="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-slate-400"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                  </div>
                  <p class="text-xs text-slate-400 dark:text-slate-600">Нет заказов</p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Action Bar -->
    <div class="sm:hidden fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex gap-3 shadow-lg mobile-bottom-bar">
      <button
        @click="isCreateModalOpen = true"
        class="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14m-7-7h14"/></svg>
        Новый заказ
      </button>
    </div>

    <CreateOrderModal
      v-if="isCreateModalOpen"
      @close="isCreateModalOpen = false"
    />
  </div>
</template>

