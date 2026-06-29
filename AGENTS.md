# PLNoże — SKILL.md

## Kontekst projektu

**PLNoże** to aplikacja webowa (PWA) służąca do obliczania optymalnych konfiguracji noży do maszyn do cięcia w płytach stalowych. Pozwala na szybkie ustalenie układu elementów (noży, gum i dystansów) dla zadanej szerokości cięcia oraz grubości materiału.

- **Stos technologiczny**: Vue 3 + TypeScript + Vite + Pinia + Tailwind CSS v4 + Zod v4
- **URL aplikacji**: `https://bartek111111-netizen.github.io/PLN/`
- **Repozytorium**: `https://github.com/bartek111111-netizen/PLN.git`

---

## Struktura projektu

```
PLN/
├── src/
│   ├── App.vue                    # Główny komponent aplikacji
│   ├── constants.ts               # Stałe aplikacji (UI, walidacja, konfiguracja)
│   ├── main.ts                    # Punkt wejścia aplikacji
│   ├── style.css                  # Style główne (Tailwind CSS v4 via @import)
│   ├── assets/
│   │   ├── hero.png               # Obraz hero (header)
│   │   ├── vite.svg               # Ikona Vite
│   │   └── vue.svg                # Ikona Vue
│   ├── components/
│   │   ├── QRModal.vue            # Modal z kodem QR do udostępniania linku
│   │   ├── Toast.vue              # Komunikat toast (success/error/warning)
│   │   ├── forms/
│   │   │   ├── MultiCutForm.vue   # Formularz do wielu cięć (w planach)
│   │   │   ├── NumberInput.vue    # Input liczbowy z walidacją
│   │   │   └── SingleCutForm.vue  # Formularz do pojedynczego cięcia
│   │   ├── layout/
│   │   │   ├── Header.vue         # Nagłówek aplikacji (logo, tytuła, podtytuł)
│   │   │   └── PanelSwitcher.vue  # Przełącznik paneli (Panel 1 / Panel 2)
│   │   └── visualizer/
│   │       ├── LayoutDetailsModal.vue   # Modal ze szczegółami układu
│   │       ├── LayoutVisualizer.vue     # Wizualizacja SVG układu noży
│   │       └── ResultSection.vue        # Sekcja wyników obliczeń
│   ├── stores/
│   │   ├── calculatorStore.ts     # Store Pinia — stan + logika kalkulatora
│   │   └── toastStore.ts          # Store Pinia — system powiadomień toast
│   ├── utils/
│   │   └── errorHandler.ts        # Obsługa błędów walidacji Zod
│   └── validation/
│       └── panel1Schema.ts        # Schema Zod v4 walidacji Panel 1
├── public/
│   ├── favicon.svg                # Ikona favicon
│   ├── icon-192.png               # Ikona PWA 192x192
│   ├── icon-512.png               # Ikona PWA 512x512
│   └── icons.svg                  # Ikony SVG (sprite)
├── index.html                     # HTML wejściowy + manifest PWA
├── vite.config.ts                 # Konfiguracja Vite (alias @, PWA plugin)
├── tsconfig.json                  # TypeScript — strict mode
├── eslint.config.js               # ESLint flat config
├── postcss.config.js              # PostCSS + autoprefixer
├── .prettierrc                    # Konfiguracja Prettier
├── .editorconfig                  # Style edytora
└── package.json                   # Zależności i skrypty
```

---

## Stos technologiczny

| Technologia | Wersja | Rola |
|---|---|---|
| Vue.js | 3.x | Framework UI (Composition API, `<script setup>`) |
| TypeScript | latest | Typowanie statyczne (strict mode) |
| Vite | latest | Bundler + serwer deweloperski |
| Pinia | latest | Zarządzanie stanem (stores) |
| Zod | v4 | Walidacja danych wejściowych |
| Tailwind CSS | v4 | Framework CSS (konfiguracja w CSS, brak `tailwind.config.js`) |
| PostCSS + autoprefixer | latest | Przetwarzanie CSS |
| qrcode | latest | Generowanie kodów QR |
| ESLint | latest | Statyczna analiza kodu |
| Prettier | latest | Formatowanie kodu |
| vue-tsc | latest | TypeScript checker dla Vue |

---

## Konwencje kodowania

