"use client";

import { FileMhs, JenisKelamin } from "@/generated/prisma";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatDateToIndonesian } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Clock, FileArchive, PenIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { getFileBlobByNamafile } from "@/services/UploadDokumenServices";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import Swal from "sweetalert2";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { updateStatusApprovedKasubag } from "@/services/Magang/PersetujuanKasubagService";

const PersetujuanKasubagIdComponent = ({
  dataServer,
  dataDiriServer,
  statusServer,
  fileUploadedServer,
}: {
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
  const [statusHelper, setStatusHelper] = React.useState<string>(
    statusServer?.Status.Nama ?? ""
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openDialogPreview, setOpenDialogPreview] =
    React.useState<boolean>(false);
  const [previewTemp, setPreviewTemp] = React.useState<FileMhs | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<{
    Keterangan: string;
    Keputusan: boolean | null;
  }>({ Keterangan: "", Keputusan: null });

  const preview = async (e: FileMhs) => {
    setPreviewTemp(e);
    setOpenDialogPreview(true);
    const res = await getFileBlobByNamafile(e.Nama);
    setPdfPreviewUrl(res);
  };

  const gotoNextStep = () => {
    if (dataDiriServer?.Mhs.MhsId && dataServer) {
      Swal.fire({
        title: "Simpan Keputusan Anda ?",
        text: "Anda tidak dapat mengubah keputusan yang telah di simpan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f45f24",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Simpan",
        cancelButtonText: "Batalin",
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          updateStatusApprovedKasubag(
            dataServer.FormasiMhsId,
            form.Keterangan,
            form.Keputusan ?? false
          ).then(() => {
            setLoading(false);
            Swal.fire({
              title: "Sukses!",
              text: "Pengajuan Magang sudah dilanjutkan ke proses SK.",
              icon: "success",
            }).then((res) => {
              setStatusHelper(
                form.Keputusan ? "Approved Kasubag" : "Declined Kasubag"
              );
              router.push("/magang/persetujuan-kasubag");
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
            Status Saat ini adalah {statusHelper}
          </AlertDescription>
        </Alert>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Data Diri Anda</CardTitle>
            <CardDescription>
              Periksa Data Diri anda sebelum Ajukan Magang
            </CardDescription>
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
                  <TableCell>Asal Sekolah / Universitas</TableCell>
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
            <CardTitle>Formulir Pendaftaran</CardTitle>
            <CardDescription>
              Silakan Anda Upload File yang diperlukan
            </CardDescription>
            <CardAction></CardAction>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableHead>#</TableHead>
                <TableHead>Nama Dokumen</TableHead>
                <TableHead>Preview</TableHead>
                {statusHelper.match("Pendaftaran") && (
                  <TableHead>Aksi</TableHead>
                )}
              </TableHeader>
              <TableBody>
                {!dataServer ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      Tidak ada File yang diupload
                    </TableCell>
                  </TableRow>
                ) : (
                  dataServer.Formasi.File.map((f, index) => {
                    let x = fileUploadedServer.find(
                      (file) => file.FileId === f.FileId
                    );
                    return (
                      <TableRow key={f.FileId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{f.Nama}</TableCell>
                        <TableCell>
                          {x ? (
                            <Button
                              variant={"default"}
                              disabled={loading}
                              onClick={() => preview(x)}
                              className="cursor-pointer hover:scale-105 active:scale-95 transition-all duration-100 "
                            >
                              <FileArchive />
                            </Button>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Keputusan Anda</CardTitle>
            <CardDescription>
              Keputusan Anda untuk menerima atau menolak Calon Magang
            </CardDescription>
            <CardAction></CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Textarea
                placeholder="Silakan Masukan Pesan Anda (opsional)"
                value={form.Keterangan}
                onChange={(e) =>
                  setForm({ ...form, Keterangan: e.target.value })
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label
                  className={`border overflow-hidden rounded-xl p-4 shadow-sm cursor-pointer transition-all
              ${
                form.Keputusan === false
                  ? "border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100"
                  : "hover:shadow-md"
              }
            `}
                >
                  <input
                    type="checkbox"
                    disabled={loading}
                    className="mr-2 hidden"
                    checked={form.Keputusan == false}
                    onChange={() =>
                      setForm({
                        ...form,
                        Keputusan: false,
                      })
                    }
                  />
                  <div className="font-semibold">Tolak</div>
                  <div className="text-sm text-muted-foreground">
                    Saya Menolak Calon Magang
                  </div>
                </label>
                <label
                  className={`border overflow-hidden rounded-xl p-4 shadow-sm cursor-pointer transition-all
              ${
                form.Keputusan === true
                  ? "border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100"
                  : "hover:shadow-md"
              }
            `}
                >
                  <input
                    type="checkbox"
                    disabled={loading}
                    className="mr-2 hidden"
                    checked={form.Keputusan == true}
                    onChange={() =>
                      setForm({
                        ...form,
                        Keputusan: true,
                      })
                    }
                  />
                  <div className="font-semibold">Terima</div>
                  <div className="text-sm text-muted-foreground">
                    Saya Menerima Calon Magang
                  </div>
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-center">
              <Button
                variant={"default"}
                disabled={form.Keputusan === null || loading}
                onClick={() => gotoNextStep()}
                className="cursor-pointer hover:scale-105 active:scale-95 transition-all duration-100 "
              >
                <PenIcon />
                Simpan
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <DialogPreviewDokumen
        data={previewTemp}
        pdfPreview={pdfPreviewUrl}
        openDialogPreview={openDialogPreview}
        setOpenDialogPreview={setOpenDialogPreview}
      />
    </div>
  );
};

export default PersetujuanKasubagIdComponent;

function DialogPreviewDokumen({
  data,
  pdfPreview,
  openDialogPreview,
  setOpenDialogPreview,
}: {
  data: FileMhs | null;
  pdfPreview: string | null;
  openDialogPreview: boolean;
  setOpenDialogPreview: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={openDialogPreview} onOpenChange={setOpenDialogPreview}>
      <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Preview Dokumen</DialogTitle>
          <DialogDescription>Preview Dokumen</DialogDescription>
        </DialogHeader>
        {pdfPreview === null ? (
          <Skeleton className="w-full h-32" />
        ) : (
          <iframe
            src={pdfPreview || ""}
            title="PDF Preview"
            width="100%"
            height="500px"
            className="border rounded"
          ></iframe>
        )}
        <DialogFooter>
          <Button
            className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
            variant={"destructive"}
            onClick={() => {
              setOpenDialogPreview(false);
            }}
            type="button"
          >
            <X />
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
