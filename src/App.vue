<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <Header />

    <main class="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
      <PanelSwitcher :current-panel="currentPanel" @switch="switchPanel" />

      <!-- Panel 1 -->
      <div v-if="currentPanel === 1" class="bg-gradient-to-br from-slate-800 to-slate-700 p-10 rounded-2xl shadow-2xl border border-slate-600">
        <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-8">Oblicz 1 cięcie</h2>
        <SingleCutForm />
        <ResultSection :panel1-result="store.panel1Result" :panel2-result="store.panel2Result" />
      </div>

      <!-- Panel 2 -->
      <div v-if="currentPanel === 2" class="bg-gradient-to-br from-slate-800 to-slate-700 p-10 rounded-2xl shadow-2xl border border-slate-600">
        <h2 class="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent mb-8">Oblicz wszystkie cięcia</h2>
        <MultiCutForm />
        <ResultSection :panel1-result="store.panel1Result" :panel2-result="store.panel2Result" />
      </div>
    </main>

    <!-- Toast Container -->
    <div style="position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 9999; display: flex; flex-direction: column; gap: 8px; width: 320px;">
      <Toast
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :createdAt="toast.createdAt"
        :duration="toast.duration"
      />
    </div>

    <!-- QR Button -->
    <button
      @click="showQR = true"
      class="fixed bottom-[50px] left-[50px] z-[200] p-3 rounded-xl bg-slate-700/80 hover:bg-slate-600/90 transition text-white shadow-lg backdrop-blur-sm"
      title="Kod QR"
    >
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="15" y="15" width="2" height="2"/>
        <rect x="19" y="15" width="2" height="2"/>
        <rect x="15" y="19" width="2" height="2"/>
        <rect x="19" y="19" width="2" height="2"/>
      </svg>
    </button>

    <QRModal v-if="showQR" :url="appUrl" @close="showQR = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useCalculatorStore } from './stores/calculatorStore'
import { useToastStore } from './stores/toastStore'
import Header from './components/layout/Header.vue'
import PanelSwitcher from './components/layout/PanelSwitcher.vue'
import SingleCutForm from './components/forms/SingleCutForm.vue'
import MultiCutForm from './components/forms/MultiCutForm.vue'
import ResultSection from './components/visualizer/ResultSection.vue'
import Toast from './components/Toast.vue'
import QRModal from './components/QRModal.vue'

const store = useCalculatorStore()
const toastStore = useToastStore()

const currentPanel = ref(1)
const showQR = ref(false)
const appUrl = 'https://bartek111111-netizen.github.io/PLN/'

const switchPanel = (panelNumber: number) => {
  currentPanel.value = panelNumber
}

watch(() => store.panels.panel1.field2, () => {
  store.autoCalculateGap()
})

onMounted(() => {
  store.loadFromStorage()
})
</script>
