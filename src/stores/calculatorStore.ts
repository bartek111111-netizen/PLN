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

export interface ModalState {
  isOpen: boolean
  layout: LayoutItem[] | null
  title: string
}

const MIN_SPACER = 1.5

function getSpacerBounds(n: number): { min: number; max: number } {
  return {
    min: n <= 2 ? 1.5 : 5,
    max: n * 14
  }
}

function buildMiddle(remaining: number, gumColor: string, edgeSpacers: boolean = true): LayoutItem[] {
  if (remaining <= 0) return []

  const slotsFor = (n: number) => edgeSpacers ? n + 1 : n - 1

  let bestGums = 0
  const startN = edgeSpacers ? 1 : 2
  for (let n = startN; n <= 12; n++) {
    const totalGumWidth = n * 20
    const numSlots = slotsFor(n)
    const spacerSpace = remaining - totalGumWidth
    if (spacerSpace <= 0) continue

    const eachSpacer = spacerSpace / numSlots
    const { min, max } = getSpacerBounds(n)

    if (eachSpacer >= min && eachSpacer <= max) {
      bestGums = n
      break
    }
    if (eachSpacer < min && n - 1 >= startN) {
      bestGums = n - 1
      break
    }
  }

  if (bestGums === 0) {
    for (let n = 12; n >= startN; n--) {
      const totalGumWidth = n * 20
      const numSlots = slotsFor(n)
      if (totalGumWidth + numSlots * MIN_SPACER <= remaining) {
        bestGums = n
        break
      }
    }
  }

  if (bestGums === 0) {
    return [{ type: 'spacers', totalWidth: remaining }]
  }

  const numSlots = slotsFor(bestGums)
  const spacerSpace = remaining - bestGums * 20
  const eachSpacer = spacerSpace / numSlots

  const layout: LayoutItem[] = []
  let roundedSum = 0
  const spacerCount = edgeSpacers ? numSlots : numSlots

  if (edgeSpacers) {
    for (let i = 0; i < numSlots; i++) {
      const rounded = Math.round(eachSpacer * 10) / 10
      const finalVal = i === numSlots - 1 ? Math.round((spacerSpace - roundedSum) * 10) / 10 : rounded
      roundedSum += finalVal
      layout.push({ type: 'spacers', totalWidth: finalVal })
      if (i < bestGums) {
        layout.push({ type: 'gum', size: 20, color: gumColor })
      }
    }
  } else {
    layout.push({ type: 'gum', size: 20, color: gumColor })
    for (let i = 0; i < numSlots; i++) {
      const rounded = Math.round(eachSpacer * 10) / 10
      const finalVal = i === numSlots - 1 ? Math.round((spacerSpace - roundedSum) * 10) / 10 : rounded
      roundedSum += finalVal
      layout.push({ type: 'spacers', totalWidth: finalVal })
      if (i < numSlots) {
        layout.push({ type: 'gum', size: 20, color: gumColor })
      }
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
    modal: {
      isOpen: false,
      layout: null as LayoutItem[] | null,
      title: ''
    } as ModalState
  }),

  actions: {
    setPanel1Values(values: PanelState) {
      this.panels.panel1 = { ...values };
    },
    autoCalculateGap() {
      this.gapOverridden = false;
      const thickness = parseFloat(String(this.panels.panel1.field2).replace(',', '.'));
      if (Number.isFinite(thickness) && thickness > 0) {
        const gap = Math.round(thickness * 0.1 * 10) / 10;
        this.panels.panel1.field4 = gap.toFixed(1);
      }
    },
    setGapOverridden(overridden: boolean) {
      this.gapOverridden = overridden;
    },
    setPanel2Values(values: PanelState) {
      this.panels.panel2 = { ...values };
    },

    openModal(layout: LayoutItem[] | null, title: string) {
      this.modal.isOpen = true;
      this.modal.layout = layout;
      this.modal.title = title;
    },
    closeModal() {
      this.modal.isOpen = false;
      this.modal.layout = null;
      this.modal.title = '';
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

      const cutWidth = width - gap;

      if (cutWidth < knifeSize * 2) {
        throw new Error(`Szerokość cięcia (${width}mm) za mała dla dwóch noży (${knifeSize}mm) i szczeliny (${gap}mm). Cięcie (${cutWidth.toFixed(1)}mm) musi mieścić 2 noże. Wymagane minimum: ${(knifeSize * 2 + gap).toFixed(1)}mm.`);
      }

      const spacingGumColor = thickness >= 4 ? 'yellow' : 'red';

      const cutMiddle = buildMiddle(cutWidth - knifeSize * 2, 'blue', false);
      const spacingMiddle = buildMiddle(width - knifeSize * 2, spacingGumColor, false);

      const cut: LayoutItem[] = [
        { type: 'knife', size: knifeSize, color: 'gray' },
        ...cutMiddle,
        { type: 'knife', size: knifeSize, color: 'gray' }
      ];

      const hasGumsInCut = cutMiddle.some(item => item.type === 'gum');

      let spacing: LayoutItem[];
      if (!hasGumsInCut && width >= 20) {
        const gumSize = 20;
        const rem = width - gumSize;
        const target = rem / 2;
        
        let s1 = this.spacers[0];
        let minDiff = Math.abs(target - s1);
        for (const s of this.spacers) {
          const diff = Math.abs(target - s);
          if (diff < minDiff) {
            minDiff = diff;
            s1 = s;
          }
        }
        
        if (s1 > rem) {
          s1 = this.spacers.filter(s => s <= rem).sort((a, b) => b - a)[0] || 0;
        }
        
        const s2 = rem - s1;
        spacing = [];
        if (s1 > 0) spacing.push({ type: 'spacers', totalWidth: s1 });
        spacing.push({ type: 'gum', size: gumSize, color: spacingGumColor });
        if (s2 > 0) spacing.push({ type: 'spacers', totalWidth: s2 });
      } else {
        spacing = [
          { type: 'spacer', size: knifeSize, color: 'gray' },
          ...spacingMiddle,
          { type: 'spacer', size: knifeSize, color: 'gray' }
        ];
      }

      const sumWidth = (layout: LayoutItem[]) =>
        layout.reduce((s, i) => s + (i.size || i.totalWidth || 0), 0);

      return {
        cut,
        spacing,
        cutWidth: sumWidth(cut),
        spacingWidth: sumWidth(spacing)
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
