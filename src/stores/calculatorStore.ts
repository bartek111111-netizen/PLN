import { defineStore } from 'pinia'

interface PanelState {
  field1: string
  field2: string
  field3: string
}

export interface LayoutItem {
  type: 'knife' | 'gum' | 'spacers'
  size?: number
  totalWidth?: number
  color?: string
  width?: number
  position?: number
}

export interface ScaledLayoutItem extends LayoutItem {
  width: number
  position: number
}

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    panels: {
      panel1: { field1: '', field2: '', field3: '' } as PanelState,
      panel2: { field1: '', field2: '', field3: '' } as PanelState
    },
    spacers: [
      1.5, 1.8, 2, 2.05, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 
      2.7, 2.8, 2.9, 3, 4, 5, 6, 7, 8, 9, 
      9.15, 9.2, 9.25, 9.3, 9.35, 9.4, 9.45, 9.5, 10, 15, 
      20, 30, 40, 50
    ],
    gums: [
      { size: 20, color: 'blue' },
      { size: 20, color: 'red' },
      { size: 20, color: 'yellow' }
    ],
    knives: [9, 12, 20],
    panel1Result: null as LayoutItem[] | null,
    panel2Result: null,
    showResult1: false,
    showResult2: false,
    lastWidth1: null as number | null,
  }),
  
  actions: {
    setPanel1Values(values: PanelState) {
      this.panels.panel1 = { ...values };
    },
    setPanel2Values(values: PanelState) {
      this.panels.panel2 = { ...values };
    },
    
    calculate(panelNumber: number, values: PanelState) {
      if (panelNumber === 1) {
        const result = this.calculatePanel1(values);
        this.panel1Result = result;
        this.showResult1 = true;
        return result;
      } else if (panelNumber === 2) {
        const result = this.calculatePanel2(values);
        this.panel2Result = result;
        this.showResult2 = true;
        return result;
      }
    },

    calculatePanel1(values: PanelState): LayoutItem[] {
      const width = parseFloat(values.field1);
      const _thickness = parseFloat(values.field2);
      void _thickness;
      const knifeSize = parseFloat(values.field3);
      this.lastWidth1 = width;
      
      if (width < knifeSize * 2) {
        throw new Error(`Szerokość cięcia (${width}mm) musi być co najmniej 2x rozmiar noża (${knifeSize}mm). Podaj większą liczbę dla szerokości cięcia albo wybierz mniejszy rozmiar noża.`);
      }
      
      const layout: LayoutItem[] = [];
      layout.push({ type: 'knife', size: knifeSize, color: 'gray' });
      
      let remainingWidth = width - (knifeSize * 2);
      
      if (remainingWidth > 20) {
        layout.push({ type: 'gum', size: 20, color: 'blue' });
        remainingWidth -= 20;
      }
      
      if (remainingWidth > 0) {
        layout.push({ type: 'spacers', totalWidth: remainingWidth });
      }
      
      if (width - (knifeSize * 2) > 20) {
        layout.push({ type: 'gum', size: 20, color: 'blue' });
      }
      
      layout.push({ type: 'knife', size: knifeSize, color: 'gray' });
      
      return layout;
    },

    calculatePanel2(_values: PanelState) {
      return null;
    },

    saveToStorage() {
      localStorage.setItem('slittingCalc', JSON.stringify(this.panels));
    },

    loadFromStorage() {
      const saved = localStorage.getItem('slittingCalc');
      if (saved) {
        const data = JSON.parse(saved);
        this.panels = data;
      }
    }
  }
})
