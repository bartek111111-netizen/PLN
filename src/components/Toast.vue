<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  message: string
  type: 'error' | 'success' | 'warning'
  createdAt: number
  duration: number
}>()

const fadeOutThreshold = 1000
let tickInterval: ReturnType<typeof setInterval> | null = null
const opacity = ref(1)

function updateOpacity() {
  const elapsed = Date.now() - props.createdAt
  const remaining = props.duration - elapsed
  if (remaining <= 0) {
    opacity.value = 0
  } else if (remaining < fadeOutThreshold) {
    opacity.value = remaining / fadeOutThreshold
  } else {
    opacity.value = 1
  }
}

onMounted(() => {
  tickInterval = setInterval(updateOpacity, 50)
})

onUnmounted(() => {
  if (tickInterval) clearInterval(tickInterval)
})
</script>

<template>
  <div class="toast text-center px-5 py-3 shadow-2xl border border-white/10 animate-slide-in"
    :data-type="type"
    :style="{ opacity: opacity }">
    <span class="text-sm font-medium">{{ message }}</span>
  </div>
</template>

<style scoped>
.toast {
  background-color: #dc2626; /* red-600 dla jasnego motywu */
  color: white;
  border-radius: 0.75rem; /* 12px dla zaokrąglonych rogów */
}

.toast[data-type="success"] {
  background-color: #16a34a; /* green-600 */
}

.toast[data-type="warning"] {
  background-color: #eab308; /* yellow-500 */
  color: #0f172a; /* ciemny tekst dla kontrastu */
}

@media (prefers-color-scheme: dark) {
  .toast {
    background-color: #ef4444; /* red-500 dla ciemnego motywu (jaśniejszy) */
  }
  .toast[data-type="success"] {
    background-color: #22c55e; /* green-500 */
  }
  .toast[data-type="warning"] {
    background-color: #facc15; /* yellow-400 */
    color: #0f172a;
  }
}

@keyframes slide-in {
  from { transform: translateY(-12px); }
  to   { transform: translateY(0); }
}
.animate-slide-in {
  animation: slide-in 0.25s ease-out;
}
</style>
