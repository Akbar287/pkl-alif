import { JenisKelamin } from "@/generated/prisma";

export interface ProfilInterface {
  UserId: string;
  Nama: string;
  Email: string;
  JenisKelamin: JenisKelamin;
  Alamat: string;
}

export interface UserMhsInterface {
  MhsId: string;
  RoleId: string;
  UserId: string;
  JenisKelamin: JenisKelamin;
  Nik: string;
  Nim: string;
  Alamat: string;
  AsalSekolah: string;
  Nama: string;
  Email: string;
  Password: string;
}
