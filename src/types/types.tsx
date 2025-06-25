import { JenisKelamin } from "@/generated/prisma";
import { type LucideIcon } from "lucide-react";

export interface MenuStoreProps {
  namaRole: string[];
  title: string;
  url: string;
  icon: LucideIcon;
  items: SubMenuStoreProps[] | null;
}

export interface MenuProps {
  title: string;
  url: string;
  icon: LucideIcon;
  items: SubMenuProps[] | null;
}

export interface SubMenuStoreProps {
  namaRole: string[];
  title: string;
  url: string;
}

export interface SubMenuProps {
  title: string;
  url: string;
}

export type UserTable = {
  UserId: string;
  Username: string;
  Nama: string;
  Email: string;
  NomorWa: string | null;
  Role: string | null;
};

export type PengajuanMagangPagination = {
  MagangId: string;
  FormasiId: string;
  NamaMagang: string;
  NamaFormasi: string;
  Kebutuhan: number;
  PeriodeAwal: Date;
  PeriodeAkhir: Date;
};

export type RiwayatMagangPagination = {
  MagangId: string;
  FormasiId: string;
  Status: string;
  NamaMagang: string;
  NamaFormasi: string;
  Kebutuhan: number;
  PeriodeAwal: Date;
  PeriodeAkhir: Date;
};

export type PersetujuanSubagPagination = {
  FormasiMhsId: string;
  MagangId: string;
  NamaMagang: string;
  PeriodeAwal: Date;
  PeriodeAkhir: Date;
  FormasiId: string;
  NamaFormasi: string;
  Kebutuhan: number;
  Status: string;
  Nama: string;
  JenisKelamin: JenisKelamin;
  Email: string;
  Nik: string;
  Nim: string;
  Alamat: string;
  AsalSekolah: string;
};

export type PersetujuanKasubagPagination = {
  FormasiMhsId: string;
  MagangId: string;
  NamaMagang: string;
  PeriodeAwal: Date;
  PeriodeAkhir: Date;
  FormasiId: string;
  NamaFormasi: string;
  Kebutuhan: number;
  Status: string;
  Nama: string;
  JenisKelamin: JenisKelamin;
  Email: string;
  Nik: string;
  Nim: string;
  Alamat: string;
  AsalSekolah: string;
};
