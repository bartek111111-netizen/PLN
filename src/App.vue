<template>
  <div
    class="w-full min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
  >
    <Header />

    <!-- Sticky Panel Switcher — sticky na nadrzędnym div -->
    <div
      class="sticky top-0 z-[100] flex justify-center px-4 sm:px-6 -mb-8 sm:-mb-12"
    >
      <div
        class="rounded-2xl border border-slate-600 shadow-2xl bg-slate-900/95 backdrop-blur-sm px-4 py-4"
      >
        <PanelSwitcher :current-panel="currentPanel" @switch="switchPanel" />
      </div>
    </div>

    <main class="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 sm:pt-12">

      <!-- Panel 1 -->
      <div
        v-if="currentPanel === 1"
        class="bg-gradient-to-br from-slate-800 to-slate-700 p-6 sm:p-10 rounded-2xl shadow-2xl border border-slate-600"
      >
        <h2
          class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-6 sm:mb-8 text-center"
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
        class="bg-gradient-to-br from-slate-800 to-slate-700 p-6 sm:p-10 rounded-2xl shadow-2xl border border-slate-600"
      >
        <h2
          class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent mb-6 sm:mb-8 text-center"
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
    <div
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[320px] max-w-[calc(100vw-2rem)]"
    >
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
      class="fixed bottom-[70px] right-6 z-[200] w-14 h-14 rounded-full bg-slate-700/80 hover:bg-slate-600/90 transition text-white shadow-lg backdrop-blur-sm flex items-center justify-center"
      title="Kod QR"
      @click="showQR = true"
    >
      <span class="text-xs font-bold leading-tight">QR</span>
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
