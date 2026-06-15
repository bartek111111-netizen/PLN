import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'error' | 'success' | 'warning'
  createdAt: number
  duration: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let idCounter = 0

  function add(message: string, type: Toast['type'] = 'error', duration = 6000) {
    const id = ++idCounter
    toasts.value.push({ id, message, type, createdAt: Date.now(), duration })
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
    return id
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function error(message: string, duration?: number) {
    return add(message, 'error', duration)
  }

  function success(message: string, duration?: number) {
    return add(message, 'success', duration)
  }

  function warning(message: string, duration?: number) {
    return add(message, 'warning', duration)
  }

  return { toasts, add, remove, error, success, warning }
})
