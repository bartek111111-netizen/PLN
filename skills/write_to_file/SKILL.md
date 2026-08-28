---
name: write-to-file
description: Tworzenie nowych plików lub nadpisywanie istniejących w całości. Używaj gdy tworzenie od zera lub zmiany > 30% pliku.
version: 1.0
---

## Cel
Tworzenie nowych plików lub nadpisywanie całej zawartości istniejących plików.

## Kiedy używać
- Tworzenie nowego pliku od zera
- Nadpisywanie dużych plików konfiguracyjnych
- Generowanie boilerplate code
- Gdy > 30% pliku ulega zmianie
- Gdy struktura pliku zmienia się fundamentalnie

## Instrukcje krok po kroku
1. Przygotuj PEŁNĄ zawartość pliku — wszystkie linie, wszystkie sekcje
2. Użyj narzędzia `write_to_file` z complete content
3. Zweryfikuj wynik za pomocą `read_file`

## Best Practices
- **Zawsze wklejaj PEŁNĄ zawartość** — nigdy nie pomijaj fragmentów, nawet jeśli "tylko zmieniasz jedną linię"
- **Używaj write_to_file zamiast replace_in_file gdy > 30% pliku się zmienia**
- **Zwracaj uwagę na auto-formatting** — Prettier może zmienić formatowanie po zapisie
- **Twórz katalogi przez write_to_file** — narzędzie automatycznie tworzy katalogi rodzice
- **Używaj parametru task_progress** do śledzenia postępu

## Common Pitfalls

### Błąd "Invalid API Response" — przyczyny
| Przyczyna | Rozwiązanie |
|---|---|
| Za długa zawartość pliku (>500 linii) | Podziel na mniejsze pliki |
| Nieprawidłowe znaki w content | Unikaj znaków kontrolnych, używaj escape sequences |
| Brak zamknięcia `</content>` | Zawsze zamykaj tag content |

### Pattern błędu
```
Invalid API Response: The provider returned an empty or unparsable response.
```

### Jak naprawić
1. Sprawdź czy content nie zawiera niezamkniętych tagów XML
2. Skróć plik — podziel na mniejsze moduły
3. Upewnij się, że content nie zawiera `</content>` jako tekstu zwykłego

## Example: Good Usage — nowy plik
```xml
<write_to_file>
<path>src/components/NewComponent.vue</path>
<content><template>
  <div class="component">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
}

defineProps<Props>()
</script>

<style scoped>
.component {
  padding: 1rem;
}
</style>
</content>
</write_to_file>
```
