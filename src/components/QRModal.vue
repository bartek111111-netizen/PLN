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
  <Teleport to="body">
    <div>
      <!-- Black background layer -->
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: #0f172a; z-index: 100000;" @click="emit('close')"></div>

      <!-- Modal content -->
      <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 rounded-2xl p-8 border border-slate-600 shadow-2xl flex flex-col items-center" style="z-index: 100001;">
        <h3 class="text-white font-bold text-lg mb-4 text-center">Zeskanuj QR</h3>
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
  </Teleport>
</template>


