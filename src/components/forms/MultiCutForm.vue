<template>
  <form @submit.prevent class="space-y-6">
    <div>
      <label class="block text-slate-200 font-semibold mb-3">Pole 1</label>
      <input 
        v-model="store.panels.panel2.field1"
        type="text" 
        class="w-full max-w-[280px] px-5 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
        placeholder="Wpisz wartość..."
      >
    </div>
    <div>
      <label class="block text-slate-200 font-semibold mb-3">Pole 2</label>
      <input 
        v-model="store.panels.panel2.field2"
        type="text" 
        class="w-full max-w-[280px] px-5 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
        placeholder="Wpisz wartość..."
      >
    </div>
    <div>
      <label class="block text-slate-200 font-semibold mb-3">Pole 3</label>
      <input 
        v-model="store.panels.panel2.field3"
        type="text" 
        class="w-full max-w-[280px] px-5 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
        placeholder="Wpisz wartość..."
      >
    </div>
    <button
      type="button"
      @click="calculate"
      class="w-full max-w-[350px] mt-12 px-6 py-4 !bg-gradient-to-r !from-green-400 !to-emerald-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-green-500/30 hover:!from-green-500 hover:!to-emerald-600 hover:shadow-green-500/50 transition-all duration-300 transform active:scale-95"
    >
      Oblicz
    </button>
  </form>
</template>

<script setup lang="ts">
import { useCalculatorStore } from '../../stores/calculatorStore'

const store = useCalculatorStore()

const calculate = () => {
  store.calculate(2, store.panels.panel2)
  store.saveToStorage()
}
</script>

