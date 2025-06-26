"use client";

import { JenisKelamin } from "@/generated/prisma";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { formatDateToIndonesian } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ChevronRight, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import Swal from "sweetalert2";
import {
  getFileSkBlobByNamafile,
  updateStatusPenerbitanSk,
} from "@/services/Magang/PenerbitanSkService";
import { useRouter } from "next/navigation";

const PenerbitanSkIdComponent = ({
  dataServer,
  dataDiriServer,
  statusServer,
  fileUploadedServer,
  fileSk,
}: {
  fileSk: {
    FormasiMhsId: string;
    Nama: string;
    CreatedAt: Date;
    KodeQr: string;
  } | null;
  dataServer: {
    FormasiMhsId: string;
    Formasi: {
      Nama: string;
      Magang: {
        MagangId: string;
        Nama: string;
        PeriodeAwal: Date;
        PeriodeAkhir: Date;
      };
      FormasiId: string;
      Kebutuhan: number;
      File: {
        Nama: string;
        FileId: string;
      }[];
    };
  } | null;
  dataDiriServer: {
    Mhs: {
      User: {
        Nama: string;
        UserId: string;
        Email: string;
      };
      MhsId: string;
      UserId: string;
      JenisKelamin: JenisKelamin;
      Nik: string;
      Nim: string;
      Alamat: string;
      AsalSekolah: string;
    };
  } | null;
  statusServer: {
    Status: {
      Nama: string;
      StatusId: string;
    };
  } | null;
  fileUploadedServer: {
    Nama: string;
    MhsId: string;
    FileId: string;
    FileMhsId: string;
  }[];
}) => {
  const router = useRouter();
  const [pdfPreviewUrl, setPdfPreviewUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const preview = async (e: string) => {
    const res = await getFileSkBlobByNamafile(e);
    setPdfPreviewUrl(res);
  };
  React.useEffect(() => {
    if (fileSk) preview(fileSk.Nama);
  }, []);

  const gotoNextStep = () => {
    if (dataServer) {
      Swal.fire({
        title: "Finalisasi ?",
        text: "Calon Magang dapat melihat File SK ini.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f45f24",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Lanjutkan",
        cancelButtonText: "Batalin",
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          updateStatusPenerbitanSk(dataServer.FormasiMhsId).then(() => {
            setLoading(false);
            Swal.fire({
              title: "Sukses!",
              text: "Status sudah final dan Calon Magang dapat melihat SK ini.",
              icon: "success",
            }).then((res) => {
              router.push("/penerbitan-sk/sk");
            });
          });
        }
      });
    }
  };
  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-1 gap-3">
        <Alert>
          <Clock />
          <AlertTitle>Status</AlertTitle>
          <AlertDescription>
            Status Saat ini adalah {statusServer?.Status.Nama}
          </AlertDescription>
        </Alert>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Data Diri Anda</CardTitle>
            <CardDescription>Ini adalah informasi umum</CardDescription>
            <CardAction></CardAction>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Nama</TableCell>
                  <TableCell>
                    {!dataDiriServer ? "" : dataDiriServer?.Mhs.User.Nama}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>
                    {!dataDiriServer ? "" : dataDiriServer?.Mhs.User.Email}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>NIK</TableCell>
                  <TableCell>
                    {!dataDiriServer ? "" : dataDiriServer.Mhs.Nik ?? ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>NIM</TableCell>
                  <TableCell>
                    {!dataDiriServer ? "" : dataDiriServer.Mhs.Nim ?? ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Alamat</TableCell>
                  <TableCell>
                    {!dataDiriServer ? "" : dataDiriServer.Mhs.Alamat ?? ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Asal Sekolah</TableCell>
                  <TableCell>
                    {!dataDiriServer
                      ? ""
                      : dataDiriServer.Mhs.AsalSekolah ?? ""}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Program Magang</CardTitle>
            <CardDescription>
              Periksa Kembali Program Magang Yang anda Pilih
            </CardDescription>
            <CardAction></CardAction>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Nama</TableCell>
                  <TableCell>
                    {!dataServer ? "" : dataServer.Formasi.Magang.Nama ?? ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Periode Awal</TableCell>
                  <TableCell>
                    {!dataServer
                      ? ""
                      : formatDateToIndonesian(
                          dataServer.Formasi.Magang
                            .PeriodeAwal as unknown as string
                        )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Periode Akhir</TableCell>
                  <TableCell>
                    {!dataServer
                      ? ""
                      : formatDateToIndonesian(
                          dataServer.Formasi.Magang
                            .PeriodeAkhir as unknown as string
                        )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Formasi</TableCell>
                  <TableCell>
                    {!dataServer ? "" : dataServer.Formasi.Nama}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Kebutuhan</TableCell>
                  <TableCell>
                    {!dataServer ? "" : dataServer.Formasi.Kebutuhan + " orang"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Surat Keputusan</CardTitle>
            <CardDescription>Ini adalah Surat Keputusan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full flex justify-center">
              {fileSk ? (
                <React.Fragment>
                  {pdfPreviewUrl === null ? (
                    <Skeleton className="w-full h-32" />
                  ) : (
                    <iframe
                      src={pdfPreviewUrl || ""}
                      title="PDF Preview"
                      width="100%"
                      height="500px"
                      className="border rounded"
                    ></iframe>
                  )}
                </React.Fragment>
              ) : (
                <h1 className="font-semibold">Belum ada Surat Keputusan</h1>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-center">
              <Button
                className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                variant={"default"}
                disabled={loading}
                onClick={() => {
                  gotoNextStep();
                }}
                type="button"
              >
                Status Selesai
                <ChevronRight />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PenerbitanSkIdComponent;
