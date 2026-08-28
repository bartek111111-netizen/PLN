<template>
  <Teleport to="body">
    <div v-if="isOpen" @click="$emit('close')">
      <!-- Black background layer -->
      <div class="modal-backdrop" />

      <!-- Modal content -->
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            {{ title || 'Szczegóły układu' }}
          </h3>
          <p class="modal-subtitle">
            Wymiar:
            <span class="modal-subtitle-value">{{ totalWidth.toFixed(1) }}mm</span>
          </p>
        </div>

        <div class="modal-body">
          <ul class="modal-list">
            <li v-for="(item, index) in formattedItems" :key="index" class="modal-list-item">
              <span class="modal-list-item-badge" style="margin-right: 12px">
                {{ index + 1 }}
              </span>
              <span class="modal-list-item-text">{{ item }}</span>
            </li>
            <li v-if="formattedItems.length === 0" class="modal-empty-text">
              Brak elementów w układzie.
            </li>
          </ul>
        </div>

        <div class="modal-footer">
          <p class="modal-footer-text">Kliknij poza, aby zamknąć</p>
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
  if (!props.layout || props.layout.length === 0) return []

  return props.layout.map((item: LayoutItem) => {
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
