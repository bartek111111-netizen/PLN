<template>
  <div class="flex flex-col sm:flex-row gap-2">
    <div class="relative flex-1">
      <input
        :id="id"
        ref="inputRef"
        v-model="displayValue"
        type="number"
        :step="step"
        :min="min"
        :max="max"
        :placeholder="placeholder"
        class="w-full px-3 py-1.5 pr-12 bg-slate-900 border-2 border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
        @keydown="handleKeydown"
      />
      <span
        v-if="suffix"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm font-medium"
      >
        {{ suffix }}
      </span>
    </div>
    <div class="flex gap-2">
      <button
        ref="plusBtn"
        type="button"
        class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-lg font-bold transition disabled:opacity-40 disabled:cursor-not-allowed active:bg-slate-500"
        :disabled="isAtMax"
        @click.stop="increment"
        @mousedown.stop="startRepeat('plus')"
        @mouseup.stop="stopRepeat"
        @mouseleave.stop="stopRepeat"
        @touchstart.passive.stop="startRepeat('plus')"
        @touchend.stop="stopRepeat"
        @touchcancel.stop="stopRepeat"
      >
        +
      </button>
      <button
        ref="minusBtn"
        type="button"
        class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-lg font-bold transition disabled:opacity-40 disabled:cursor-not-allowed active:bg-slate-500"
        :disabled="isAtMin"
        @click.stop="decrement"
        @mousedown.stop="startRepeat('minus')"
        @mouseup.stop="stopRepeat"
        @mouseleave.stop="stopRepeat"
        @touchstart.passive.stop="startRepeat('minus')"
        @touchend.stop="stopRepeat"
        @touchcancel.stop="stopRepeat"
      >
        −
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    step?: string | number
    min?: string | number
    max?: string | number
    id?: string
    placeholder?: string
    decimals?: number // fixed decimal places (undefined = auto based on step)
    suffix?: string
  }>(),
  {
    step: '1',
    min: undefined,
    max: undefined,
    id: undefined,
    placeholder: undefined,
    decimals: undefined,
    suffix: undefined,
  },
)

const modelValue = defineModel<string>({ required: true })

const inputRef = ref<HTMLInputElement | null>(null)
const plusBtn = ref<HTMLButtonElement | null>(null)
const minusBtn = ref<HTMLButtonElement | null>(null)

// Repeat timer references
let holdTimer: ReturnType<typeof setTimeout> | null = null
let repeatInterval: ReturnType<typeof setInterval> | null = null

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
  // Use fixed decimals if specified, otherwise auto-detect from step
  const decimals =
    props.decimals ??
    (() => {
      const stepStr = String(props.step).replace(',', '.')
      if (stepStr.includes('.')) {
        return stepStr.split('.')[1].replace(/0+$/, '').length
      }
      return 0
    })()
  return val.toFixed(decimals)
}

const displayValue = computed({
  get: () => modelValue.value,
  set: (val: string) => {
    modelValue.value = val
  },
})

const increment = () => {
  if (isAtMax.value) return
  const newVal = currentValue.value + numericStep.value
  modelValue.value = formatValue(newVal)
}

const decrement = () => {
  if (isAtMin.value) return
  const newVal = currentValue.value - numericStep.value
  modelValue.value = formatValue(newVal)
}

const startRepeat = (type: 'plus' | 'minus') => {
  // Stop any existing repeat first
  stopRepeat()

  // After 400ms of holding, start the repeat behavior
  holdTimer = setTimeout(() => {
    // First increment after hold
    if (type === 'plus') {
      increment()
    } else {
      decrement()
    }

    // Then repeat every 50ms
    repeatInterval = setInterval(() => {
      if (type === 'plus') {
        increment()
      } else {
        decrement()
      }
    }, 50)
  }, 400)
}

const stopRepeat = () => {
  if (holdTimer) {
    clearTimeout(holdTimer)
    holdTimer = null
  }
  if (repeatInterval) {
    clearInterval(repeatInterval)
    repeatInterval = null
  }
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
