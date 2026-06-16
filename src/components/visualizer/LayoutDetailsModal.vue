<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md flex justify-center items-start p-4 pt-[20vh]"
    @click="$emit('close')"
  >
    <div 
      class="w-[350px] bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      @click.stop
    >
      <div class="p-5 border-b border-slate-700/50 bg-slate-800/50">
        <h3 class="text-lg font-bold text-white tracking-tight">{{ title || 'Szczegóły układu' }}</h3>
      </div>
      
      <div class="p-5 overflow-y-auto flex-1">
        <ul class="space-y-4">
          <li v-for="(item, index) in formattedItems" :key="index" class="flex items-start gap-3 group">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-slate-400 text-[10px] font-bold flex items-center justify-center mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {{ index + 1 }}
            </span>
            <span class="text-slate-200 text-sm leading-relaxed font-medium">{{ item }}</span>
          </li>
          <li v-if="formattedItems.length === 0" class="text-slate-500 italic text-sm text-center py-4">
            Brak elementów w układzie.
          </li>
        </ul>
      </div>

      <div class="p-4 bg-slate-900/30 border-t border-slate-700/50 text-center">
        <p class="text-slate-500 text-[10px] uppercase tracking-widest font-semibold">Kliknij poza, aby zamknąć</p>
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
