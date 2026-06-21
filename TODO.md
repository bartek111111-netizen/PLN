# TODO - Code Quality Improvements

## ✅ Completed

### 1. Magic Numbers → Constants
- Stworzono `src/constants.ts` z wszystkimi magic numbers
- Wyeksportowano: `MIN_CUT_WIDTH`, `MAX_CUT_WIDTH`, `MIN_MATERIAL_THICKNESS`, `MAX_MATERIAL_THICKNESS`, `MIN_CUT_GAP`, `KNIFE_SIZES`, `TOAST_SUCCESS_MESSAGE`, `TOAST_SUCCESS_DURATION`, `DEFAULT_GUM_SIZE`, `DEFAULT_GUM_COLOR`, `DEFAULT_KNIFE_COLOR`, `DEBOUNCE_SAVE_MS`, gap thresholds, spacer bounds

### 2. Field Naming
- `field1` → `cutWidth`
- `field2` → `materialThickness`
- `field3` → `knifeSize`
- `field4` → `cutGap`

### 3. Panel 2 Schema
- Dodano `panel2Schema` w `src/validation/panel2Schema.ts`
- Dodano walidację `panel2` w `src/validation/index.ts`

### 4. ZodError Import Fix
- Naprawiono import `ZodError` z `zod` w `src/components/forms/SingleCutForm.vue`

### 5. Variable Naming in calculatorStore.ts
- `s1` → `leftSpacerWidth`
- `s2` → `rightSpacerWidth`
- `gumSize` → `remainingWidth`, `targetWidth`
- `minDiff` → `minDifference`

### 6. Error Handling
- Dodano `console.error` w catch blocks dla trybu dev w `calculatorStore.ts`

### 7. ESLint + Prettier Configuration
- `.eslintrc.cjs` - konfiguracja ESLint z TypeScript i Vue
- `.prettierrc` - konfiguracja Prettier
- `prettier.config.js` - konfiguracja Prettier z Tailwind plugin
- `.editorconfig` - standardyzacja ustawień edytora
- `package.json` - dodano skrypty: `lint`, `lint:fix`, `format`

### 8. Shared Constants for Presets
- Dodano `SPACER_PRESETS` do `src/constants.ts`
- `calculatorStore.ts` używa teraz `SPACER_PRESETS` z constants zamiast lokalnej definicji

### 9. Shared Error Handler
- Dodano `src/utils/errorHandler.ts` z `showError()` i `showValidationError()`
- Wyeksportowano `ERROR_MESSAGES` z komunikatami po polsku
- Podłączono `SingleCutForm.vue` do shared handler

### 10. ESLint + Prettier Consistency
- Dodano `tsconfig.eslint.json` dla lepszego parserowania TypeScript
- Dodano `.prettierrc` i `prettier.config.js` z Tailwind plugin
- Dodano `eslint-plugin-vue`, `eslint-plugin-prettier`, `prettier` do package.json
- Skonfigurowano ESLint z vue/recommended + prettier/recommended
- Dodano reguły: `vue/multi-word-component-names: 'off'`, `vue/comment-directive: 'off'`, `vue/no-multi-spaces: 'warn'`, `vue/max-attributes-per-line: 'off'`, `vue/singleline-html-element-content-newline: 'off'`, `vue/html-self-closing: ['warn', { html: { void: 'always' } }]`
- Dodano `no-console: 'warn'` z eslint-disable dla intentionalnych logów
- Dodano skrypty: `lint`, `lint:fix`, `format`
- Naprawiono `NumberInput.vue` - tag `<input>` zamknięty jako `< />` (self-closing)
- Usunięto TODO z `App.vue` (placeholder na usunięty)
- Dodano `ERROR_MESSAGES` do `src/constants.ts`
- Podłączono `MultiCutForm.vue` do shared error handler

## 📋 Remaining Improvements (Optional)

### Tailwind CSS @apply Refactoring
Rozważyć wyeksowanie powtarzalnych inline klas Tailwind do `@apply` w CSS:
- `src/App.vue` - wiele inline klas w template
- Komponenty wizualizacyjne - klasy layoutu

### TypeScript Strict Mode
- Rozważyć włączenie `strict: true` w `tsconfig.json`
- Dodanie typów dla zwracanych wartości funkcji

### Testing
- Dodanie testów jednostkowych dla funkcji kalkulatora
- Dodanie testów komponentów Vue

### Performance
- Rozważyć `shallowRef` zamiast `ref` dla dużych obiektów niebędących reaktivnymi
- Lazy loading komponentów routera

### Documentation
- Dodanie JSDoc do funkcji
- README z instrukcją konfiguracji dev environment (ESLint plugin w VSCode)