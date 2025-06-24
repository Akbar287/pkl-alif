import PenggunaComponent from "@/components/manajemen-data/PenggunaComponent";
import { prisma } from "@/lib/prisma";
import React from "react";

const Page = async () => {
  const roleServer = await prisma.role.findMany({
    select: { RoleId: true, Nama: true },
  });
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pengguna</h1>
      <PenggunaComponent roleServer={roleServer} />
    </div>
  );
};

export default Page;
