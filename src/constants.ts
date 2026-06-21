// Z-Index levels for modals and overlays
export const Z_INDEX_MODAL = 100000
export const Z_INDEX_MODAL_CONTENT = 100001
export const Z_INDEX_PANEL_SWITCHER = 100
export const Z_INDEX_QR_BUTTON = 200
export const Z_INDEX_TOAST = 9999

// QR Code
export const QR_CODE_SIZE = 280
export const QR_CODE_MARGIN = 3

// Toast defaults
export const TOAST_DEFAULT_DURATION = 6000

// Debounce
export const DEBOUNCE_SAVE_MS = 1000

// Gap percentage thresholds (based on material thickness)
export const GAP_THRESHOLD_6_1 = 6.1
export const GAP_THRESHOLD_5_1 = 5.1
export const GAP_THRESHOLD_4_1 = 4.1
export const GAP_THRESHOLD_3_1 = 3.1
export const GAP_THRESHOLD_2_1 = 2.1
export const GAP_THRESHOLD_1_1 = 1.1
export const GAP_MIN_VALUE = 0.1

// Gap percentage ratios
export const GAP_MIN_PERCENTAGE = 0.05
export const GAP_MAX_PERCENTAGE = 0.8

// Spacer bounds
export const MIN_SPACER = 1.5
export const MAX_SPACER_PER_UNIT = 14
export const SPACER_BOUNDS_2 = 5

// Gum color threshold
export const GUM_YELLOW_THICKNESS = 4

// Layout item defaults
export const DEFAULT_GUM_SIZE = 20
export const DEFAULT_GUM_COLOR = 'blue'
export const DEFAULT_KNIFE_COLOR = 'gray'

// Modal dimensions
export const MODAL_WIDTH = 350
export const MODAL_MAX_HEIGHT_VH = 50

// Form validation limits
export const MIN_CUT_WIDTH = 20
export const MAX_CUT_WIDTH = 1600
export const MIN_MATERIAL_THICKNESS = 0.5
export const MAX_MATERIAL_THICKNESS = 7
export const MIN_CUT_GAP = 0.1

// Knife sizes
export const KNIFE_SIZES = [9, 12, 20] as const
export type KnifeSize = (typeof KNIFE_SIZES)[number]

// Spacer presets
export const SPACER_PRESETS = [
  1.5, 1.8, 2, 2.05, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3, 4, 5, 6, 7, 8, 9, 9.15, 9.2,
  9.25, 9.3, 9.35, 9.4, 9.45, 9.5, 10, 15, 20, 30, 40, 50,
]

// Gum options
export interface GumOption {
  size: number
  color: 'blue' | 'red' | 'yellow'
}

export const DEFAULT_GUM_OPTIONS: GumOption[] = [
  { size: DEFAULT_GUM_SIZE, color: 'blue' },
  { size: DEFAULT_GUM_SIZE, color: 'red' },
  { size: DEFAULT_GUM_SIZE, color: 'yellow' },
]

// App
export const APP_TITLE = 'PLNoże'
export const APP_SUBTITLE = 'Kalkulator do noży.'
export const APP_URL = 'https://bartek111111-netizen.github.io/PLN/'

// Toast message
export const TOAST_SUCCESS_MESSAGE = 'Obliczenia wykonane pomyślnie.'
export const TOAST_SUCCESS_DURATION = 2500
export const TOAST_QR_ERROR = 'Nie udało się wygenerować kodu QR.'

// Form labels
export const LABEL_CUT_WIDTH = 'Szerokość cięcia'
export const LABEL_MATERIAL_THICKNESS = 'Grubość materiału'
export const LABEL_CUT_GAP = 'Szczelina cięcia'
export const LABEL_KNIFE_SIZE = 'Rozmiar noża'
export const LABEL_SELECT_SIZE = 'Wybierz rozmiar...'
export const LABEL_CUT_WIDTH_PLACEHOLDER = 'Wpisz wartość...'
export const LABEL_CUT_GAP_AUTO = 'Auto (10% grubości)...'

// Form validation messages
export const ERROR_MIN_GAP =
  'Szczelina cięcia (%1$mm) nie może być mniejsza niż 5%% grubości materiału (%2$mm).'
export const ERROR_MAX_GAP =
  'Szczelina cięcia (%1$mm) nie może być większa niż 80%% grubości materiału (%2$mm).'
export const ERROR_CUT_TOO_SMALL =
  'Szerokość cięcia (%1$mm) za mała dla dwóch noży (%2$mm) i szczeliny (%3$mm). Cięcie (%4$mm) musi mieścić 2 noże. Wymagane minimum: %5$mm.'
export const ERROR_UNKNOWN = 'Wystąpił nieznany błąd.'

// UI labels
export const UI_MODAL_TITLE = 'Szczegóły układu'
export const UI_MODAL_CUT_TITLE = 'Szczegóły Cięcia'
export const UI_MODAL_SPACING_TITLE = 'Szczegóły Dystansu Cięcia'
export const UI_MODAL_CLOSE_HINT = 'Kliknij poza, aby zamknąć'
export const UI_QR_TITLE = 'Zeskanuj QR'
export const UI_CALCULATE_BUTTON = 'Oblicz'
export const UI_NO_ITEMS = 'Brak elementów w układzie.'
