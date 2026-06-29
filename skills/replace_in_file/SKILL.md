---
name: replace-in-file
description: Bezpieczna edycja istniejących plików za pomocą narzędzia replace_in_file. Używaj do targeted changes w istniejących plikach.
version: 1.0
---

## Cel
Edycja wybranych fragmentów istniejącego pliku bez nadpisywania całej zawartości.

## Kiedy używać
- Modyfikacja kilku linii w istniejącym pliku
- Dodanie nowej funkcji do istniejącego komponentu
- Zmiana nazw zmiennych w konkretnych miejscach
- Aktualizacja importów i referencji
- Gdy < 30% pliku ulega zmianie

## Instrukcje krok po kroku
1. Przeczytaj plik za pomocą `read_file` aby poznać aktualną zawartość
2. Zidentyfikuj dokładnie linie do zmiany
3. Stwórz SEARCH/REPLACE bloki w formacie:
   ```
   ------- SEARCH
   [dokładna zawartość do znalezienia — pełne linie]
   =======
   [nowa zawartość]
   +++++++ REPLACE
   ```
4. Użyj narzędzia `replace_in_file` z blokami
5. Zweryfikuj wynik za pomocą `read_file`

## Best Practices
- **Maksymalna długość SEARCH bloku: 10-15 linii** — im krótszy, tym bezpieczniejszy
- **Używaj unikalnego kontekstu** — SEARCH musi jednoznacznie identyfikować fragment
- **Stosuj wiele małych bloków zamiast jednego dużego** — max 3-4 bloki na wywołanie
- **Zawsze wklejaj pełne linie** — nigdy nie używaj fragmentów w połowie linii
- **Kolejność bloków: od góry do dołu pliku**
- **Uwzględnij białe znaki** — SEARCH musi pasować znak do znaku (spacje, tabulatory, newline)
- **Używaj parametru task_progress** do śledzenia postępu

## Common Pitfalls

### Błąd "Invalid API Response" — przyczyny
| Przyczyna | Rozwiązanie |
|---|---|
| SEARCH blok > 20 linii | Skróć do 10-15 linii, użyj bardziej unikalnego kontekstu |
| Wiele SEARCH/REPLACE bloków (>5) | Podziel na kilka osobnych wywołań |
| Białe znaki niepasują | Skopiuj dokładną zawartość z read_file |
| Brak zamknięcia `+++++++ REPLACE` | Zawsze dodaj marker zamknięcia |
| Brak zamknięcia `</diff>` | Upewnij się, że `<diff>` ma zamknięcie `</diff>` |

### Pattern błędu
```
Invalid API Response: The provider returned an empty or unparsable response.
```

### Jak naprawić
1. Skróć SEARCH blok do minimum (3-5 linii)
2. Upewnij się, że wszystkie tagi XML są zamknięte
3. Spróbuj ponownie z prostszym SEARCH

## Example: Good Usage
```xml
<replace_in_file>
<path>src/components/App.vue</path>
<diff>
------- SEARCH
import React from 'react';
=======
import React, { useState } from 'react';
+++++++ REPLACE

------- SEARCH
function handleSubmit() {
  saveData();
  setLoading(false);
}

=======
+++++++ REPLACE
</diff>
</replace_in_file>
```

## Example: Bad Usage — SEARCH za długi
```xml
<!-- BAD — SEARCH zawiera za dużo niezmienionych linii -->
<replace_in_file>
<path>src/components/App.vue</path>
<diff>
------- SEARCH
import React from 'react';
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import { Notifications } from './components/Notifications';
import { Search } from './components/Search';
import { Modal } from './components/Modal';
import { Button } from './components/Button';
=======
import React, { useState, useEffect } from 'react';
...
+++++++ REPLACE
</diff>
</replace_in_file>
```

## Example: Bad Usage — brak zamknięcia tagów
```xml
<!-- BAD — brak </diff> i </replace_in_file> -->
<replace_in_file>
<path>src/components/App.vue</path>
<diff>
------- SEARCH
old
=======
new
+++++++ REPLACE

<!-- GOOD — wszystkie tagi zamknięte -->
<replace_in_file>
<path>src/components/App.vue</path>
<diff>
------- SEARCH
old
=======
new
+++++++ REPLACE
</diff>
</replace_in_file>
```

## Example: Good Usage — wiele małych bloków
```xml
<!-- Zamiast jednego dużego bloku, użyj kilku małych -->
<replace_in_file>
<path>src/components/App.vue</path>
<diff>
------- SEARCH
import React from 'react';
=======
import React, { useState } from 'react';
+++++++ REPLACE

------- SEARCH
const [count, setCount] = useState(0);
=======
const [count, setCount] = useState(0);
const [name, setName] = useState('');
+++++++ REPLACE

------- SEARCH
return <div>{count}</div>;
=======
return (
  <div>
    <span>{count}</span>
    <input value={name} onChange={(e) => setName(e.target.value)} />
  </div>
);
+++++++ REPLACE
</diff>
</replace_in_file>
```

## Debugging Checklist
- [ ] Czy SEARCH pasuje dokładnie do zawartości pliku (znaku do znaku)?
- [ ] Czy SEARCH blok ma ≤ 15 linii?
- [ ] Czy każdy SEARCH ma odpowiadający mu REPLACE?
- [ ] Czy wszystkie tagi XML są zamknięte?
- [ ] Czy bloki są w kolejności od góry do dołu pliku?
- [ ] Czy użyłem pełnych linii (bez fragmentów w połowie linii)?