### TypeScript
- **Strict mode** — zawsze włączony (`"strict": true` w `tsconfig.json`)
- Żadne `any` — używaj `unknown` do typowania dynamicznych danych
- Używaj `type` zamiast `interface` tam gdzie to możliwe (chyba że potrzebujesz `merge` interfejsów)
- Używaj `as const` dla literałów i stałych tablic

### Vue 3
- Zawsze używaj `<script setup lang="ts">`
- Używaj Composition API z `ref()` / `reactive()`
- Komponenty props: `defineProps<{ ... }>()` z typami TypeScript
- Emity: `defineEmits<{ ... }>()` z typami
- Template bindings: używaj `v-if`, `v-for`, `v-model` zgodnie z dokumentacją Vue 3

### Pinia
- Store'y definiuj przez `defineStore('nazwa', () => { ... })` (setup store)
- Stan: `ref()` dla stanu reaktywnego, `reactive()` dla złożonych obiektów
- Gettery: zwykłe funkcje `const` odwołujące się do stanu
- Akcje: funkcje `const` modyfikujące stan
- Nie używaj Vuex — projekt jest w pełni na Pinia

### Tailwind CSS v4
- Konfiguracja przez CSS: `@import "tailwindcss"` w `src/style.css`
- **Brak pliku `tailwind.config.js`** — konfiguracja w CSS via `@theme`
- Używaj klas utility-first w template
- Kolory: `slate-*` (tło/nawigacja), `green-*` / `emerald-*` (CTA), `blue-*` (akcenty)

### Zod v4
- Walidacja przez `schema.parse(data)` — rzuca `ZodError` przy błędzie
- Komunikaty błędów: używaj `z.coerce.number()` dla pól liczbowych
- Błędy Zod: obsługuj przez `handleValidationError()` w `src/utils/errorHandler.ts`

### Nazewnictwo
- **Pliki komponentów Vue**: PascalCase (`SingleCutForm.vue`)
- **Pliki TS/JS**: camelCase (`calculatorStore.ts`)
- **Stałe**: UPPER_SNAKE_CASE (`DEFAULT_GUM_SIZE`, `MIN_CUT_WIDTH`)
- **Funkcje pomocnicze**: camelCase (`getLayoutItemWidth`, `_buildMiddle`)
- **Nazwy store'ów Pinia**: camelCase z suffiksem `Store` (`calculatorStore`, `toastStore`)

---

## Architektura aplikacji

### Store: `calculatorStore` (Pinia)

#### Stan
```typescript
panels: {
  panel1: { cutWidth, materialThickness, knifeSize, cutGap }  // Panel 1 — pojedyncze cięcie
  panel2: { cutWidth, materialThickness, knifeSize, cutGap }  // Panel 2 — wielokrotne cięcie (w planach)
}
gapOverridden: boolean          // Czy użytkownik nadpisał szczelinę
spacers: number[]               // Presety dystansów
gums: { size, color }[]         // Opcje gum
knives: number[]                // Rozmiary noży [9, 12, 20]
panel1Result: CutResult | null  // Wynik obliczeń Panel 1
showResult1: boolean            // Czy pokazywać wyniki Panel 1
modal: { isOpen, layout, title } // Stan modala szczegółów
```

#### Typy LayoutItem
```typescript
type LayoutItem =
  | { type: 'knife', size: number, color: string }       // Nóż
  | { type: 'gum', size: number, color: string }         // Guma (blue/red/yellow)
  | { type: 'spacers', totalWidth: number }               // Blok dystansów
  | { type: 'gap', size: number }                         // Szczelina cięcia
  | { type: 'spacer', size: number, color: string }       // Dystans pojedynczy
```

#### Kluczowe funkcje
- `calculatePanel1(values: PanelState): CutResult` — główne algorytmy obliczeniowe
- `_buildMiddle(remaining, gumColor, edgeSpacers): LayoutItem[]` — budowanie układu środkowego (gums + spacers)
- `autoCalculateGap()` — auto-obliczanie szczeliny na podstawie grubości materiału
- `saveToStorage()` / `loadFromStorage()` — localStorage z debounce (1000ms)
- `openModal(layout, title)` / `closeModal()` — zarządzanie modalem

### Store: `toastStore` (Pinia)

#### Stan
```typescript
toasts: Toast[]  // Tablica powiadomień
```

#### Typy toast
- `error` — błąd (czerwony)
- `success` — sukces (zielony)
- `warning` — ostrzeżenie (żółty)

