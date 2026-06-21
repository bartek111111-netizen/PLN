<template>
  <header class="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-2xl z-50 relative">
    <div class="max-w-6xl mx-auto px-6 py-8 text-center">
      <h1 class="text-4xl font-bold text-white">{{ APP_TITLE }}</h1>
      <p class="text-blue-100 mt-2 text-lg">{{ APP_SUBTITLE }}</p>
    </div>
  </header>
</template>

<script setup lang="ts">
import { APP_TITLE, APP_SUBTITLE } from '../../constants'
</script>
