<template>
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
      @click="calculate"
      class="w-[350px] inline-block mt-4 px-6 py-3 !bg-gradient-to-r !from-green-400 !to-emerald-500 text-white font-bold text-base rounded-lg shadow-lg shadow-green-500/30 hover:!from-green-500 hover:!to-emerald-600 hover:shadow-green-500/50 transition-all duration-300 transform active:scale-95"
    >
      Oblicz
    </button>
  </form>
</template>

<script setup lang="ts">
import { useCalculatorStore } from '../../stores/calculatorStore'
import { useToastStore } from '../../stores/toastStore'
import { panel1Schema } from '../../validation/panel1Schema'
import { z } from 'zod'

const store = useCalculatorStore()
const toastStore = useToastStore()

const calculate = () => {
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
}
</script>
