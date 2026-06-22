<template>
  <div
    v-if="isCutResult(panel1Result)"
    class="cut-result-container"
  >
    <!-- Cięcie (Cut) -->
    <div class="w-full">
      <p class="cut-result-label">
        Cięcie:
        <span class="cut-result-value">{{ panel1Result.cutWidth.toFixed(1) }}mm</span>
      </p>
      <div class="flex-center">
        <LayoutVisualizer
          :layout="panel1Result.cut"
          :width="panel1Result.cutWidth"
          prefix="cut"
          @click="openModal('cut')"
        />
      </div>
    </div>

    <!-- Dystans cięcia (Spacing) -->
    <div class="w-full">
      <p class="cut-result-label">
        Dystans cięcia:
        <span class="spacing-result-value">{{ panel1Result.spacingWidth.toFixed(1) }}mm</span>
      </p>
      <div class="flex-center">
        <LayoutVisualizer
          :layout="panel1Result.spacing"
          :width="panel1Result.spacingWidth"
          prefix="spacing"
          @click="openModal('spacing')"
        />
      </div>
    </div>
  </div>

  <div
    v-else-if="panel2Result"
    class="result-card-alt"
  >
    <p class="result-label">
      <strong class="result-strong-alt">Wynik:</strong>
      <span class="result-value">{{ panel2Result }}</span>
    </p>
  </div>

  <div
    v-else-if="panel1Result"
    class="result-card"
  >
    <p class="result-label">
      <strong class="result-strong">Wynik:</strong>
      <span class="result-value">{{ panel1Result }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useCalculatorStore } from '../../stores/calculatorStore'
import { type CutResult } from '../../stores/calculatorStore'
import LayoutVisualizer from './LayoutVisualizer.vue'

const props = defineProps<{
  panel1Result: CutResult | null
  panel2Result: CutResult | null
}>()

const store = useCalculatorStore()

const isCutResult = (res: CutResult | null): res is CutResult => {
  return res !== null && typeof res === 'object' && 'cut' in res
}

const openModal = (type: 'cut' | 'spacing') => {
  if (isCutResult(props.panel1Result)) {
    if (type === 'cut') {
      store.openModal(props.panel1Result.cut, 'Szczegóły Cięcia')
    } else {
      store.openModal(props.panel1Result.spacing, 'Szczegóły Dystansu Cięcia')
    }
  }
}
</script>