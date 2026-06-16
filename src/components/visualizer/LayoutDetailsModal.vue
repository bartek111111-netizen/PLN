<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex justify-center items-start bg-black/60 p-4 pt-[20vh]"
    @click.self="$emit('close')"
  >
    <div class="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
      <div class="p-4 border-b border-slate-700">
        <h3 class="text-lg font-semibold text-white">{{ title || 'Szczegóły układu' }}</h3>
      </div>
      
      <div class="p-4 overflow-y-auto flex-1">
        <ul class="space-y-2">
          <li v-for="(item, index) in formattedItems" :key="index" class="text-slate-200 text-sm flex items-start gap-2">
            <span class="text-slate-500 font-mono">{{ index + 1 }})</span>
            <span class="break-words">{{ item }}</span>
          </li>
          <li v-if="formattedItems.length === 0" class="text-slate-500 italic text-sm">
            Brak elementów w układzie.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LayoutItem } from '../../stores/calculatorStore'

const props = defineProps<{
  isOpen: boolean
  layout: LayoutItem[] | null
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const formattedItems = computed(() => {
  if (!props.layout) return []
  
  return props.layout.map(item => {
    const width = item.size || item.totalWidth || 0
    const widthStr = `${width.toFixed(1)}mm`
    
    switch (item.type) {
      case 'knife':
        return `Nóż ${widthStr}`
      case 'gum':
        const colorMap: Record<string, string> = { blue: 'niebieska', red: 'czerwona', yellow: 'żółta' }
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

