<script setup lang="ts">
import { ref } from 'vue'
import { useOrderStore, type Order } from '../store'

const props = defineProps<{
  order?: Order | null  // если передан — режим редактирования
}>()

const emit = defineEmits(['close'])
const store = useOrderStore()

const isEdit = !!props.order

const formData = ref({
  customer_name: props.order?.customer_name ?? '',
  customer_phone: props.order?.customer_phone ?? '',
  items: (() => {
    if (!props.order) return ''
    const it = props.order.items
    return typeof it === 'string' ? it : JSON.stringify(it)
  })(),
  total_price: props.order?.total_price ?? 0,
})

const isSubmitting = ref(false)
const error = ref<string | null>(null)

// ── Маска телефона ────────────────────────────────────────────────
function formatPhone(raw: string): string {
  // Оставляем только цифры
  let digits = raw.replace(/\D/g, '')

  // Нормализуем начало: 8 → 7
  if (digits.startsWith('8')) digits = '7' + digits.slice(1)
  if (!digits.startsWith('7') && digits.length > 0) digits = '7' + digits

  // Строим маску +7 (XXX) XXX-XX-XX
  let result = ''
  if (digits.length > 0) result = '+7'
  if (digits.length > 1) result += ' (' + digits.slice(1, 4)
  if (digits.length >= 4) result += ') ' + digits.slice(4, 7)
  if (digits.length >= 7) result += '-' + digits.slice(7, 9)
  if (digits.length >= 9) result += '-' + digits.slice(9, 11)

  return result
}

function onPhoneInput(e: Event) {
  const input = e.target as HTMLInputElement
  const formatted = formatPhone(input.value)
  formData.value.customer_phone = formatted
  // Обновляем значение input напрямую, чтобы курсор не прыгал
  input.value = formatted
}

function onPhoneKeydown(e: KeyboardEvent) {
  // Позволяем только цифры, Backspace, Delete, стрелки, Tab
  const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End']
  if (allowed.includes(e.key)) return
  if (e.ctrlKey || e.metaKey) return // Ctrl+A, Ctrl+C и т.д.
  if (!/^\d$/.test(e.key)) e.preventDefault()
}

// ── Сохранение ───────────────────────────────────────────────────
const submitOrder = async () => {
  isSubmitting.value = true
  error.value = null
  try {
    if (isEdit && props.order) {
      await store.updateOrder(props.order.id, { ...formData.value })
    } else {
      await store.createOrder({ ...formData.value })
    }
    emit('close')
  } catch (e: any) {
    error.value = isEdit ? 'Не удалось сохранить изменения' : 'Не удалось создать заказ'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md overflow-hidden border border-slate-200 dark:border-slate-700 max-h-[92dvh] flex flex-col">
      <!-- Drag handle (mobile only) -->
      <div class="sm:hidden flex justify-center pt-3 pb-1">
        <div class="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
      </div>

      <!-- Заголовок -->
      <div
        class="px-5 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center"
        :class="isEdit ? 'bg-gradient-to-r from-violet-600 to-purple-700' : 'bg-gradient-to-r from-blue-600 to-blue-700'"
      >
        <div>
          <h2 class="text-lg font-bold text-white">
            {{ isEdit ? `Редактировать заказ #${order!.id}` : 'Новый заказ' }}
          </h2>
          <p class="text-xs mt-0.5" :class="isEdit ? 'text-purple-200' : 'text-blue-200'">
            {{ isEdit ? 'Измените данные клиента или состав заказа' : 'Заполните данные клиента и состав заказа' }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="transition-colors p-1 rounded-lg hover:bg-white/10"
          :class="isEdit ? 'text-purple-200 hover:text-white' : 'text-blue-200 hover:text-white'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      <!-- Тело -->
      <div class="p-5 sm:p-6 overflow-y-auto flex-1">
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-200 dark:border-red-800 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
          {{ error }}
        </div>

        <form @submit.prevent="submitOrder" class="space-y-4">
          <!-- Имя -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Имя клиента
            </label>
            <input
              v-model="formData.customer_name"
              required
              type="text"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
              placeholder="Иван Иванов"
            />
          </div>

          <!-- Телефон с маской -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Телефон
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.64 4.55 2 2 0 0 1 3.62 2.36h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/>
                </svg>
              </span>
              <input
                :value="formData.customer_phone"
                @input="onPhoneInput"
                @keydown="onPhoneKeydown"
                required
                type="tel"
                inputmode="numeric"
                autocomplete="tel"
                maxlength="18"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 pl-9 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 font-mono tracking-wide"
                placeholder="+7 (900) 123-45-67"
              />
            </div>
            <p class="text-xs text-slate-400 mt-1 ml-0.5">Формат: +7 (XXX) XXX-XX-XX</p>
          </div>

          <!-- Состав заказа -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Состав заказа
            </label>
            <textarea
              v-model="formData.items"
              required
              rows="3"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder-slate-400"
              placeholder="1x Маргарита, 2x Пепперони, 1x Кола..."
            ></textarea>
          </div>

          <!-- Сумма -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Сумма заказа (₽)
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 text-sm font-semibold">₽</span>
              <input
                v-model="formData.total_price"
                required
                type="number"
                step="1"
                min="0"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 pl-7 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                placeholder="0"
              />
            </div>
          </div>

          <!-- Кнопки -->
          <div class="pt-3 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              @click="$emit('close')"
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600 sm:border-transparent"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              :class="isEdit ? 'bg-violet-600 hover:bg-violet-700' : 'bg-blue-600 hover:bg-blue-700'"
            >
              <svg v-if="isSubmitting" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              <svg v-else-if="isEdit" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14m-7-7h14"/></svg>
              {{ isSubmitting ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Создать заказ' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
