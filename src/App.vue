<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useCalculatorStore } from './stores/calculatorStore'
import { useToastStore } from './stores/toastStore'
import Toast from './components/Toast.vue'
import QRModal from './components/QRModal.vue'
import { panel1Schema } from './validation/panel1Schema'
import { z } from 'zod'
import type { LayoutItem, CutResult } from './stores/calculatorStore'

const store = useCalculatorStore()
const toastStore = useToastStore()
const currentPanel = ref(1)
const showQR = ref(false)
const appUrl = 'https://bartek111111-netizen.github.io/PLN/'

const getLayout = (layout: LayoutItem[] | null) => {
  if (!layout || !Array.isArray(layout)) return []

  let position = 0

  return layout.map(item => {
    const scaled: LayoutItem = {
      ...item,
      position
    }

    if (['knife', 'gum', 'gap', 'spacer'].includes(item.type)) {
      scaled.width = item.size || item.width || 0
      position += scaled.width
    } else if (item.type === 'spacers') {
      scaled.width = item.totalWidth || 0
      position += scaled.width
    }

    return scaled
  })
}

const getGumColor = (color?: string) => {
  const map: Record<string, string> = { blue: '#3b82f6', red: '#ef4444', yellow: '#eab308' }
  return map[color || 'blue'] || '#3b82f6'
}

const switchPanel = (panelNumber: number) => {
  currentPanel.value = panelNumber
}

const calculatePanel = (panelNumber: number) => {
  if (panelNumber === 1) {
    try {
      panel1Schema.parse(store.panels.panel1)
      
      store.calculate(1, store.panels.panel1)
      store.saveToStorage()
      toastStore.success('Obliczenia wykonane pomyślnie.', 2500)
    } catch (err) {
      if (err instanceof z.ZodError) {
        toastStore.error(err.issues[0].message)
      } else if (err instanceof Error) {
        toastStore.error(err.message)
      } else {
        toastStore.error('Wystąpił nieznany błąd.')
      }
    }
  } else {
    store.calculate(2, store.panels.panel2)
    store.saveToStorage()
  }
}

watch(() => store.panels.panel1.field2, () => {
  store.autoCalculateGap()
})

