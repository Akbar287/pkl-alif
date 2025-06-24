import { JenisKelamin, User } from "@/generated/prisma";
import { create } from "zustand";

type State = {
  user: User;
};

type Actions = {
  setUser: (user: User) => void;
};

const useCountStore = create<State & Actions>((set, get) => ({
  user: {
    UserId: "",
    Alamat: "",
    Nama: "",
    Email: "",
    Password: "",
    JenisKelamin: JenisKelamin.PRIA,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  },
  setUser: (user) => set({ user: user }),
}));

export default useCountStore;
