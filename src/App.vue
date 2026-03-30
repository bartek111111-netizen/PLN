<script setup>
import { ref, onMounted } from 'vue'
import calculator from './calculator.js'

const currentPanel = ref(1)
const panel1 = ref({ field1: '', field2: '', field3: '' })
const panel2 = ref({ field1: '', field2: '', field3: '' })
const panel1Result = ref(null)
const panel2Result = ref(null)
const showResult1 = ref(false)
const showResult2 = ref(false)

const switchPanel = (panelNumber) => {
  currentPanel.value = panelNumber
}

const getLayout = (layout, totalWidth) => {
  if (!layout || !Array.isArray(layout)) return []
  
  let position = 0
  
  return layout.map(item => {
    const scaled = {
      ...item,
      position
    }
    
    if (item.type === 'knife' || item.type === 'gum') {
      scaled.width = item.size || item.width
      position += scaled.width
    } else if (item.type === 'spacers') {
      scaled.width = item.totalWidth
      position += scaled.width
    }
    
    return scaled
  })
}

const calculatePanel = (panelNumber) => {
  if (panelNumber === 1) {
    // Validate panel 1
    if (!panel1.value.field1 || !panel1.value.field2) {
      alert('Wypełnij wszystkie pola!')
      return
    }
    const width = parseFloat(panel1.value.field1)
    const thickness = parseFloat(panel1.value.field2)
    if (isNaN(width) || isNaN(thickness)) {
      alert('Wpisz prawidłowe liczby!')
      return
    }
    if (width < 20 || width > 1600) {
      alert('Szerokość cięcia musi być między 20-1600mm!')
      return
    }
    if (thickness < 0.5 || thickness > 7) {
      alert('Grubość materiału musi być między 0.5-7mm!')
      return
    }
    if (!panel1.value.field3) {
      alert('Wybierz rozmiar noża!')
      return
    }
    calculator.setPanel1Values(panel1.value)
    try {
      const result = calculator.calculate(1, panel1.value)
      panel1Result.value = result || 'Brak wyniku'
      showResult1.value = true
      calculator.saveToStorage()
    } catch (error) {
      alert(error.message)
    }
  } else {
    calculator.setPanel2Values(panel2.value)
    const result = calculator.calculate(2, panel2.value)
    panel2Result.value = result || 'Brak wyniku'
    showResult2.value = true
    calculator.saveToStorage()
  }
}

