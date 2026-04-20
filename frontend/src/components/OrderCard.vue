<script setup lang="ts">
import { computed } from 'vue'
import { useOrderStore, type Order } from '../store'

const props = defineProps<{
  order: Order,
  allStatuses: string[],
  isDragging?: boolean
}>()

const emit = defineEmits<{
  (e: 'drag-start', id: number): void
  (e: 'drag-end'): void
  (e: 'edit', order: Order): void
}>()

const store = useOrderStore()

const currentStatusIndex = computed(() => props.allStatuses.indexOf(props.order.status))
const nextStatus = computed(() => props.allStatuses[currentStatusIndex.value + 1])
const prevStatus = computed(() => props.allStatuses[currentStatusIndex.value - 1])

// Перевод статусов
const statusLabels: Record<string, string> = {
  'New':       'Новый',
  'Preparing': 'Готовится',
  'Ready':     'Готов',
  'Delivered': 'Доставлен',
}

const statusColors: Record<string, string> = {
  'New':       'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  'Preparing': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Ready':     'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'Delivered': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

// Перевод кнопок перемещения
const statusShortLabels: Record<string, string> = {
  'New':       'Новые',
  'Preparing': 'Готовка',
  'Ready':     'Готово',
  'Delivered': 'Доставлен',
}

const moveStatus = (status: string) => {
  store.updateOrderStatus(props.order.id, status)
}

const deleteOrder = async () => {
  if (confirm('Удалить заказ #' + props.order.id + '?')) {
    await store.deleteOrder(props.order.id)
  }
}

const formattedItems = computed(() => {
  const items = props.order.items
  return typeof items === 'string' ? items : JSON.stringify(items)
})

const formattedDate = computed(() => {
  return new Date(props.order.created_at).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  })
})
</script>

<template>
  <div
    draggable="true"
    @dragstart="emit('drag-start', order.id)"
    @dragend="emit('drag-end')"
    class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-grab active:cursor-grabbing select-none"
    :class="{ 'opacity-40 scale-95 rotate-1 shadow-lg ring-2 ring-blue-400/30': isDragging }"
  >
    <!-- Шапка карточки -->
    <div class="flex justify-between items-start mb-3">
      <span class="text-xs font-bold text-slate-400 dark:text-slate-500">#{{ order.id }}</span>
      <div class="flex items-center gap-1.5">
        <!-- Кнопка редактирования -->
        <button
          @click.stop="emit('edit', order)"
          class="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all duration-150"
          title="Редактировать заказ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <span :class="statusColors[order.status]" class="text-xs font-semibold px-2 py-0.5 rounded-full">
          {{ statusLabels[order.status] ?? order.status }}
        </span>
      </div>
    </div>

    <!-- Данные клиента -->
    <h3 class="font-semibold text-slate-900 dark:text-white mb-0.5 truncate">{{ order.customer_name }}</h3>
    <p class="text-xs text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.64 4.55 2 2 0 0 1 3.62 2.36h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/>
      </svg>
      {{ order.customer_phone }}
    </p>

    <!-- Состав заказа -->
    <div class="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2.5 mb-3">
      <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
        {{ formattedItems }}
      </p>
    </div>

    <!-- Сумма и время -->
    <div class="flex justify-between items-center mb-3">
      <span class="text-base font-bold text-slate-900 dark:text-white">{{ order.total_price.toLocaleString('ru-RU') }} ₽</span>
      <span class="text-xs text-slate-400">{{ formattedDate }}</span>
    </div>

    <!-- Действия -->
    <div class="flex gap-1.5">
      <button
        v-if="prevStatus"
        @click="moveStatus(prevStatus)"
        class="flex-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
      >&larr; {{ statusShortLabels[prevStatus] ?? prevStatus }}</button>
      <button
        v-if="nextStatus"
        @click="moveStatus(nextStatus)"
        class="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
      >{{ statusShortLabels[nextStatus] ?? nextStatus }} &rarr;</button>
      <button
        v-if="!nextStatus"
        @click="deleteOrder"
        class="flex-1 py-1.5 px-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium transition-colors border border-red-200 dark:border-red-800"
      >✓ Завершить</button>
    </div>
  </div>
</template>
