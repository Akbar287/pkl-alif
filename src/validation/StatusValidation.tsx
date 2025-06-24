import { z } from "zod";

export const StatusSkemaValidation = z.object({
  StatusId: z.string(),
  Nama: z
    .string()
    .nonempty("Nama diperlukan")
    .min(2, "Nama harus memiliki minimal 2 karakter"),
});

export type StatusFormValidation = z.infer<typeof StatusSkemaValidation>;
