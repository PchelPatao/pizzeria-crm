<script setup lang="ts">
import { ref } from 'vue'
import { useOrderStore } from '../store'

const emit = defineEmits(['close'])
const store = useOrderStore()

const formData = ref({
  customer_name: '',
  customer_phone: '',
  items: '',
  total_price: 0
})

const isSubmitting = ref(false)
const error = ref<string | null>(null)

const submitOrder = async () => {
  isSubmitting.value = true
  error.value = null
  try {
    await store.createOrder({
      ...formData.value,
      items: formData.value.items
    })
    emit('close')
  } catch (e: any) {
    error.value = 'Не удалось создать заказ'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700">
      <!-- Modal header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 class="text-lg font-bold text-white">Новый заказ</h2>
          <p class="text-blue-200 text-xs mt-0.5">Заполните данные клиента и состав заказа</p>
        </div>
        <button @click="$emit('close')" class="text-blue-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div class="p-6">
        <div v-if="error" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-200 dark:border-red-800">
          {{ error }}
        </div>

        <form @submit.prevent="submitOrder" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Имя клиента</label>
              <input
                v-model="formData.customer_name"
                required
                type="text"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Иван Иванов"
              />
            </div>

            <div class="col-span-2">
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Телефон</label>
              <input
                v-model="formData.customer_phone"
                required
                type="tel"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="+7 900 123-45-67"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Состав заказа</label>
            <textarea
              v-model="formData.items"
              required
              rows="3"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="1x Маргарита, 2x Пепперони, 1x Кола..."
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Сумма заказа (₽)</label>
            <input
              v-model="formData.total_price"
              required
              type="number"
              step="1"
              min="0"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0"
            />
          </div>

          <div class="pt-2 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              @click="$emit('close')"
              class="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <svg v-if="isSubmitting" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              {{ isSubmitting ? 'Сохранение...' : 'Создать заказ' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
