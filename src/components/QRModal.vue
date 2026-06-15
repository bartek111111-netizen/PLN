<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'

const props = defineProps<{
  url: string
}>()

const emit = defineEmits<{ close: [] }>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(async () => {
  if (canvasRef.value) {
    await QRCode.toCanvas(canvasRef.value, props.url, {
      width: 280,
      margin: 3
    })
  }
})
</script>

<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70" @click="emit('close')">
    <div class="bg-slate-800 rounded-2xl p-8 border border-slate-600 shadow-2xl flex flex-col items-center">
      <h3 class="text-white font-bold text-lg mb-4">Zeskanuj QR</h3>
      <canvas ref="canvasRef" class="rounded-lg bg-white" style="width: 280px; height: 280px;" />
      <p class="text-slate-400 text-xs mt-4 break-all">{{ url }}</p>
      <button
        @click="emit('close')"
        class="mt-6 px-8 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
      >
        Zamknij
      </button>
    </div>
  </div>
</template>
