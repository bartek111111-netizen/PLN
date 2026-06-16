<template>
  <div v-if="isCutResult(panel1Result)" class="mt-4 flex flex-col items-center justify-center w-full gap-6">
    <!-- Cięcie (Cut) -->
    <div class="w-full">
      <p class="text-slate-200 font-semibold mb-2 text-sm">
        Cięcie: <span class="text-blue-300">{{ panel1Result.cutWidth.toFixed(1) }}mm</span>
      </p>
      <div class="flex justify-center">
        <LayoutVisualizer 
          :layout="panel1Result.cut" 
          :width="panel1Result.cutWidth" 
          prefix="cut" 
        />
      </div>
    </div>

    <!-- Dystans cięcia (Spacing) -->
    <div class="w-full">
      <p class="text-slate-200 font-semibold mb-2 text-sm">
        Dystans cięcia: <span class="text-cyan-300">{{ panel1Result.spacingWidth.toFixed(1) }}mm</span>
      </p>
      <div class="flex justify-center">
        <LayoutVisualizer 
          :layout="panel1Result.spacing" 
          :width="panel1Result.spacingWidth" 
          prefix="spacing" 
        />
      </div>
    </div>
  </div>

  <div v-else-if="panel2Result" class="mt-4 p-5 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl">
    <p class="text-slate-100"><strong class="text-cyan-300">Wynik:</strong> <span class="text-white font-mono text-lg">{{ panel2Result }}</span></p>
  </div>

  <div v-else-if="panel1Result" class="mt-4 p-5 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-xl">
     <p class="text-slate-100"><strong class="text-blue-300">Wynik:</strong> <span class="text-white font-mono text-lg">{{ panel1Result }}</span></p>
  </div>
</template>

<script setup lang="ts">
import { type CutResult } from '../../stores/calculatorStore'
import LayoutVisualizer from './LayoutVisualizer.vue'

const props = defineProps<{
  panel1Result: any
  panel2Result: any
}>()

const isCutResult = (res: any): res is CutResult => {
  return res !== null && typeof res === 'object' && 'cut' in res
}
</script>
