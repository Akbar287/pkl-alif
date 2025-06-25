import PersetujuanKasubagIdComponent from "@/components/magang/PersetujuanKasubagIdComponent";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/provider/api";
import React from "react";

export default async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const data = await getSession();

  const dataDiriServer = await prisma.user.findFirst({
    select: {
      UserId: true,
      Nama: true,
      Email: true,
      Mhs: {
        select: {
          MhsId: true,
          UserId: true,
          JenisKelamin: true,
          Nik: true,
          Nim: true,
          Alamat: true,
          AsalSekolah: true,
        },
      },
    },
    where: {
      UserId: data?.user.id,
    },
  });
  const statusServer = await prisma.statusFormasiMhs.findFirst({
    select: {
      Status: {
        select: {
          StatusId: true,
          Nama: true,
        },
      },
    },
    where: {
      FormasiMhsId: id,
    },
  });
  const dataServer = await prisma.statusFormasiMhs.findFirst({
    select: {
      FormasiMhsId: true,
      Formasi: {
        select: {
          FormasiId: true,
          Nama: true,
          Kebutuhan: true,
          File: {
            select: {
              FileId: true,
              Nama: true,
            },
          },
          Magang: {
            select: {
              MagangId: true,
              Nama: true,
              PeriodeAwal: true,
              PeriodeAkhir: true,
            },
          },
        },
      },
    },
    where: {
      FormasiMhsId: id,
    },
  });

  const fileUploadedServer = await prisma.fileMhs.findMany({
    where: {
      MhsId: dataDiriServer?.Mhs[0].MhsId,
      FileId: {
        in: dataServer?.Formasi.File.map((x) => x.FileId),
      },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Program {dataServer?.Formasi.Magang.Nama} Formasi{" "}
        {dataServer?.Formasi.Nama}
      </h1>
      <PersetujuanKasubagIdComponent
        dataDiriServer={dataDiriServer}
        dataServer={dataServer}
        statusServer={statusServer}
        fileUploadedServer={fileUploadedServer}
      />
    </div>
  );
};
