<template>
  <div class="flex flex-wrap justify-center gap-4 py-4 rounded-2xl px-4">
    <button
      :class="[
        'panel-switcher-btn-base',
        currentPanel === 1 ? 'panel-switcher-btn-active-blue' : 'panel-switcher-btn-inactive',
      ]"
      @click="switchPanel(1)"
    >
      Oblicz 1 cięcie
    </button>
    <button
      :class="[
        'panel-switcher-btn-base',
        currentPanel === 2 ? 'panel-switcher-btn-active-cyan' : 'panel-switcher-btn-inactive',
      ]"
      @click="switchPanel(2)"
    >
      Oblicz wszystkie cięcia
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPanel: number
}>()

const emit = defineEmits<{
  (e: 'switch', panel: number): void
}>()

const switchPanel = (panel: number) => {
  emit('switch', panel)
}
</script>
