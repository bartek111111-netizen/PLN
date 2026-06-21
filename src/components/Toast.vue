<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  message: string
  type: 'error' | 'success' | 'warning'
  createdAt: number
  duration: number
}>()

const opacity = ref(1)
let fadeTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  // Start fade-out 1s before removal
  fadeTimer = setTimeout(
    () => {
      opacity.value = 0
    },
    Math.max(0, props.duration - 1000),
  )
})

onUnmounted(() => {
  if (fadeTimer) clearTimeout(fadeTimer)
})
</script>

<template>
  <div
    class="toast text-center px-5 py-3 shadow-2xl border border-white/10 animate-slide-in transition-opacity duration-1000"
    :data-type="type"
    :style="{ opacity: opacity }"
  >
    <span class="text-sm font-medium">{{ message }}</span>
  </div>
</template>

<style scoped>
.toast {
  background-color: #dc2626;
  color: white;
  border-radius: 0.75rem;
}

.toast[data-type='success'] {
  background-color: #16a34a;
}

.toast[data-type='warning'] {
  background-color: #eab308;
  color: #0f172a;
}
@keyframes slide-in {
  from {
    transform: translateY(-12px);
  }
  to {
    transform: translateY(0);
  }
}
.animate-slide-in {
  animation: slide-in 0.25s ease-out;
}
</style>
