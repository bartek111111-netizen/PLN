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
      <div
        class="fixed inset-0 bg-slate-900 z-[100000]"
        @click="emit('close')"
      ></div>

      <!-- Modal content -->
      <div
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100001]"
        @click.stop
      >
        <div class="p-5 border-b border-slate-700/50 bg-slate-800/50 flex flex-col items-center">
          <h3 class="text-lg font-bold text-white tracking-tight text-center">Zeskanuj QR</h3>
          <canvas ref="canvasRef" class="rounded-lg bg-white mt-4 mb-2" style="width: 280px; height: 280px;" />
          <p class="text-slate-400 text-xs break-all">{{ url }}</p>
  </div>

        <div class="p-4 bg-slate-900/30 border-t border-slate-700/50 text-center">
          <p class="text-slate-500 text-[10px] uppercase tracking-widest font-semibold">Kliknij poza, aby zamknąć</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

