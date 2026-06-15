import { defineStore } from 'pinia'

interface PanelState {
  field1: string
  field2: string
  field3: string
  field4: string
}

export interface LayoutItem {
  type: 'knife' | 'gum' | 'spacers' | 'gap' | 'spacer'
  size?: number
  totalWidth?: number
  color?: string
  width?: number
  position?: number
}

export interface CutResult {
  cut: LayoutItem[]
  spacing: LayoutItem[]
  cutWidth: number
  spacingWidth: number
}

const MIN_SPACER = 1.5

function getSpacerBounds(n: number): { min: number; max: number } {
  return {
    min: n <= 2 ? 1.5 : 5,
    max: n * 14
  }
}

function buildMiddle(remaining: number, gumColor: string): LayoutItem[] {
  if (remaining <= 0) return []

  if (remaining < 20) {
    return [{ type: 'spacers', totalWidth: remaining }]
  }

  if (remaining >= 20 && remaining < 20 + 1.5 + 20) {
    const spacerEach = (remaining - 20) / 2
    return [
      { type: 'spacers', totalWidth: spacerEach },
      { type: 'gum', size: 20, color: gumColor },
      { type: 'spacers', totalWidth: spacerEach }
    ]
  }

  let bestGums = -1
  for (let n = 2; n <= 12; n++) {
    const totalGumWidth = n * 20
    const spacerSpace = remaining - totalGumWidth
    if (spacerSpace <= 0) break

    const numSlots = n - 1
    const eachSpacer = spacerSpace / numSlots
    const { min, max } = getSpacerBounds(n)

    if (eachSpacer >= min && eachSpacer <= max) {
      bestGums = n
      break
    }
    if (eachSpacer < min) {
      bestGums = n - 1
      break
    }
  }

  if (bestGums < 2) {
    bestGums = 0
    for (let n = 2; n <= 15; n++) {
      const totalGumWidth = n * 20
      if (totalGumWidth + (n - 1) * MIN_SPACER > remaining) break
      bestGums = n
    }
  }

  const totalGumWidth = bestGums * 20
  const spacerSpace = remaining - totalGumWidth
  const numSlots = bestGums - 1
  const eachSpacer = spacerSpace / numSlots

  const layout: LayoutItem[] = []
  for (let i = 0; i < bestGums; i++) {
    layout.push({ type: 'gum', size: 20, color: gumColor })
    if (i < bestGums - 1) {
      layout.push({ type: 'spacers', totalWidth: eachSpacer })
    }
  }

  return layout
}

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    panels: {
      panel1: { field1: '', field2: '', field3: '', field4: '' } as PanelState,
      panel2: { field1: '', field2: '', field3: '' } as PanelState
    },
    gapOverridden: false,
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
    panel1Result: null as CutResult | null,
    panel2Result: null,
    showResult1: false,
    showResult2: false,
    lastWidth1: null as number | null,
  }),

  actions: {
    setPanel1Values(values: PanelState) {
      this.panels.panel1 = { ...values };
    },
    autoCalculateGap() {
      if (this.gapOverridden) return;
      const thickness = parseFloat(this.panels.panel1.field2);
      if (Number.isFinite(thickness) && thickness > 0) {
        this.panels.panel1.field4 = (Math.round(thickness * 0.1 * 10) / 10).toFixed(1);
      }
    },
    setGapOverridden(overridden: boolean) {
      this.gapOverridden = overridden;
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

    calculatePanel1(values: PanelState): CutResult {
      const width = parseFloat(values.field1);
      const thickness = parseFloat(values.field2);
      const knifeSize = parseFloat(values.field3);
      const gap = parseFloat(values.field4);
      this.lastWidth1 = width;

      // Validate gap range
      const minGap = Math.round(thickness * 0.05 * 10) / 10;
      const maxGap = Math.round(thickness * 0.8 * 10) / 10;
      if (gap < minGap) {
        throw new Error(`Szczelina cięcia (${gap}mm) nie może być mniejsza niż 5% grubości materiału (${minGap}mm).`);
      }
      if (gap > maxGap) {
        throw new Error(`Szczelina cięcia (${gap}mm) nie może być większa niż 80% grubości materiału (${maxGap}mm).`);
      }

      // Cut width = full width minus gap
      const cutWidth = width - gap;

      if (cutWidth < knifeSize * 2) {
        throw new Error(`Szerokość cięcia (${width}mm) za mała dla dwóch noży (${knifeSize}mm) i szczeliny (${gap}mm). Cięcie (${cutWidth.toFixed(1)}mm) musi mieścić 2 noże. Wymagane minimum: ${(knifeSize * 2 + gap).toFixed(1)}mm.`);
      }

      // Gum color for spacing: yellow if thickness >= 4, else red
      const spacingGumColor = thickness >= 4 ? 'yellow' : 'red';

      // Build middle sections
      const cutMiddle = buildMiddle(cutWidth - knifeSize * 2, 'blue');
      const spacingMiddle = buildMiddle(width - knifeSize * 2 - gap * 2, spacingGumColor);

      const cut: LayoutItem[] = [
        { type: 'knife', size: knifeSize, color: 'gray' },
        ...cutMiddle,
        { type: 'knife', size: knifeSize, color: 'gray' }
      ];

      const spacing: LayoutItem[] = [
        { type: 'spacer', size: knifeSize, color: 'gray' },
        { type: 'gap', size: gap, color: 'gap' },
        ...spacingMiddle,
        { type: 'gap', size: gap, color: 'gap' },
        { type: 'spacer', size: knifeSize, color: 'gray' }
      ];

      return {
        cut,
        spacing,
        cutWidth,
        spacingWidth: width
      };
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
