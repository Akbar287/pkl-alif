import { z } from "zod";

export const LoginSkemaValidation = z.object({
  email: z
    .string()
    .nonempty("Email diperlukan")
    .email("Format Email tidak sesuai"),
  password: z
    .string()
    .nonempty("Kata Sandi diperlukan")
    .min(8, "Kata Sandi harus memiliki minimal 8 karakter"),
});

export type LoginFormValidation = z.infer<typeof LoginSkemaValidation>;
