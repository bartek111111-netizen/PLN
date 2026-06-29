# PLNoże - Kalkulator Konfiguracji Noży

Ten program służy do obliczania optymalnych konfiguracji noży do maszyn do cięcia w płytach stalowych. Pozwala na szybkie ustalenie układu elementów (noży, gum i dystansów) dla zadanej szerokości cięcia oraz grubości materiału.

## 🚀 Technologie

### Podstawowe

* **[Vue.js 3](https://vuejs.org/)** - Framework JavaScript do budowy interfejsu użytkownika.
* **[TypeScript](https://www.typescriptlang.org/)** - Typowanie statyczne w całym projekcie (strict mode).
* **[Vite](https://vitejs.dev/)** - Szybkie narzędzie do budowania i serwowania aplikacji.

### Stan i walidacja

* **[Pinia](https://pinia.vuejs.org/)** - Zarządzanie stanem aplikacji (store do kalkulatora i powiadomień).
* **[Zod v4](https://zod.dev/)** - Walidacja danych wejściowych (schema `panel1Schema`).

### Stylowanie

* **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework CSS do nowoczesnego i responsywnego stylizowania (konfiguracja w CSS via `@import 'tailwindcss'`, bez `tailwind.config.js`).
* **[PostCSS](https://postcss.org/)** - Narzędzie do przetwarzania CSS.
* **[autoprefixer](https://github.com/postcss/autoprefixer)** - Automatyczne dodawanie prefixów vendorowych.

### Dodatkowe

* **[qrcode](https://www.npmjs.com/package/qrcode)** - Generowanie kodu QR do udostępniania linku.

### Narzędzia developerskie

* **[ESLint](https://eslint.org/)** - Statyczna analiza kodu.
* **[Prettier](https://prettier.io/)** - Formatowanie kodu.
* **[vue-tsc](https://github.com/vuejs/language-tools/tree/master/packages/tsc)** - TypeScript checker dla Vue.

## 🛠️ Funkcje

* Obliczanie układu dla pojedynczego cięcia z podwójną wizualizacją SVG (Cięcie + Dystans cięcia).
* Dynamiczny układ gum: kolor niebieski w Cięciu, czerwony/jałowy w Dystansie (zależnie od grubości ≥ 4mm).
* Automatyczne obliczanie szczeliny cięcia (10% grubości, zakres 5-80%).
* Kod QR do szybkiego udostępniania linku do aplikacji.
* System powiadomień toast (success/error/warning).
* Zapamiętywanie parametrów w `localStorage`.
* Obliczanie konfiguracji dla wielu cięć (w przygotowaniu).
