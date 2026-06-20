# Plan działania - PLNoże

## 🏗️ Architektura i Refaktoryzacja
- [x] Rozbić `App.vue` na mniejsze komponenty (`Header`, `PanelSwitcher`, `SingleCutForm`, `MultiCutForm`, `LayoutVisualizer`)
- [ ] Poprawka jednego cięcia
  - [ ] Liczenie cięcia
  - [ ] Obliczanie gum
  - [ ] Obliczanie dystansu
- [x] Wprowadzić TypeScript do całego projektu
- [x] Wdrożyć Pinia do zarządzania stanem aplikacji
- [x] **Plan refaktoryzacji App.vue:**
    - [x] Utworzenie struktury katalogów (`components/layout/`, `components/forms/`, `components/visualizer/`)
    - [x] Wydzielenie `Header` i `PanelSwitcher`
    - [x] Wydzielenie `SingleCutForm` (logika formularza + walidacja)
    - [x] Wydzielenie `MultiCutForm`
    - [x] Wydzielenie `LayoutVisualizer` (komponent generujący SVG z `LayoutItem[]`)
    - [x] Wydzielenie `ResultSection` (kontener dla obu wizualizacji)
    - [x] Integracja w `App.vue` (jako orchestrator)

## 🛠️ Logika i Bezpieczeństwo
- [x] Zastąpić ręczną walidację biblioteką Zod
- [x] Zastąpić `alert()` systemem powiadomień (Toasts)
- [ ] Uporządkować strukturę danych w `calculatorStore.ts`

## 🧪 Testowanie
- [ ] Skonfigurować Vitest
- [ ] Napisać testy jednostkowe dla `calculatorStore.ts`

## 🎨 UI/UX
- [x] Poprawić responsywność wizualizacji SVG na urządzeniach mobilnych
- [x] Dodać interaktywność do wizualizacji (np. podgląd parametrów po kliknięciu)
- [ ] Ostateczna poprawka listy elementów w modalach (wygląd, formatowanie, opisy)

## ✅ Poprawki UI/UX (Sesja dzisiejsza)
- [x] Naprawiono centrowanie modali (LayoutDetailsModal, QRModal)
- [x] Naprawiono tło modali (overlay) - zastosowano Teleport i inline styles
- [x] Poprawiono czytelność modala wizualizacji (odstęp między numeracją a treścią)
- [x] Wyśrodkowano nagłówki w modalach
- [x] Zaktualizowano zasady projektu (vue-vite.md) o TypeScript i Tailwind
- [x] LayoutDetailsModal: zamknięcie tylko po kliknięciu poza modalem (tło)
- [x] LayoutDetailsModal: dodano wyświetlanie ogólnego wymiaru cięcia pod tytułem
- [x] QRModal: ujednolicony styl z LayoutDetailsModal (bez przycisku zamknij, zamykanie kliknięciem na tło)
- [x] PanelSwitcher: modernizacja przycisków (rounded-2xl, lepsze stany aktywny/nieaktywny, border, shadow)
- [x] Przycisk "Oblicz": poprawione odstępy (mt-12/mt-16) i zaokrąglenia (rounded-2xl)
- [x] Naprawiono Tailwind CSS v4 (`@import "tailwindcss"` zamiast starych dyrektyw v3)




