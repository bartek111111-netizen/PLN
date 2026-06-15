# Plan działania - PLNoże

## 🏗️ Architektura i Refaktoryzacja
- [ ] Rozbić `App.vue` na mniejsze komponenty (`Header`, `PanelSwitcher`, `SingleCutForm`, `MultiCutForm`, `LayoutVisualizer`)
- [x] Wprowadzić TypeScript do całego projektu
- [x] Wdrożyć Pinia do zarządzania stanem aplikacji

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