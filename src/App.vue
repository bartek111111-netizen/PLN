<template>
  <div class="app-bg">
    <Header />

    <!-- Sticky Panel Switcher — sticky na nadrzędnym div -->
    <div class="panel-switcher-wrapper">
      <div class="panel-switcher-container">
        <PanelSwitcher :current-panel="currentPanel" @switch="switchPanel" />
      </div>
    </div>

    <main class="main-container">

      <!-- Panel 1 -->
      <div
        v-if="currentPanel === 1"
        class="panel-card"
      >
        <h2
          class="panel-title"
        >
          Oblicz 1 cięcie
        </h2>
        <div class="flex justify-center">
          <SingleCutForm />
        </div>
        <ResultSection :panel1-result="store.panel1Result" :panel2-result="null" />
      </div>

      <!-- Panel 2 -->
      <!-- Panel 2 - obliczenia wielokrotnych cięć (w planach) -->
      <div
        v-if="currentPanel === 2"
        class="panel-card"
      >
        <h2
          class="panel-title-alt"
        >
          Oblicz wszystkie cięcia
        </h2>
        <div class="flex justify-center">
          <MultiCutForm />
        </div>
        <ResultSection :panel1-result="store.panel1Result" :panel2-result="null" />
      </div>
    </main>

    <!-- Toast Container -->
    <div class="qr-container">
      <Toast
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :created-at="toast.createdAt"
        :duration="toast.duration"
      />
    </div>

    <!-- QR Button -->
    <button
      class="qr-button"
      title="Kod QR"
      @click="showQR = true"
    >
      <span class="qr-button-text">QR</span>
    </button>

    <QRModal v-if="showQR" :url="appUrl" @close="showQR = false" />

    <!-- Global Modal for Layout Details -->
    <LayoutDetailsModal
      :is-open="store.modal.isOpen"
      :layout="store.modal.layout"
      :title="store.modal.title"
      @close="store.closeModal()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCalculatorStore } from './stores/calculatorStore'
import { useToastStore } from './stores/toastStore'
import Header from './components/layout/Header.vue'
import PanelSwitcher from './components/layout/PanelSwitcher.vue'
import SingleCutForm from './components/forms/SingleCutForm.vue'
import MultiCutForm from './components/forms/MultiCutForm.vue'
import ResultSection from './components/visualizer/ResultSection.vue'
import Toast from './components/Toast.vue'
import QRModal from './components/QRModal.vue'
import LayoutDetailsModal from './components/visualizer/LayoutDetailsModal.vue'

const store = useCalculatorStore()
const toastStore = useToastStore()

const currentPanel = ref(1)
const showQR = ref(false)
const appUrl = 'https://bartek111111-netizen.github.io/PLN/'

const switchPanel = (panelNumber: number) => {
  currentPanel.value = panelNumber
}

onMounted(() => {
  store.loadFromStorage()
})
</script>
