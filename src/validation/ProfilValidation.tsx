import { JenisKelamin } from "@/generated/prisma";
import { z } from "zod";

export const ProfilSkemaValidation = z.object({
  UserId: z.string().optional(),
  MhsId: z.string().optional(),
  RoleId: z.string().optional(),
  Nama: z
    .string()
    .nonempty("Nama diperlukan")
    .min(8, "Nama Pengguna harus memiliki minimal 8 karakter")
    .max(16, "Nama Pengguna harus memiliki maksimal 16 karakter"),
  Email: z
    .string()
    .nonempty("Nama Pengguna diperlukan")
    .email("Format Email tidak sesuai"),
  Password: z
    .string()
    .nonempty("Kata Sandi diperlukan")
    .min(8, "Kata Sandi harus memiliki minimal 8 karakter"),
  JenisKelamin: z
    .enum([JenisKelamin.PRIA, JenisKelamin.WANITA])
    .default("PRIA")
    .optional(),
  Nik: z
    .string()
    .nonempty("NIK diperlukan")
    .length(16, "NIK Pengguna harus memiliki 16 karakter"),
  Nim: z
    .string()
    .nonempty("NIM diperlukan")
    .min(3, "NIM Pengguna harus memiliki minimal 3 karakter")
    .max(32, "NIM Pengguna harus memiliki maksimal 32 karakter"),
  Alamat: z
    .string()
    .nonempty("Alamat diperlukan")
    .min(1, "Alamat Pengguna harus memiliki minimal 1 karakter")
    .max(255, "Alamat Pengguna harus memiliki maksimal 255 karakter"),
  AsalSekolah: z
    .string()
    .nonempty("Nama diperlukan")
    .min(1, "Nama Pengguna harus memiliki minimal 1 karakter")
    .max(255, "Nama Pengguna harus memiliki maksimal 255 karakter"),
});

export type ProfilFormValidation = z.infer<typeof ProfilSkemaValidation>;
