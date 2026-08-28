<template>
  <div v-if="isCutResult(panel1Result)" class="cut-result-container">
    <!-- Cięcie (Cut) -->
    <div class="w-full">
      <div class="flex items-center justify-between w-full mb-1">
        <p class="cut-result-label">
          Cięcie:
          <span class="cut-result-value">{{ panel1Result.cutWidth.toFixed(1) }}mm</span>
        </p>
        <div class="flex items-center gap-1">
          <button
            class="gum-btn"
            :disabled="!canDecrease('cut')"
            aria-label="Zmniejsz ilość gum"
            @click="adjustGums('cut', -1)"
          >
            −
          </button>
          <span class="gum-count">{{ pendingCount('cut') }}</span>
          <button
            class="gum-btn"
            :disabled="!canIncrease('cut')"
            aria-label="Zwiększ ilość gum"
            @click="adjustGums('cut', 1)"
          >
            +
          </button>
          <span class="gum-label">{{ UI_GUM_COUNT_LABEL }}</span>
        </div>
      </div>
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
      <div class="flex items-center justify-between w-full mb-1">
        <p class="cut-result-label">
          Dystans cięcia:
          <span class="spacing-result-value">{{ panel1Result.spacingWidth.toFixed(1) }}mm</span>
        </p>
        <div class="flex items-center gap-1">
          <button
            class="gum-btn"
            :disabled="!canDecrease('spacing')"
            aria-label="Zmniejsz ilość gum"
            @click="adjustGums('spacing', -1)"
          >
            −
          </button>
          <span class="gum-count">{{ pendingCount('spacing') }}</span>
          <button
            class="gum-btn"
            :disabled="!canIncrease('spacing')"
            aria-label="Zwiększ ilość gum"
            @click="adjustGums('spacing', 1)"
          >
            +
          </button>
          <span class="gum-label">{{ UI_GUM_COUNT_LABEL }}</span>
        </div>
      </div>
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

  <div v-else-if="panel2Result" class="result-card-alt">
    <p class="result-label">
      <strong class="result-strong-alt">Wynik:</strong>
      <span class="result-value">{{ panel2Result }}</span>
    </p>
  </div>

  <div v-else-if="panel1Result" class="result-card">
    <p class="result-label">
      <strong class="result-strong">Wynik:</strong>
      <span class="result-value">{{ panel1Result }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useCalculatorStore } from '../../stores/calculatorStore'
import { type CutResult } from '../../stores/calculatorStore'
import { DEFAULT_GUM_SIZE, MIN_SPACER, UI_GUM_COUNT_LABEL } from '../../constants'
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

const pendingCount = (type: 'cut' | 'spacing'): number => {
  if (!isCutResult(props.panel1Result)) return 0
  return props.panel1Result.gumCounts[type] + store.gumAdjustment[type]
}

const adjustGums = (type: 'cut' | 'spacing', delta: number) => {
  if (!isCutResult(props.panel1Result)) return
  store.adjustGumCount(type, delta)
}

const canDecrease = (type: 'cut' | 'spacing'): boolean => {
  return pendingCount(type) > 0
}

const canIncrease = (type: 'cut' | 'spacing'): boolean => {
  if (!isCutResult(props.panel1Result)) return false
  const pending = pendingCount(type)
  const remaining = props.panel1Result.remainingWidths[type]
  return (pending + 1) * DEFAULT_GUM_SIZE + pending * MIN_SPACER <= remaining
}
</script>

<style scoped>
.gum-btn {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #334155;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: background 0.2s;
}
.gum-btn:hover:not(:disabled) {
  background: #475569;
}
.gum-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.gum-count {
  min-width: 24px;
  text-align: center;
  font-size: 14px;
  color: white;
  font-weight: 600;
}
.gum-label {
  font-size: 12px;
  color: #94a3b8;
  margin-left: 4px;
}
</style>
