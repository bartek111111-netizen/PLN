<template>
  <div class="relative flex items-center">
    <input
      :id="id"
      v-model="displayValue"
      ref="inputRef"
      type="number"
      :step="step"
      :min="min"
      :max="max"
      :placeholder="placeholder"
      @keydown="handleKeydown"
      class="w-full max-w-[280px] px-3 py-1.5 pr-16 bg-slate-900 border-2 border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
    >
    <div class="absolute right-1.5 flex flex-col gap-0.5">
      <button
        type="button"
        @click="increment"
        class="w-6 h-6 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-bold leading-none transition disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="isAtMax"
      >
        +
      </button>
      <button
        type="button"
        @click="decrement"
        class="w-6 h-6 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-bold leading-none transition disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="isAtMin"
      >
        −
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  step?: string | number
  min?: string | number
  max?: string | number
  id?: string
  placeholder?: string
}>(), {
  step: '1',
  min: undefined,
  max: undefined,
  id: undefined,
  placeholder: undefined
})

const modelValue = defineModel<string>({ required: true })

const inputRef = ref<HTMLInputElement | null>(null)

const numericStep = computed(() => {
  const s = parseFloat(String(props.step).replace(',', '.'))
  return isNaN(s) ? 1 : s
})

const currentValue = computed(() => {
  const v = parseFloat(String(modelValue.value).replace(',', '.'))
  return isNaN(v) ? 0 : v
})

const isAtMin = computed(() => {
  if (props.min === undefined) return false
  const minVal = parseFloat(String(props.min).replace(',', '.'))
  return currentValue.value <= minVal
})

const isAtMax = computed(() => {
  if (props.max === undefined) return false
  const maxVal = parseFloat(String(props.max).replace(',', '.'))
  return currentValue.value >= maxVal
})

const formatValue = (val: number): string => {
  const stepStr = String(props.step).replace(',', '.')
  const decimals = stepStr.includes('.') ? stepStr.split('.')[1].replace(/0+$/, '').length : 0
  return val.toFixed(decimals)
}

const displayValue = computed({
  get: () => modelValue.value,
  set: (val: string) => {
    modelValue.value = val
  }
})

const increment = () => {
  if (isAtMax.value) return
  const newVal = currentValue.value + numericStep.value
  modelValue.value = formatValue(newVal)
  inputRef.value?.focus()
}

const decrement = () => {
  if (isAtMin.value) return
  const newVal = currentValue.value - numericStep.value
  modelValue.value = formatValue(newVal)
  inputRef.value?.focus()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    increment()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    decrement()
  }
}
</script>