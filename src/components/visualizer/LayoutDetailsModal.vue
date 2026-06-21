<template>
  <Teleport to="body">
    <div v-if="isOpen" @click="$emit('close')">
      <!-- Black background layer -->
      <div class="fixed inset-0 bg-slate-900 z-[100000]" />

      <!-- Modal content -->
      <div
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] max-w-full bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100001]"
        @click.stop
      >
        <div class="p-5 border-b border-slate-700/50 bg-slate-800/50">
          <h3 class="text-lg font-bold text-white tracking-tight text-center">
            {{ title || 'Szczegóły układu' }}
          </h3>
          <p class="text-slate-400 text-sm text-center mt-1">
            Wymiar:
            <span class="text-white font-mono">{{ totalWidth.toFixed(1) }}mm</span>
          </p>
        </div>

        <div class="p-5 overflow-y-auto max-h-[50vh]">
          <ul class="space-y-4">
            <li v-for="(item, index) in formattedItems" :key="index" class="flex items-start group">
              <span
                class="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-slate-400 text-[10px] font-bold flex items-center justify-center mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors"
                style="margin-right: 12px"
              >
                {{ index + 1 }}
              </span>
              <span class="text-slate-200 text-sm leading-relaxed font-medium">{{ item }}</span>
            </li>
            <li
              v-if="formattedItems.length === 0"
              class="text-slate-500 italic text-sm text-center py-4"
            >
              Brak elementów w układzie.
            </li>
          </ul>
        </div>

        <div class="p-4 bg-slate-900/30 border-t border-slate-700/50 text-center">
          <p class="text-slate-500 text-[10px] uppercase tracking-widest font-semibold">
            Kliknij poza, aby zamknąć
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LayoutItem } from '../../stores/calculatorStore'
import { getLayoutItemWidth } from '../../stores/calculatorStore'

const props = defineProps<{
  isOpen: boolean
  layout: LayoutItem[] | null
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const totalWidth = computed(() => {
  if (!props.layout) return 0
  return props.layout.reduce((sum, item) => sum + getLayoutItemWidth(item), 0)
})

const formattedItems = computed(() => {
  if (!props.layout) return []

  return props.layout.map((item) => {
    const width = getLayoutItemWidth(item)
    const widthStr = `${width.toFixed(1)}mm`

    switch (item.type) {
      case 'knife':
        return `Nóż ${widthStr}`
      case 'gum':
        const colorMap: Record<string, string> = {
          blue: 'niebieska',
          red: 'czerwona',
          yellow: 'żółta',
        }
        const colorStr = colorMap[item.color || 'blue'] || 'kolorowa'
        return `Guma ${colorStr} ${widthStr}`
      case 'spacer':
        return `Dystans ${widthStr}`
      case 'spacers':
        return `Dystans ${widthStr}`
      case 'gap':
        return `Szczelina ${widthStr}`
      default:
        return `${item.type} ${widthStr}`
    }
  })
})
</script>
