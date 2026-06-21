import { defineStore } from 'pinia'
import { ref, reactive, watch, onScopeDispose } from 'vue'
import {
  GAP_THRESHOLD_6_1,
  GAP_THRESHOLD_5_1,
  GAP_THRESHOLD_4_1,
  GAP_THRESHOLD_3_1,
  GAP_THRESHOLD_2_1,
  GAP_THRESHOLD_1_1,
  GAP_MIN_VALUE,
  GAP_MIN_PERCENTAGE,
  GAP_MAX_PERCENTAGE,
  MIN_SPACER,
  SPACER_BOUNDS_2,
  GUM_YELLOW_THICKNESS,
  DEFAULT_GUM_SIZE,
  DEFAULT_GUM_COLOR,
  DEFAULT_KNIFE_COLOR,
  DEBOUNCE_SAVE_MS,
  SPACER_PRESETS,
} from '../constants'

// ─── Type Definitions ────────────────────────────────────────────────────────

export interface PanelState {
  cutWidth: string
  materialThickness: string
  knifeSize: string
  cutGap: string
}

export interface KnifeItem {
  type: 'knife'
  size: number
  color: string
}

export interface GumItem {
  type: 'gum'
  size: number
  color: string
}

export interface SpacersItem {
  type: 'spacers'
  totalWidth: number
}

export interface GapItem {
  type: 'gap'
  size: number
}

export interface SpacerItem {
  type: 'spacer'
  size: number
  color: string
}

export type LayoutItem = KnifeItem | GumItem | SpacersItem | GapItem | SpacerItem

// ─── Helper Functions ────────────────────────────────────────────────────────