onMounted(() => {
  store.loadFromStorage()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-2xl sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <h1 class="text-4xl font-bold text-white">PLNoże</h1>
        <p class="text-blue-100 mt-2 text-lg">Kalkulator do noży.</p>
      </div>
    </header>

    
    <!-- Main Content -->
    <main class="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
      
      <!-- Panel Switcher -->
      <div class="flex gap-4 mb-12">
        <button 
          :class="[
            'px-8 py-4 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg',
            currentPanel === 1 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/50' 
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
          ]"
          @click="switchPanel(1)"
        >
          Oblicz 1 cięcie
        </button>
        <button 
          :class="[
            'px-8 py-4 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg',
            currentPanel === 2 
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-cyan-500/50' 
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
          ]"
          @click="switchPanel(2)"
        >
          Oblicz wszystkie cięcia
        </button>
      </div>

      <!-- Panel 1 -->
      <div v-if="currentPanel === 1" class="bg-gradient-to-br from-slate-800 to-slate-700 p-10 rounded-2xl shadow-2xl border border-slate-600">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-8">Oblicz 1 cięcie</h2>
           <form @submit.prevent class="space-y-3">
             <div>
               <label class="block text-slate-200 font-semibold mb-2 text-sm">Jaka szerokość cięcia</label>
               <input 
                 v-model="store.panels.panel1.field1"
                 type="number" 
                 step="0.1"
                 min="20"
                 max="1600"
                 class="w-[280px] inline-block px-3 py-1.5 bg-slate-900 border-2 border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  placeholder="Wpisz wartość (20-1600mm)..."
               >
             </div>
             <div>
               <label class="block text-slate-200 font-semibold mb-2 text-sm">Grubość materiału</label>
               <input
                 v-model="store.panels.panel1.field2"
                 type="number"
                 step="0.01"
                 min="0.5"
                 max="7"
               class="w-[280px] inline-block px-3 py-1.5 bg-slate-900 border-2 border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  placeholder="Wpisz wartość (0.5-7mm)..."
               >
             </div>
             <div>
               <label class="block text-slate-200 font-semibold mb-2 text-sm">Szczelina cięcia</label>
          <input
                  v-model="store.panels.panel1.field4"
                  @input="store.setGapOverridden(true)"
                  type="number"
                  step="0.1"
               class="w-[280px] inline-block px-3 py-1.5 bg-slate-900 border-2 border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  placeholder="Auto (10% grubości)..."
               >
             </div>
             <div>
               <label class="block text-slate-200 font-semibold mb-2 text-sm">Rozmiar noża</label>
               <select 
                  v-model="store.panels.panel1.field3"
                  class="w-[280px] inline-block px-3 py-1.5 bg-slate-900 border-2 border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
               >
                 <option value="">Wybierz rozmiar...</option>
                 <option value="9">9mm</option>
                 <option value="12">12mm</option>
                 <option value="20">20mm</option>
               </select>
             </div>
            <button
                type="button"
                @click="calculatePanel(1)"
                class="w-[350px] inline-block mt-4 px-6 py-3 !bg-gradient-to-r !from-green-400 !to-emerald-500 text-white font-bold text-base rounded-lg shadow-lg shadow-green-500/30 hover:!from-green-500 hover:!to-emerald-600 hover:shadow-green-500/50 transition-all duration-300 transform active:scale-95"
             >
               Oblicz
             </button>
           </form>
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 transform translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0"
          >
           <div v-if="store.showResult1" class="mt-4 p-5 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-xl">
               <div v-if="store.panel1Result && store.panel1Result.cut" class="mt-4 flex flex-col items-center justify-center w-full gap-6">
                 <!-- Cięcie (Cut) -->
                 <div class="w-full">
                   <p class="text-slate-200 font-semibold mb-2 text-sm">
                     Cięcie: <span class="text-blue-300">{{ store.panel1Result.cutWidth.toFixed(1) }}mm</span>
                   </p>
                   <div class="flex justify-center">
                     <svg
                       :viewBox="`0 0 ${store.panel1Result.cutWidth} 120`"
                       :style="{ width: `${store.panel1Result.cutWidth * 4}px`, height: '80px' }"
                       class="bg-slate-900 rounded-lg border border-slate-700"
                     >
                     <g v-for="(item, index) in getLayout(store.panel1Result.cut)" :key="'cut-'+index">
                   <rect v-if="item.type === 'knife'" :x="item.position!" y="20" :width="item.width!" height="80" fill="#808080" stroke="#ffffff" stroke-width="1"/>
                        <rect v-if="item.type === 'gum'" :x="item.position!" y="25" :width="item.width!" height="70" :fill="getGumColor(item.color)" stroke="#ffffff" stroke-width="1" opacity="0.8"/>
                        <text v-if="item.type === 'gum'" :x="item.position! + item.width! / 2" y="65" text-anchor="middle" fill="#ffffff" font-size="8">G{{ item.width!.toFixed(1) }}</text>
                        <rect v-if="item.type === 'spacer'" :x="item.position!" y="35" :width="item.width!" height="50" fill="#a0a0a0" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
                        <text v-if="item.type === 'spacer'" :x="item.position! + item.width! / 2" y="65" text-anchor="middle" fill="#ffffff" font-size="8">D{{ item.width!.toFixed(1) }}</text>
                        <rect v-if="item.type === 'spacers'" :x="item.position!" y="35" :width="item.width!" height="50" fill="#a0a0a0" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
                        <text v-if="item.type === 'spacers'" :x="item.position! + item.width! / 2" y="65" text-anchor="middle" fill="#ffffff" font-size="8">D{{ item.width!.toFixed(1) }}</text>
                      </g>
                      </svg>
                    </div>
                  </div>

                  <!-- Dystans cięcia (Spacing) -->
                 <div class="w-full">
                   <p class="text-slate-200 font-semibold mb-2 text-sm">
                     Dystans cięcia: <span class="text-cyan-300">{{ store.panel1Result.spacingWidth.toFixed(1) }}mm</span>
                   </p>
                   <div class="flex justify-center">
                     <svg
                       :viewBox="`0 0 ${store.panel1Result.spacingWidth} 120`"
                       :style="{ width: `${store.panel1Result.spacingWidth * 4}px`, height: '80px' }"
                       class="bg-slate-900 rounded-lg border border-slate-700"
                     >
                     <g v-for="(item, index) in getLayout(store.panel1Result.spacing)" :key="'spacing-'+index">
                    <rect v-if="item.type === 'spacer'" :x="item.position!" y="35" :width="item.width!" height="50" fill="#5a6a7a" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
                         <text v-if="item.type === 'spacer'" :x="item.position! + item.width! / 2" y="65" text-anchor="middle" fill="#ffffff" font-size="8">D{{ item.width!.toFixed(1) }}</text>
                       <rect v-if="item.type === 'gum'" :x="item.position!" y="25" :width="item.width!" height="70" :fill="getGumColor(item.color)" stroke="#ffffff" stroke-width="1" opacity="0.8"/>
                        <text v-if="item.type === 'gum'" :x="item.position! + item.width! / 2" y="65" text-anchor="middle" fill="#ffffff" font-size="8">G{{ item.width!.toFixed(1) }}</text>
                        <rect v-if="item.type === 'spacers'" :x="item.position!" y="35" :width="item.width!" height="50" fill="#a0a0a0" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
                       <text v-if="item.type === 'spacers'" :x="item.position! + item.width! / 2" y="65" text-anchor="middle" fill="#ffffff" font-size="8">D{{ item.width!.toFixed(1) }}</text>
                     </g>
                     </svg>
                   </div>
                 </div>
               </div>
               <!-- Text fallback -->
               <div v-else>
                 <p class="text-slate-100"><strong class="text-blue-300">Wynik:</strong> <span class="text-white font-mono text-lg">{{ store.panel1Result }}</span></p>
              </div>
              </div>
           </transition>
         </div>

      <!-- Panel 2 -->
      <div v-if="currentPanel === 2" class="bg-gradient-to-br from-slate-800 to-slate-700 p-10 rounded-2xl shadow-2xl border border-slate-600">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent mb-8">Oblicz wszystkie cięcia</h2>
          <form @submit.prevent class="space-y-6">
             <div>
              <label class="block text-slate-200 font-semibold mb-3">Pole 1</label>
                <input 
                   v-model="store.panels.panel2.field1"
                   type="text" 
                   class="w-[280px] inline-block px-5 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                   placeholder="Wpisz wartość..."
                 >
             </div>
             <div>
              <label class="block text-slate-200 font-semibold mb-3">Pole 2</label>
                <input 
                   v-model="store.panels.panel2.field2"
                   type="text" 
                   class="w-[280px] inline-block px-5 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                   placeholder="Wpisz wartość..."
                 >
             </div>
             <div>
             <label class="block text-slate-200 font-semibold mb-3">Pole 3</label>
                <input 
                   v-model="store.panels.panel2.field3"
                   type="text" 
                   class="w-[280px] inline-block px-5 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                   placeholder="Wpisz wartość..."
                 >
             </div>
           <button
                type="button"
                @click="calculatePanel(2)"
                class="w-[350px] inline-block mt-8 px-6 py-4 !bg-gradient-to-r !from-green-400 !to-emerald-500 text-white font-bold text-base rounded-xl shadow-lg shadow-green-500/30 hover:!from-green-500 hover:!to-emerald-600 hover:shadow-green-500/50 transition-all duration-300 transform active:scale-95"
             >
               Oblicz
             </button>
           </form>
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 transform translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0"
          >
            <div v-if="store.showResult2" class="mt-4 p-5 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl">
              <p class="text-slate-100"><strong class="text-cyan-300">Wynik:</strong> <span class="text-white font-mono text-lg">{{ store.panel2Result }}</span></p>
            </div>
           </transition>
         </div>

     </main>
  </div>

  <!-- Toast Container (poza głównym divem, żeby nie był obcięty) -->
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

  <!-- QR Button - fixed bottom-left -->
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
</template>

<style scoped>
/* Component-specific styles here */
</style>
