import { z } from 'zod'

const isFiniteNumber = (val: number) => Number.isFinite(val)

export const panel1Schema = z.object({
  field1: z.coerce
    .number()
    .refine(isFiniteNumber, { message: 'Wpisz prawidłową liczbę dla szerokości cięcia!' })
    .min(20, { message: 'Szerokość cięcia musi być co najmniej 20mm!' })
    .max(1600, { message: 'Szerokość cięcia nie może przekraczać 1600mm!' }),
  field2: z.coerce
    .number()
    .refine(isFiniteNumber, { message: 'Wpisz prawidłową liczbę dla grubości materiału!' })
    .min(0.5, { message: 'Grubość materiału musi być co najmniej 0.5mm!' })
    .max(7, { message: 'Grubość materiału nie może przekraczać 7mm!' }),
  field3: z.string().min(1, { message: 'Wybierz rozmiar noża!' }),
  field4: z.coerce
    .number()
    .refine(isFiniteNumber, { message: 'Wpisz prawidłową liczbę dla szczeliny cięcia!' })
    .min(0.1, { message: 'Szczelina cięcia musi być co najmniej 0.1mm!' })
})
