<template>
  <div class="flex justify-center">
    <svg
      :viewBox="`0 0 ${width} 120`"
      :style="{ width: `${width * 4}px`, height: '80px' }"
      class="bg-slate-900 rounded-lg border border-slate-700 cursor-pointer"
      @click="$emit('click')"
    >
      <g v-for="(item, index) in getLayout(layout)" :key="`${prefix}-${index}`">
        <rect v-if="item.type === 'knife'" :x="item.position!" y="20" :width="item.width!" height="80" fill="#808080" stroke="#ffffff" stroke-width="1"/>
        <rect v-if="item.type === 'gum'" :x="item.position!" y="25" :width="item.width!" height="70" :fill="getGumColor(item.color)" stroke="#ffffff" stroke-width="1" opacity="0.8"/>
        <text v-if="item.type === 'gum'" :x="item.position! + item.width! / 2" y="65" text-anchor="middle" fill="#ffffff" font-size="8">G{{ item.width!.toFixed(1) }}</text>
        <rect v-if="item.type === 'spacer'" :x="item.position!" y="35" :width="item.width!" height="50" fill="#a0a0a0" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
        <text v-if="item.type === 'spacer'" :x="item.position! + item.width! / 2" y="65" text-anchor="middle" fill="#ffffff" font-size="8">D{{ item.width!.toFixed(1) }}</text>
        <rect v-if="item.type === 'spacers'" :x="item.position!" y="35" :width="item.width!" height="50" fill="#a0a0a0" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
        <text v-if="item.type === 'spacers'" :x="item.position! + item.width! / 2" y="65" text-anchor="middle" fill="#ffffff" font-size="8">D{{ item.width!.toFixed(1) }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { LayoutItem } from '../../stores/calculatorStore'

const props = defineProps<{
  layout: LayoutItem[] | null
  width: number
  prefix?: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const getLayout = (layout: LayoutItem[] | null) => {
  if (!layout || !Array.isArray(layout)) return []

  let position = 0

  return layout.map(item => {
    const scaled: LayoutItem = {
      ...item,
      position
    }

    if (['knife', 'gum', 'gap', 'spacer'].includes(item.type)) {
      scaled.width = item.size || item.width || 0
      position += scaled.width
    } else if (item.type === 'spacers') {
      scaled.width = item.totalWidth || 0
      position += scaled.width
    }

    return scaled
  })
}

const getGumColor = (color?: string) => {
  const map: Record<string, string> = { blue: '#3b82f6', red: '#ef4444', yellow: '#eab308' }
  return map[color || 'blue'] || '#3b82f6'
}
</script>
