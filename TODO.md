# Plan działania - PLNoże

## 🏗️ Architektura i Refaktoryzacja
- [ ] Rozbić `App.vue` na mniejsze komponenty (`Header`, `PanelSwitcher`, `SingleCutForm`, `MultiCutForm`, `LayoutVisualizer`)
- [ ] Wprowadzić TypeScript do całego projektu
- [x] Wdrożyć Pinia do zarządzania stanem aplikacji

## 🛠️ Logika i Bezpieczeństwo
- [ ] Zastąpić ręczną walidację biblioteką Zod
- [x] Zastąpić `alert()` systemem powiadomień (Toasts)
- [ ] Uporządkować strukturę danych w `calculator.js`

## 🧪 Testowanie
- [ ] Skonfigurować Vitest
- [ ] Napisać testy jednostkowe dla `calculator.js`

## 🎨 UI/UX
- [ ] Poprawić responsywność wizualizacji SVG na urządzeniach mobilnych
- [ ] Dodać interaktywność do wizualizacji (np. podgląd parametrów po kliknięciu)