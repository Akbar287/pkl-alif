import { z } from "zod";

export const FileSkemaValidation = z.object({
  FileId: z.string().optional(),
  FormasiId: z.string().optional(),
  Nama: z
    .string()
    .nonempty("Nama diperlukan")
    .min(1, "Nama File harus memiliki minimal 1 karakter")
    .max(64, "Nama File harus memiliki maksimal 64 karakter"),
});

export type FileFormValidation = z.infer<typeof FileSkemaValidation>;
