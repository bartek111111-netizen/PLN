<template>
  <div class="flex flex-wrap justify-center gap-4 mb-12">










    <button 
      :class="[
        'px-8 py-4 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg',


        currentPanel === 1
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/50'
          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
      ]"

      @click="switchPanel(1)"
    >

      Oblicz 1 cięcie
    </button>
    <button
      :class="[
        'px-8 py-4 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg',
        currentPanel === 2
          ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-cyan-500/50'
          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
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
