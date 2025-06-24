import { Role } from "@/generated/prisma";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string,
      nama: string,
      email: string,
      roles: Role[]
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string,
      nama: string,
      email: string,
      roles: Role[]
  }
}