/** Get width of a LayoutItem regardless of type */
export function getLayoutItemWidth(item: LayoutItem): number {
  return item.type === 'spacers' ? item.totalWidth : item.size
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

// ─── Spacer Bounds ───────────────────────────────────────────────────────────

function getSpacerBounds(n: number): { min: number; max: number } {
  return {
    min: n <= SPACER_BOUNDS_2 ? MIN_SPACER : 5,
    max: n * 14,
  }
}

// ─── Middle Layout Builder ───────────────────────────────────────────────────

// Maximum number of gums to try when building middle layout
const MAX_GUMS = 12

/**
 * Builds the middle layout (gums + spacers) for a given remaining width.
 * @param remaining - available width in mm to fill
 * @param gumColor - color of gums to use
 * @param edgeSpacers - whether to add spacers on edges
 */
function _buildMiddle(
  remaining: number,
  gumColor: string,
  edgeSpacers: boolean = true,
): LayoutItem[] {
  if (remaining <= 0) return []

  const slotsFor = (n: number) => (edgeSpacers ? n + 1 : n - 1)

  let bestGums = 0
  const startN = edgeSpacers ? 1 : 2

  // Find optimal number of gums where spacers fit within bounds
  for (let n = startN; n <= MAX_GUMS; n++) {
    const totalGumWidth = n * DEFAULT_GUM_SIZE
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

  // Fallback: find max gums that fit with minimum spacers
  if (bestGums === 0) {
    for (let n = MAX_GUMS; n >= startN; n--) {
      const totalGumWidth = n * DEFAULT_GUM_SIZE
      const numSlots = slotsFor(n)
      if (totalGumWidth + numSlots * MIN_SPACER <= remaining) {
        bestGums = n
        break
      }
    }
  }

  // If nothing fits, use a single spacers block
  if (bestGums === 0) {
    return [{ type: 'spacers', totalWidth: remaining }]
  }

  const numSlots = slotsFor(bestGums)
  const spacerSpace = remaining - bestGums * DEFAULT_GUM_SIZE
  const eachSpacer = spacerSpace / numSlots

  const layout: LayoutItem[] = []
  let roundedSum = 0

  if (edgeSpacers) {
    for (let i = 0; i < numSlots; i++) {
      const rounded = Math.round(eachSpacer * 10) / 10
      const finalVal =
        i === numSlots - 1 ? Math.round((spacerSpace - roundedSum) * 10) / 10 : rounded
      roundedSum += finalVal
      layout.push({ type: 'spacers', totalWidth: finalVal })
      if (i < bestGums) {
        layout.push({ type: 'gum', size: DEFAULT_GUM_SIZE, color: gumColor })
      }
    }
  } else {
    layout.push({ type: 'gum', size: DEFAULT_GUM_SIZE, color: gumColor })
    for (let i = 0; i < numSlots; i++) {
      const rounded = Math.round(eachSpacer * 10) / 10
      const finalVal =
        i === numSlots - 1 ? Math.round((spacerSpace - roundedSum) * 10) / 10 : rounded
      roundedSum += finalVal
      layout.push({ type: 'spacers', totalWidth: finalVal })
      if (i < numSlots) {
        layout.push({ type: 'gum', size: DEFAULT_GUM_SIZE, color: gumColor })
      }
    }
  }

  return layout
}

// ─── Pinia Store ─────────────────────────────────────────────────────────────

export const useCalculatorStore = defineStore('calculator', () => {
  const panels = reactive({
    panel1: {
      cutWidth: '',
      materialThickness: '',
      knifeSize: '',
      cutGap: '',
    } as PanelState,
    panel2: {
      cutWidth: '',
      materialThickness: '',
      knifeSize: '',
      cutGap: '',
    } as PanelState,
  })

  const gapOverridden = ref(false)
  const spacers = ref(SPACER_PRESETS)
  const gums = ref([
    { size: DEFAULT_GUM_SIZE, color: DEFAULT_GUM_COLOR },
    { size: DEFAULT_GUM_SIZE, color: 'red' },
    { size: DEFAULT_GUM_SIZE, color: 'yellow' },
  ])
  const knives = ref([9, 12, 20])
  const panel1Result = ref<CutResult | null>(null)
  const showResult1 = ref(false)
  const lastWidth1 = ref<number | null>(null)
  const modal = ref<ModalState>({
    isOpen: false,
    layout: null,
    title: '',
  })

  // ─── Autosave with debounce ──────────────────────────────────────────────

  let saveTimeout: ReturnType<typeof setTimeout> | null = null

  const debouncedSave = () => {
    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      saveToStorage()
    }, DEBOUNCE_SAVE_MS)
  }

  // Watch panel1 for changes and trigger autosave
  watch(
    () => ({ ...panels.panel1 }),
    () => {
      autoCalculateGap()
      // Schedule save after autoCalculateGap completes
      requestAnimationFrame(() => {
        debouncedSave()
      })
    },
    { deep: true },
  )

  // Watch panel2 for changes and trigger autosave
  watch(
    () => ({ ...panels.panel2 }),
    () => {
      debouncedSave()
    },
    { deep: true },
  )

  // Cleanup timeout on store dispose
  onScopeDispose(() => {
    if (saveTimeout) clearTimeout(saveTimeout)
  })

  // ─── Panel Value Setters ─────────────────────────────────────────────────

  function setPanel1Values(values: PanelState) {
    Object.assign(panels.panel1, values)
  }

  function setPanel2Values(values: PanelState) {
    Object.assign(panels.panel2, values)
  }

  // ─── Auto Gap Calculation ────────────────────────────────────────────────

  function autoCalculateGap() {
    gapOverridden.value = false
    const thickness = parseFloat(String(panels.panel1.materialThickness).replace(',', '.'))
    if (Number.isFinite(thickness) && thickness > 0) {
      let gap: number
      if (thickness >= GAP_THRESHOLD_6_1) {
        gap = 0.7
      } else if (thickness >= GAP_THRESHOLD_5_1) {
        gap = 0.6
      } else if (thickness >= GAP_THRESHOLD_4_1) {
        gap = 0.5
      } else if (thickness >= GAP_THRESHOLD_3_1) {
        gap = 0.4
      } else if (thickness >= GAP_THRESHOLD_2_1) {
        gap = 0.3
      } else if (thickness >= GAP_THRESHOLD_1_1) {
        gap = 0.2
      } else {
        // thickness < 1.1mm - use minimum gap
        gap = GAP_MIN_VALUE
      }
      panels.panel1.cutGap = gap.toFixed(1)
    }
  }

  function setGapOverridden(overridden: boolean) {
    gapOverridden.value = overridden
  }

  // ─── Modal ───────────────────────────────────────────────────────────────

  function openModal(layout: LayoutItem[] | null, title: string) {
    modal.value.isOpen = true
    modal.value.layout = layout
    modal.value.title = title
  }

  function closeModal() {
    modal.value.isOpen = false
    modal.value.layout = null
    modal.value.title = ''
  }

  // ─── Main Calculate Entry ────────────────────────────────────────────────

  function calculate(panelNumber: number, values: PanelState): CutResult | void {
    if (panelNumber === 1) {
      const result = calculatePanel1(values)
      panel1Result.value = result
      showResult1.value = true
      return result
    }
    if (panelNumber === 2) {
      // Panel 2 calculation placeholder
      return undefined
    }
  }

  // ─── Panel 1 Calculation ─────────────────────────────────────────────────

  function calculatePanel1(values: PanelState): CutResult {
    const width = parseFloat(values.cutWidth)
    const thickness = parseFloat(values.materialThickness)
    const knifeSize = parseFloat(values.knifeSize)
    const gap = parseFloat(values.cutGap)
    lastWidth1.value = width

    const minGap = Math.round(thickness * GAP_MIN_PERCENTAGE * 10) / 10
    const maxGap = Math.round(thickness * GAP_MAX_PERCENTAGE * 10) / 10

    if (gap < minGap) {
      throw new Error(
        'Szczelina cięcia (' +
          gap +
          'mm) nie może być mniejsza niż 5% grubości materiału (' +
          minGap +
          'mm).',
      )
    }
    if (gap > maxGap) {
      throw new Error(
        'Szczelina cięcia (' +
          gap +
          'mm) nie może być większa niż 80% grubości materiału (' +
          maxGap +
          'mm).',
      )
    }

    const cutWidth = width - gap

    if (cutWidth < knifeSize * 2) {
      throw new Error(
        'Szerokość cięcia (' +
          width +
          'mm) za mała dla dwóch noży (' +
          knifeSize +
          'mm) i szczeliny (' +
          gap +
          'mm). Cięcie (' +
          cutWidth.toFixed(1) +
          'mm) musi mieścić 2 noże. Wymagane minimum: ' +
          (knifeSize * 2 + gap).toFixed(1) +
          'mm.',
      )
    }

    const spacingGumColor = thickness >= GUM_YELLOW_THICKNESS ? 'yellow' : 'red'

    const cutMiddle = _buildMiddle(cutWidth - knifeSize * 2, DEFAULT_GUM_COLOR, false)
    const spacingMiddle = _buildMiddle(width - knifeSize * 2, spacingGumColor, false)

    const cut: LayoutItem[] = [
      { type: 'knife', size: knifeSize, color: DEFAULT_KNIFE_COLOR },
      ...cutMiddle,
      { type: 'knife', size: knifeSize, color: DEFAULT_KNIFE_COLOR },
    ]

    const hasGumsInCut = cutMiddle.some((item) => item.type === 'gum')

    let spacing: LayoutItem[]
    if (!hasGumsInCut && width >= 20) {
      const gumSize = DEFAULT_GUM_SIZE
      const remainingWidth = width - gumSize
      const targetWidth = remainingWidth / 2

      // Find the closest spacer value to the target width
      let leftSpacerWidth = spacers.value[0]
      let minDifference = Math.abs(targetWidth - leftSpacerWidth)
      for (const spacerValue of spacers.value) {
        const difference = Math.abs(targetWidth - spacerValue)
        if (difference < minDifference) {
          minDifference = difference
          leftSpacerWidth = spacerValue
        }
      }

      // Ensure leftSpacerWidth doesn't exceed remaining width
      if (leftSpacerWidth > remainingWidth) {
        const validSpacers = spacers.value.filter((spacerValue) => spacerValue <= remainingWidth)
        leftSpacerWidth = validSpacers.length > 0 ? validSpacers[validSpacers.length - 1] : 0
      }

      const rightSpacerWidth = remainingWidth - leftSpacerWidth
      spacing = []
      if (leftSpacerWidth > 0) spacing.push({ type: 'spacers', totalWidth: leftSpacerWidth })
      spacing.push({ type: 'gum', size: gumSize, color: spacingGumColor })
      if (rightSpacerWidth > 0) spacing.push({ type: 'spacers', totalWidth: rightSpacerWidth })
    } else {
      spacing = [
        { type: 'spacer', size: knifeSize, color: DEFAULT_KNIFE_COLOR },
        ...spacingMiddle,
        { type: 'spacer', size: knifeSize, color: DEFAULT_KNIFE_COLOR },
      ]
    }

    const sumWidth = (layout: LayoutItem[]) => layout.reduce((s, i) => s + getLayoutItemWidth(i), 0)

    return {
      cut,
      spacing,
      cutWidth: sumWidth(cut),
      spacingWidth: sumWidth(spacing),
    }
  }

  // ─── Storage ─────────────────────────────────────────────────────────────

  function saveToStorage() {
    try {
      localStorage.setItem('slittingCalc', JSON.stringify(panels))
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Failed to save calculator state to localStorage:', error)
      }
    }
  }

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem('slittingCalc')
      if (saved) {
        const data = JSON.parse(saved)
        if (data?.panel1) Object.assign(panels.panel1, data.panel1)
        if (data?.panel2) Object.assign(panels.panel2, data.panel2)
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Failed to load calculator state from localStorage:', error)
      }
    }
  }

  return {
    panels,
    gapOverridden,
    spacers,
    gums,
    knives,
    panel1Result,
    showResult1,
    lastWidth1,
    modal,
    setPanel1Values,
    autoCalculateGap,
    setGapOverridden,
    setPanel2Values,
    openModal,
    closeModal,
    calculate,
    calculatePanel1,
    saveToStorage,
    loadFromStorage,
  }
})