#### Funkcje
- `add(message, type, duration)` — dodaj toast
- `error(message, duration?)` — shortcut dla error
- `success(message, duration?)` — shortcut dla success
- `warning(message, duration?)` — shortcut dla warning

---

## Workflow obliczeniowy (Panel 1)

### Krok 1: Wejście
Użytkownik wprowadza:
1. **Szerokość cięcia** (`cutWidth`) — zakres: 20–1600mm, dokładność 2 miejsc
2. **Grubość materiału** (`materialThickness`) — zakres: 0.5–7mm, dokładność 2 miejsc
3. **Rozmiar noża** (`knifeSize`) — select: 9mm, 12mm, 20mm
4. **Szczelina cięcia** (`cutGap`) — zakres: 0.1–3mm, dokładność 1 miejsce

### Krok 2: Auto-obliczanie szczeliny
Szczelina obliczana automatycznie na podstawie grubości materiału:

| Grubość materiału | Szczelina |
|---|---|
| < 1.1mm | 0.1mm (minimum) |
| ≥ 1.1mm | 0.2mm |
| ≥ 2.1mm | 0.3mm |
| ≥ 3.1mm | 0.4mm |
| ≥ 4.1mm | 0.5mm |
| ≥ 5.1mm | 0.6mm |
| ≥ 6.1mm | 0.7mm |

Użytkownik może nadpisać automatyczną wartość (flaga `gapOverridden`).

### Krok 3: Walidacja
- Schema `panel1Schema` (Zod v4) waliduje dane wejściowe
- Dodatkowe reguły biznesowe w `calculatePanel1()`:
  - Szczelina ≥ 5% grubości materiału
  - Szczelina ≤ 80% grubości materiału
  - Cięcie ≥ 2 × rozmiar noża + szczelina

### Krok 4: Obliczanie układu
1. **Oblicz `cutWidth`** = `cutWidth - gap`
2. **Zbuduj układ cięcia**:
   - Nóż (lewy) → elementy środkowe (`_buildMiddle`) → Nóż (prawy)
   - Guma w cięciu: kolor `blue`
3. **Zbuduj układ dystansu**:
   - Nóż (lewy) → elementy środkowe (`_buildMiddle`) → Nóż (prawy)
   - Guma w dystansie: `red` (grubość < 4mm) lub `yellow` (grubość ≥ 4mm)
4. **Specjalny przypadek**: gdy brak gum w cięciu i `width ≥ 20` — użyj presetów dystansów

### Krok 5: Wizualizacja
- `LayoutVisualizer.vue` — renderuje SVG z układem
- Kliknięcie na wizualizację otwiera `LayoutDetailsModal` ze szczegółami
- Dwa panele: **Cięcie** i **Dystans cięcia**

### Krok 6: Zapis
- Stan zapisywany w `localStorage` pod kluczem `slittingCalc`
- Debounce: 1000ms po ostatniej zmianie

---

## Stałe kluczowe (z `constants.ts`)

```typescript
// Granice szczeliny
GAP_THRESHOLD_6_1 = 6.1       // mm — próg dla szczeliny 0.7mm
GAP_THRESHOLD_5_1 = 5.1       // mm — próg dla szczeliny 0.6mm
GAP_THRESHOLD_4_1 = 4.1       // mm — próg dla szczeliny 0.5mm
GAP_THRESHOLD_3_1 = 3.1       // mm — próg dla szczeliny 0.4mm
GAP_THRESHOLD_2_1 = 2.1       // mm — próg dla szczeliny 0.3mm
GAP_THRESHOLD_1_1 = 1.1       // mm — próg dla szczeliny 0.2mm
GAP_MIN_VALUE = 0.1           // mm — minimalna szczelina
GAP_MIN_PERCENTAGE = 0.05     // 5% — minimalny procent grubości
GAP_MAX_PERCENTAGE = 0.8      // 80% — maksymalny procent grubości

// Dystanse
MIN_SPACER = 1.5              // mm — minimalny dystans
MAX_SPACER_PER_UNIT = 14      // mm — maksymalny dystans na jednostkę
GUM_YELLOW_THICKNESS = 4      // mm — próg dla żółtej gumy w dystansie

// Domyślne wartości
DEFAULT_GUM_SIZE = 20         // mm — domyślny rozmiar gumy
DEFAULT_GUM_COLOR = 'blue'    // domyślny kolor gumy
DEFAULT_KNIFE_COLOR = 'gray'  // domyślny kolor noża
DEBOUNCE_SAVE_MS = 1000       // ms — debounce zapisu

// Walidacja formularza
MIN_CUT_WIDTH = 20            // mm — minimalna szerokość cięcia
MAX_CUT_WIDTH = 1600          // mm — maksymalna szerokość cięcia
MIN_MATERIAL_THICKNESS = 0.5  // mm — minimalna grubość materiału
MAX_MATERIAL_THICKNESS = 7    // mm — maksymalna grubość materiału
MIN_CUT_GAP = 0.1             // mm — minimalna szczelina

// Noże
KNIFE_SIZES = [9, 12, 20]    // mm — dostępne rozmiary noży

// Presety dystansów
SPACER_PRESETS = [1.5, 1.8, 2, 2.05, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3, 4, 5, 6, 7, 8, 9, 9.15, 9.2, 9.25, 9.3, 9.35, 9.4, 9.45, 9.5, 10, 15, 20, 30, 40, 50]
```

