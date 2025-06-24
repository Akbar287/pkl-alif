import FormasiComponent from "@/components/manajemen-data/FormasiComponent";
import { prisma } from "@/lib/prisma";
import React from "react";

const Page = async () => {
  const dataServer = await prisma.magang.findMany({
    select: { MagangId: true, Nama: true },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Formasi</h1>
      <FormasiComponent dataServer={dataServer} />
    </div>
  );
};

export default Page;
