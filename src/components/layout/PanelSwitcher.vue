<template>
  <div class="flex flex-wrap justify-center gap-4 py-4 rounded-2xl px-4">
    <button 
      :class="[
        'px-8 py-3 font-semibold rounded-xl transition-all duration-200',
        currentPanel === 1
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-2 border-blue-400 shadow-lg shadow-blue-500/30'
          : 'bg-slate-600 text-white border-2 border-slate-500 hover:bg-slate-500 hover:border-slate-400'
      ]"
      @click="switchPanel(1)"
    >
      Oblicz 1 cięcie
    </button>
    <button
      :class="[
        'px-8 py-3 font-semibold rounded-xl transition-all duration-200',
        currentPanel === 2
          ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-2 border-cyan-400 shadow-lg shadow-cyan-500/30'
          : 'bg-slate-600 text-white border-2 border-slate-500 hover:bg-slate-500 hover:border-slate-400'
      ]"
      @click="switchPanel(2)"
    >
      Oblicz wszystkie cięcia
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPanel: number
}>()

const emit = defineEmits<{
  (e: 'switch', panel: number): void
}>()

const switchPanel = (panel: number) => {
  emit('switch', panel)
}
</script>


