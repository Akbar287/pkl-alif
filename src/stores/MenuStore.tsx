import { Role } from "@/generated/prisma";
import { MenuProps, MenuStoreProps } from "@/types/types";
import {
  Database,
  Home,
  LucideAlignVerticalJustifyStart,
  University,
} from "lucide-react";
import { create } from "zustand";

type State = {
  allMenu: MenuStoreProps[];
};

type Actions = {
  getMenuByRole: (role: Role) => MenuProps[];
  getAllMenu: () => MenuProps[];
};

const menu: MenuStoreProps[] = [
  {
    namaRole: ["Subag Umum", "Kasubag Umum", "Magang"],
    title: "Dashboard",
    url: "/",
    icon: Home,
    items: null,
  },
  {
    namaRole: ["Subag Umum"],
    title: "Manajemen Data",
    url: "/manajemen-data",
    icon: Database,
    items: [
      {
        namaRole: ["Subag Umum"],
        title: "Pengguna",
        url: "/manajemen-data/pengguna",
      },
      {
        namaRole: ["Subag Umum"],
        title: "Status",
        url: "/manajemen-data/status",
      },
      {
        namaRole: ["Subag Umum"],
        title: "Data Magang",
        url: "/manajemen-data/magang",
      },
      {
        namaRole: ["Subag Umum"],
        title: "Data Formasi",
        url: "/manajemen-data/formasi",
      },
      {
        namaRole: ["Subag Umum"],
        title: "Data File",
        url: "/manajemen-data/file",
      },
    ],
  },
  {
    namaRole: ["Subag Umum", "Magang", "Kasubag Umum"],
    title: "Magang",
    url: "/magang",
    icon: LucideAlignVerticalJustifyStart,
    items: [
      {
        namaRole: ["Magang"],
        title: "Pengajuan",
        url: "/magang/pengajuan",
      },
      {
        namaRole: ["Magang"],
        title: "Riwayat",
        url: "/magang/riwayat",
      },
      {
        namaRole: ["Subag Umum"],
        title: "Persetujuan Subbag",
        url: "/magang/persetujuan-subag",
      },
      {
        namaRole: ["Kasubag Umum"],
        title: "Persetujuan Kasubag",
        url: "/magang/persetujuan-kasubag",
      },
    ],
  },
  {
    namaRole: ["Subag Umum", "Magang"],
    title: "Penerbitan SK",
    url: "/penerbitan-sk",
    icon: University,
    items: [
      {
        namaRole: ["Subag Umum", "Magang"],
        title: "Sk Magang",
        url: "/penerbitan-sk/sk",
      },
    ],
  },
];

const useCountStore = create<State & Actions>((set, get) => ({
  allMenu: menu,
  getMenuByRole: (role) =>
    menu
      .filter((m) => m.namaRole.includes(role.Nama))
      .map((m) => ({
        title: m.title,
        url: m.url,
        icon: m.icon,
        items:
          m.items
            ?.filter((i) => i.namaRole.includes(role.Nama))
            .map((i) => ({
              title: i.title,
              url: i.url,
            })) || null,
      })),
  getAllMenu: () =>
    menu.map((m) => ({
      title: m.title,
      url: m.url,
      icon: m.icon,
      items:
        m.items !== null
          ? m.items.map((mi) => ({
              title: mi.title,
              url: mi.url,
            }))
          : null,
    })),
}));

export default useCountStore;
