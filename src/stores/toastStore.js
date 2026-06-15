import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let idCounter = 0

  function add(message, type = 'error', duration = 4000) {
    const id = ++idCounter
    toasts.value.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
    return id
  }

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function error(message, duration) {
    return add(message, 'error', duration)
  }

  function success(message, duration) {
    return add(message, 'success', duration)
  }

  function warning(message, duration) {
    return add(message, 'warning', duration)
  }

  return { toasts, add, remove, error, success, warning }
})
