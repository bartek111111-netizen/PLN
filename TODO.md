# Plan działania - PLNoże

## 🏗️ Architektura i Refaktoryzacja
- [x] Rozbić `App.vue` na mniejsze komponenty (`Header`, `PanelSwitcher`, `SingleCutForm`, `MultiCutForm`, `LayoutVisualizer`)
- [ ] Finalizacja funkcji jednego cięcia
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
- [ ] Poprawić responsywność wizualizacji SVG na urządzeniach mobilnych
- [ ] Dodać interaktywność do wizualizacji (np. podgląd parametrów po kliknięciu)