# TODO - Code Quality Improvements

## ✅ Completed

- [x] **Magic Numbers → Constants** — Stworzono `src/constants.ts` z wszystkimi magic numbers, wyeksportowano: `MIN_CUT_WIDTH`, `MAX_CUT_WIDTH`, `MIN_MATERIAL_THICKNESS`, `MAX_MATERIAL_THICKNESS`, `MIN_CUT_GAP`, `KNIFE_SIZES`, `TOAST_SUCCESS_MESSAGE`, `TOAST_SUCCESS_DURATION`, `DEFAULT_GUM_SIZE`, `DEFAULT_GUM_COLOR`, `DEFAULT_KNIFE_COLOR`, `DEBOUNCE_SAVE_MS`, gap thresholds, spacer bounds
- [x] **Field Naming** — `field1` → `cutWidth`, `field2` → `materialThickness`, `field3` → `knifeSize`, `field4` → `cutGap`
- [x] **Panel 2 Schema** — Dodano `panel2Schema` w `src/validation/panel2Schema.ts` oraz walidację `panel2` w `src/validation/index.ts`
- [x] **ZodError Import Fix** — Naprawiono import `ZodError` z `zod` w `src/components/forms/SingleCutForm.vue`
- [x] **Variable Naming in calculatorStore.ts** — `s1` → `leftSpacerWidth`, `s2` → `rightSpacerWidth`, `gumSize` → `remainingWidth`/`targetWidth`, `minDiff` → `minDifference`
- [x] **Error Handling** — Dodano `console.error` w catch blocks dla trybu dev w `calculatorStore.ts`
- [x] **ESLint + Prettier Configuration** — `.eslintrc.cjs`, `.prettierrc`, `prettier.config.js` z Tailwind plugin, `.editorconfig`, skrypty `lint`, `lint:fix`, `format` w `package.json`
- [x] **Shared Constants for Presets** — Dodano `SPACER_PRESETS` do `src/constants.ts`, `calculatorStore.ts` używa `SPACER_PRESETS` z constants
- [x] **Shared Error Handler** — Dodano `src/utils/errorHandler.ts` z `showError()` i `showValidationError()`, wyeksportowano `ERROR_MESSAGES` z komunikatami po polsku, podłączono `SingleCutForm.vue` i `MultiCutForm.vue` do shared handler
- [x] **ESLint + Prettier Consistency** — Dodano `tsconfig.eslint.json`, `eslint-plugin-vue`, `eslint-plugin-prettier`, `prettier`, skonfigurowano ESLint z vue/recommended + prettier/recommended, dodano reguły vue/, `no-console` z eslint-disable, naprawiono `NumberInput.vue` (self-closing tag), usunięto TODO z `App.vue`, dodano `ERROR_MESSAGES` do `src/constants.ts`

## 📋 Remaining Improvements (Optional)

- [x] **Tailwind CSS @apply Refactoring** — Dodano sekcję "Reusable Tailwind @apply Classes" w `src/style.css` z klasami: `.app-bg`, `.header-bg`, `.panel-switcher-wrapper`, `.panel-card`, `.form-label`, `.visualizer-container`, `.qr-button`, `.modal-*`, `.flex-center` i wieloma innymi
- [x] **TypeScript Strict Mode** — Włączono `strict: true` w `tsconfig.json`
- [ ] **Testing** — Dodanie testów jednostkowych dla funkcji kalkulatora, dodanie testów komponentów Vue
- [ ] ~~**Performance**~~ — ~~Rozważyć `shallowRef` zamiast `ref` dla dużych obiektów niebędących reaktivnymi, lazy loading komponentów routera~~ — USUNIĘTO: przy skromnym rozmiarze projektu brak praktycznej korzyści ze shallowRef, Vue 3 reactive system wystarczająco wydajny
- [x] **Documentation** — Dodano JSDoc do funkcji w `calculatorStore.ts` (3 komentarze @param), README z instrukcją konfiguracji dev environment (ESLint plugin w VSCode)
