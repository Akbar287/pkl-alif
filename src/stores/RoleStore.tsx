import { Role } from "@/generated/prisma";
import { create } from "zustand";

type State = {
  role: Role[];
};

type Actions = {
  cekRole: (roleId: string) => boolean;
  setRole: (role: Role[]) => void;
};

const useCountStore = create<State & Actions>((set, get) => ({
  role: [],
  permission: [],
  cekRole: (roleId: string) => get().role.some((r) => r.RoleId === roleId),
  setRole: (role) => set({ role: role }),
}));

export default useCountStore;