onMounted(() => {
  calculator.loadFromStorage()
  const p1 = calculator.getPanel1Values()
  const p2 = calculator.getPanel2Values()
  if (Object.keys(p1).length > 0) panel1.value = p1
  if (Object.keys(p2).length > 0) panel2.value = p2
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
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 transform scale-95"
        enter-to-class="opacity-100 transform scale-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 transform scale-100"
        leave-to-class="opacity-0 transform scale-95"
      >
        <div v-if="currentPanel === 1" class="bg-gradient-to-br from-slate-800 to-slate-700 p-10 rounded-2xl shadow-2xl border border-slate-600">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-8">Oblicz 1 cięcie</h2>
          <form @submit.prevent class="space-y-3">
            <div>
              <label class="block text-slate-200 font-semibold mb-2 text-sm">Jaka szerokość cięcia</label>
              <input 
                v-model="panel1.field1"
                type="number" 
                step="0.1"
                min="20"
                max="1600"
                class="w-full px-3 py-1.5 bg-slate-900 border-2 border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                placeholder="Wpisz wartość (20-1600mm)..."
              >
            </div>
            <div>
              <label class="block text-slate-200 font-semibold mb-2 text-sm">Grubość materiału</label>
              <input 
                v-model="panel1.field2"
                type="number" 
                step="0.01"
                min="0.5"
                max="7"
                class="w-full px-3 py-1.5 bg-slate-900 border-2 border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                placeholder="Wpisz wartość (0.5-7mm)..."
              >
            </div>
            <div>
              <label class="block text-slate-200 font-semibold mb-2 text-sm">Rozmiar noża</label>
              <select 
                v-model="panel1.field3"
                class="w-full px-3 py-1.5 bg-slate-900 border-2 border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
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
              class="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:shadow-lg hover:shadow-green-500/50 active:scale-95"
            >
              Oblicz
            </button>
          </form>
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 transform translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0"
          >
            <div v-if="showResult1" class="mt-8 p-6 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-xl border border-blue-600/50">
              <!-- Visualization -->
              <div v-if="Array.isArray(panel1Result)" class="mt-4 flex flex-col items-center justify-center w-full">
                <p class="text-slate-200 font-semibold mb-4 text-sm">Wizualizacja złożenia:</p>
                <div class="flex justify-center">
                  <svg :viewBox="`0 0 ${panel1.field1} 150`" :style="{ width: `${panel1.field1 * 4.5}px`, height: '100px' }" class="bg-slate-900 rounded-lg border border-slate-700">
                  <g v-for="(item, index) in getLayout(panel1Result, panel1.field1)" :key="index">
                    <!-- Knives (gray) -->
                    <rect v-if="item.type === 'knife'" 
                      :x="item.position" 
                      y="30" 
                      :width="item.width" 
                      height="90" 
                      fill="#808080" 
                      stroke="#ffffff" 
                      stroke-width="1"/>
                    
                    <!-- Gums (colored) -->
                    <rect v-if="item.type === 'gum'" 
                      :x="item.position" 
                      y="35" 
                      :width="item.width" 
                      height="80" 
                      :fill="item.color === 'blue' ? '#3b82f6' : item.color" 
                      stroke="#ffffff" 
                      stroke-width="1"
                      opacity="0.8"/>
                    
                    <!-- Spacers -->
                    <rect v-if="item.type === 'spacers'" 
                      :x="item.position" 
                      y="48" 
                      :width="item.width" 
                      height="54" 
                      fill="#a0a0a0" 
                      stroke="#ffffff" 
                      stroke-width="1"
                      opacity="0.7"/>
                    <text v-if="item.type === 'spacers'" 
                      :x="item.position + item.width/2" 
                      y="80" 
                      text-anchor="middle" 
                      fill="#ffffff" 
                      font-size="8">
                      D{{ item.width.toFixed(1) }}
                    </text>
                  </g>
                  <!-- Total width line -->
                  <line x1="0" y1="15" :x2="panel1.field1 * 2" y2="15" stroke="#10b981" stroke-width="2" stroke-dasharray="5,5"/>
                  <text x="0" y="12" fill="#10b981" font-size="10" font-weight="bold">
                    {{ panel1.field1 }}mm
                  </text>
                </svg>
                </div>
              </div>
              <!-- Text fallback -->
              <div v-else>
                <p class="text-slate-100"><strong class="text-blue-300">Wynik:</strong> <span class="text-white font-mono text-lg">{{ panel1Result }}</span></p>
              </div>
            </div>
          </transition>
        </div>
      </transition>

      <!-- Panel 2 -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 transform scale-95"
        enter-to-class="opacity-100 transform scale-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 transform scale-100"
        leave-to-class="opacity-0 transform scale-95"
      >
        <div v-if="currentPanel === 2" class="bg-gradient-to-br from-slate-800 to-slate-700 p-10 rounded-2xl shadow-2xl border border-slate-600">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent mb-8">Oblicz wszystkie cięcia</h2>
          <form @submit.prevent class="space-y-6">
            <div>
              <label class="block text-slate-200 font-semibold mb-3">Pole 1</label>
              <input 
                v-model="panel2.field1"
                type="text" 
                class="w-full px-5 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                placeholder="Wpisz wartość..."
              >
            </div>
            <div>
              <label class="block text-slate-200 font-semibold mb-3">Pole 2</label>
              <input 
                v-model="panel2.field2"
                type="text" 
                class="w-full px-5 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                placeholder="Wpisz wartość..."
              >
            </div>
            <div>
              <label class="block text-slate-200 font-semibold mb-3">Pole 3</label>
              <input 
                v-model="panel2.field3"
                type="text" 
                class="w-full px-5 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                placeholder="Wpisz wartość..."
              >
            </div>
            <button 
              type="button"
              @click="calculatePanel(2)"
              class="w-full mt-8 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:shadow-lg hover:shadow-green-500/50 active:scale-95"
            >
              Oblicz
            </button>
          </form>
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 transform translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0"
          >
            <div v-if="showResult2" class="mt-8 p-6 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl border border-cyan-600/50">
              <p class="text-slate-100"><strong class="text-cyan-300">Wynik:</strong> <span class="text-white font-mono text-lg">{{ panel2Result }}</span></p>
            </div>
          </transition>
        </div>
      </transition>

    </main>
  </div>
</template>

<style scoped>
/* Component-specific styles here */
</style>
