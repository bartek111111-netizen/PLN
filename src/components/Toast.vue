<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: { type: String, required: true },
  type: { type: String, default: 'error' }
})

const emit = defineEmits(['close'])

const bgColor = computed(() => {
  switch (props.type) {
    case 'success': return 'from-green-500 to-emerald-600'
    case 'warning': return 'from-yellow-500 to-amber-600'
    case 'error': default: return 'from-red-500 to-rose-600'
  }
})
</script>

<template>
  <div class="flex items-center gap-3 px-5 py-3 rounded-lg bg-gradient-to-r text-white shadow-xl animate-slide-in">
    <span class="text-sm font-medium">{{ message }}</span>
    <button @click="emit('close')" class="ml-auto text-white/80 hover:text-white transition focus:outline-none">
      ✕
    </button>
  </div>
</template>

<style>
@keyframes slide-in {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-slide-in {
  animation: slide-in 0.25s ease-out;
}
</style>
