<template>
  <form class="space-y-3" @submit.prevent>
    <div>
      <label class="block text-slate-200 font-semibold mb-2 text-sm">{{ LABEL_CUT_WIDTH }}</label>
      <NumberInput
        v-model="store.panels.panel1.cutWidth"
        step="0.01"
        :decimals="2"
        :min="MIN_CUT_WIDTH"
        :max="MAX_CUT_WIDTH"
        suffix="mm"
        :placeholder="LABEL_CUT_WIDTH_PLACEHOLDER"
      />
    </div>
    <div>
      <label class="block text-slate-200 font-semibold mb-2 text-sm">
        {{ LABEL_MATERIAL_THICKNESS }}
      </label>
      <NumberInput
        v-model="store.panels.panel1.materialThickness"
        step="0.01"
        :decimals="2"
        :min="MIN_MATERIAL_THICKNESS"
        :max="MAX_MATERIAL_THICKNESS"
        suffix="mm"
        :placeholder="LABEL_CUT_WIDTH_PLACEHOLDER"
      />
    </div>
    <div>
      <label class="block text-slate-200 font-semibold mb-2 text-sm">{{ LABEL_CUT_GAP }}</label>
      <NumberInput
        v-model="store.panels.panel1.cutGap"
        step="0.1"
        :min="MIN_CUT_GAP"
        :max="3"
        suffix="mm"
        :placeholder="LABEL_CUT_GAP_AUTO"
        @input="store.setGapOverridden(true)"
      />
    </div>
    <div>
      <label class="block text-slate-200 font-semibold mb-2 text-sm">{{ LABEL_KNIFE_SIZE }}</label>
      <select
        v-model="store.panels.panel1.knifeSize"
        class="w-full max-w-[280px] px-3 py-1.5 bg-slate-900 border-2 border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
      >
        <option value="">
          {{ LABEL_SELECT_SIZE }}
        </option>
        <option v-for="size in KNIFE_SIZES" :key="size" :value="String(size)">{{ size }}mm</option>
      </select>
    </div>
    <button
      type="button"
      class="w-full max-w-[350px] mt-8 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-green-500/30 hover:from-green-500 hover:to-emerald-600 hover:shadow-green-500/50 transition-all duration-300 transform active:scale-95"
      @click="calculate"
    >
      {{ UI_CALCULATE_BUTTON }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { useCalculatorStore } from '../../stores/calculatorStore'
import { useToastStore } from '../../stores/toastStore'
import { panel1Schema } from '../../validation/panel1Schema'
import {
  LABEL_CUT_WIDTH,
  LABEL_MATERIAL_THICKNESS,
  LABEL_CUT_GAP,
  LABEL_KNIFE_SIZE,
  LABEL_SELECT_SIZE,
  LABEL_CUT_WIDTH_PLACEHOLDER,
  LABEL_CUT_GAP_AUTO,
  MIN_CUT_WIDTH,
  MAX_CUT_WIDTH,
  MIN_MATERIAL_THICKNESS,
  MAX_MATERIAL_THICKNESS,
  MIN_CUT_GAP,
  KNIFE_SIZES,
  UI_CALCULATE_BUTTON,
} from '../../constants'
import { handleValidationError } from '../../utils/errorHandler'
import NumberInput from './NumberInput.vue'

const store = useCalculatorStore()
const toastStore = useToastStore()

const calculate = () => {
  try {
    panel1Schema.parse(store.panels.panel1)
    store.calculate(1, store.panels.panel1)
    toastStore.success('Obliczenia wykonane pomyślnie.', 2500)
  } catch (err) {
    handleValidationError(err, toastStore)
  }
}
</script>
