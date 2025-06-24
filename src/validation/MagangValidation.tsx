import { z } from "zod";

export const MagangSkemaValidation = z.object({
  MagangId: z.string().optional(),
  Nama: z
    .string()
    .nonempty("Nama diperlukan")
    .min(8, "Nama Magang harus memiliki minimal 8 karakter")
    .max(66, "Nama Magang harus memiliki maksimal 64 karakter"),
  PeriodeAwal: z.date(),
  PeriodeAkhir: z.date(),
});

export type MagangFormValidation = z.infer<typeof MagangSkemaValidation>;
