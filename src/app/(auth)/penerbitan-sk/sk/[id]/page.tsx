import { CertificateDocument } from "@/components/penerbitan-sk/GeneratePdf";
import PenerbitanSkIdComponent from "@/components/penerbitan-sk/PenerbitanSkIdComponent";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/provider/api";
import { renderToStream } from "@react-pdf/renderer";
import path from "path";
import fs from "fs/promises";
import React from "react";
import QRCode from "qrcode";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export default async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await getSession();

  const dataDiriServer = await prisma.statusFormasiMhs.findFirst({
    select: {
      Mhs: {
        select: {
          User: {
            select: {
              UserId: true,
              Nama: true,
              Email: true,
            },
          },
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
      FormasiMhsId: id,
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
      MhsId: dataDiriServer?.Mhs.MhsId,
      FileId: {
        in: dataServer?.Formasi.File.map((x) => x.FileId),
      },
    },
  });

  let fileSk = await prisma.fileSk.findFirst({
    select: {
      FormasiMhsId: true,
      Nama: true,
      KodeQr: true,
      CreatedAt: true,
    },
    where: {
      FormasiMhsId: id,
    },
  });

  if (!fileSk) {
    const qrCodeImage = await QRCode.toDataURL(
      BASE_URL + "/cek-sk/" + dataServer?.FormasiMhsId
    );
    const pdfStream = await renderToStream(
      <CertificateDocument
        dataDiriServer={dataDiriServer}
        dataServer={dataServer}
        statusServer={statusServer}
        fileUploadedServer={fileUploadedServer}
        session={session}
        qrCodeImage={qrCodeImage}
      />
    );

    const chunks: Uint8Array[] = [];
    for await (const chunk of pdfStream as any) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    try {
      const pdfsDir = path.join(process.cwd(), "uploads");
      await fs.mkdir(pdfsDir, { recursive: true });
      const sanitizedInternName = !dataDiriServer
        ? "-"
        : dataDiriServer.Mhs.User.Email.replace(/\s+/g, "_");
      const filename = `Surat_Keterangan_${sanitizedInternName}_${id}.pdf`;
      const filePath = path.join(pdfsDir, filename);

      await fs.writeFile(filePath, pdfBuffer);

      fileSk = await prisma.fileSk.create({
        select: {
          FormasiMhsId: true,
          Nama: true,
          KodeQr: true,
          CreatedAt: true,
        },
        data: {
          FormasiMhsId: id,
          Nama: filename,
          KodeQr: qrCodeImage,
          CreatedAt: new Date(),
        },
      });
    } catch (saveError) {
      console.error("Gagal menyimpan file PDF ke server:", saveError);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">SK</h1>
      <PenerbitanSkIdComponent
        dataDiriServer={dataDiriServer}
        dataServer={dataServer}
        statusServer={statusServer}
        fileUploadedServer={fileUploadedServer}
        fileSk={fileSk}
      />
    </div>
  );
};
