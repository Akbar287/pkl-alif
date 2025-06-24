import { z } from "zod";

export const FormasiSkemaValidation = z.object({
  FormasiId: z.string(),
  MagangId: z.string(),
  Nama: z
    .string()
    .nonempty("Nama diperlukan")
    .min(8, "Nama Formasi harus memiliki minimal 8 karakter")
    .max(16, "Nama Formasi harus memiliki maksimal 16 karakter"),
  Kebutuhan: z.number().nonnegative("Kebutuhan harus nilai positif"),
});

export type FormasiFormValidation = z.infer<typeof FormasiSkemaValidation>;
