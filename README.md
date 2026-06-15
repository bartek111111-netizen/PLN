# PLNoże - Kalkulator Konfiguracji Noży

Ten program służy do obliczania optymalnych konfiguracji noży do maszyn do cięcia w płytach stalowych. Pozwala na szybkie ustalenie układu elementów (noży, gum i dystansów) dla zadanej szerokości cięcia oraz grubości materiału.

## 🚀 Technologie

* **[Vue.js 3](https://vuejs.org/)** - Framework JavaScript do budowy interfejsu użytkownika.
* **[Vite](https://vitejs.dev/)** - Szybkie narzędzie do budowania i serwowania aplikacji.
* **[TypeScript](https://www.typescriptlang.org/)** - Typowanie statyczne w całym projekcie (strict mode).
* **[Pinia](https://pinia.vuejs.org/)** - Zarządzanie stanem aplikacji (store do kalkulatora i powiadomień).
* **[Zod](https://zod.dev/)** - Walidacja danych wejściowych (schema `panel1Schema`).
* **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS do nowoczesnego i responsywnego stylizowania.
* **[PostCSS](https://postcss.org/)** - Narzędzie do przetwarzania CSS.
* **[qrcode](https://www.npmjs.com/package/qrcode)** - Generowanie kodu QR do udostępniania linku.

## 📁 Struktura projektu

```
src/
├── main.ts                # Punkt startowy aplikacji (Vue + Pinia)
├── App.vue                # Komponent główny z formularzami i SVG
├── style.css              # Globalne style + Tailwind
├── components/
│   ├── Toast.vue          # Komponent powiadomień toast
│   └── QRModal.vue        # Modal z kodem QR
├── stores/
│   ├── calculatorStore.ts # Logika kalkulacji, układy noży/gum/dystansów
│   └── toastStore.ts      # Zarządzanie powiadomeniami
├── validation/
│    └── panel1Schema.ts   # Schema walidacji Zod dla Panelu 1
```

## 🛠️ Funkcje

* Obliczanie układu dla pojedynczego cięcia z podwójną wizualizacją SVG (Cięcie + Dystans cięcia).
* Dynamiczny układ gum: kolor niebieski w Cięciu, czerwony/jałowy w Dystansie (zależnie od grubości ≥ 4mm).
* Automatyczne obliczanie szczeliny cięcia (10% grubości, zakres 5-80%).
* Kod QR do szybkiego udostępniania linku do aplikacji.
* System powiadomień toast (success/error/warning).
* Zapamiętywanie parametrów w `localStorage`.
* Obliczanie konfiguracji dla wielu cięć (w przygotowaniu).
