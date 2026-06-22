<template>
  <div class="visualizer-container">
    <svg
      :viewBox="`0 0 ${width} 120`"
      role="img"
      :aria-label="`Визуализация: ${prefix || 'layout'}`"
      class="visualizer-svg"
      @click="emit('click')"
    >
      <g v-for="(item, index) in scaledLayout" :key="`${prefix}-${index}-${item.position}`">
        <!-- Knife -->
        <rect
          v-if="item.type === 'knife'"
          :x="item.position"
          y="20"
          :width="item.width"
          height="80"
          :fill="getColor(item)"
          stroke="#ffffff"
          stroke-width="1"
        />
        <text
          v-if="item.type === 'knife'"
          :x="item.position! + item.width! / 2"
          y="65"
          text-anchor="middle"
          fill="#ffffff"
          font-size="8"
        >
          K{{ item.size }}
        </text>

        <!-- Gum -->
        <rect
          v-if="item.type === 'gum'"
          :x="item.position"
          y="25"
          :width="item.width"
          height="70"
          :fill="getColor(item)"
          stroke="#ffffff"
          stroke-width="1"
          opacity="0.8"
        />
        <text
          v-if="item.type === 'gum'"
          :x="item.position! + item.width! / 2"
          y="65"
          text-anchor="middle"
          fill="#ffffff"
          font-size="8"
        >
          G{{ item.size }}
        </text>

        <!-- Spacer / Spacers -->
        <rect
          v-if="['spacer', 'spacers'].includes(item.type)"
          :x="item.position"
          y="35"
          :width="item.width"
          height="50"
          :fill="getColor(item)"
          stroke="#ffffff"
          stroke-width="1"
          opacity="0.7"
        />
        <text
          v-if="['spacer', 'spacers'].includes(item.type)"
          :x="item.position! + item.width! / 2"
          y="65"
          text-anchor="middle"
          fill="#ffffff"
          font-size="8"
        >
          D{{ item.type === 'spacers' ? item.totalWidth : item.size }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { LayoutItem } from '../../stores/calculatorStore'
import { getLayoutItemWidth } from '../../stores/calculatorStore'
import { computed } from 'vue'

const props = defineProps<{
  layout: LayoutItem[]
  width: number
  prefix?: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const ELEMENT_COLORS: Record<string, string> = {
  knife: '#808080',
  gum: '#3b82f6',
  spacer: '#a0a0a0',
  spacers: '#a0a0a0',
  gap: '#ffffff',
  default: '#cccccc',
}

const getColor = (item: LayoutItem): string => {
  if (item.type === 'gum') {
    return item.color ? getGumColor(item.color) : ELEMENT_COLORS.gum
  }
  if (item.type === 'knife' || item.type === 'spacer') {
    return item.color ? getGumColor(item.color) : ELEMENT_COLORS[item.type]
  }
  return ELEMENT_COLORS[item.type] || ELEMENT_COLORS.default
}

const getGumColor = (color?: string): string => {
  const map: Record<string, string> = {
    blue: '#3b82f6',
    red: '#ef4444',
    yellow: '#eab308',
    gray: '#808080',
  }
  return map[color || 'blue'] || ELEMENT_COLORS.gum
}

type ScaledLayoutItem = LayoutItem & {
  position: number
  width: number
}

const scaledLayout = computed(() => {
  if (!props.layout || !Array.isArray(props.layout)) return []

  let position = 0

  return props.layout.map((item) => {
    const scaled: ScaledLayoutItem = {
      ...item,
      position,
      width: 0,
    }

    scaled.width = getLayoutItemWidth(item)
    position += scaled.width
    return scaled
  })
})
</script>