---

## Skrypty npm

```bash
npm run dev          # Uruchom serwer deweloperski (Vite)
npm run build        # Budowanie produkcyjne (Vue + TypeScript + Vite)
npm run preview      # Podgląd wersji produkcyjnej
npm run type-check   # Sprawdzenie TypeScript (vue-tsc)
npm run lint         # ESLint — analiza kodu
npm run format       # Prettier — formatowanie kodu
```

---

## Ograniczenia i zasady

### NIGDY nie rób:
- Nie usuwaj walidacji Zod — jest kluczowa dla bezpieczeństwa danych
- Nie zmieniaj `KNIFE_SIZES` bez konsultacji — to preset maszynowy
- Nie usuwaj `_buildMiddle()` — to rdzeń algorytmu obliczeniowego
- Nie używaj `tailwind.config.js` — projekt używa Tailwind CSS v4 z konfiguracją w CSS
- Nie używaj `any` w TypeScript — używaj `unknown` gdy potrzebujesz
- Nie dodawaj stanu do `localStorage` bez debounce (1000ms)

### ZAWSZE rób:
- Używaj `<script setup lang="ts">` we wszystkich komponentach Vue
- Używaj Pinia setup stores (`defineStore('nazwa', () => { ... })`)
- Używaj Zod v4 `schema.parse()` do walidacji
- Używaj `handleValidationError()` do obsługi błędów Zod
- Trzymaj stałe w `constants.ts` — nie hardkoduj wartości w komponentach
- Używaj Tailwind utility classes zamiast custom CSS gdy to możliwe
- Dodawaj komunikaty toast po każdej operacji (success/error)

### PRZY OBLICZANIU:
- Szanuj granice dystansów: `MIN_SPACER` (1.5mm) i `MAX_SPACER_PER_UNIT` (14mm)
- Kolor gumy w dystansie: `red` (< 4mm) lub `yellow` (≥ 4mm)
- Szczelina: zawsze 5%–80% grubości materiału
- Układ cięcia: zawsze 2 noże + elementy środkowe
- W special case (brak gum w cięciu, width ≥ 20): użyj presetów dystansów

---

## Narzędzia MCP

Projekt używa **Codebase Memory MCP** do indeksowania i analizy kodu:
- `index_repository` — indeksuj repozytorium do bazy wiedzy
- `search_graph` — szukaj w grafie kodu
- `query_graph` — zapytania Cypher do analizy zależności
- `trace_path` — śledzenie ścieżek wywołań
- `get_code_snippet` — odczyt fragmentów kodu

---

## PWA Configuration

Aplikacja jest konfigurowana jako Progressive Web App przez Vite PWA plugin:
- Ikony: `icon-192.png`, `icon-512.png`
- Manifest: generowany automatycznie przez plugin
- Service Worker: generowany automatycznie
- URL: `https://bartek111111-netizen.github.io/PLN/`

---

## Agent Boundaries

### Terminal & Git — Restrictions

- **Dozwolone komendy terminalne**: `npm run dev`, `npm run build`, `npm run lint`, `npm run format`, `npm run type-check`, `npm run preview`, `eslint`, `prettier`, `node`, `grep`, `ls`, `cat`, itp.
- **Dozwolone git komendy**: `git pull`, `git add`, `git status`, `git diff`.
- **NIGDY nie wykonuj `git commit`** — to robi użytkownik samodzielnie.
- **NIGDY nie wykonuj `git push`** — to robi użytkownik samodzielnie.
