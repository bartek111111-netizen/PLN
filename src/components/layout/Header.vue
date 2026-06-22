<template>
  <header class="header-bg">
    <div class="header-container">
      <h1 class="header-title">{{ APP_TITLE }}</h1>
      <p class="header-subtitle">{{ APP_SUBTITLE }}</p>
    </div>
  </header>
</template>

<script setup lang="ts">
import { APP_TITLE, APP_SUBTITLE } from '../../constants'
</script>