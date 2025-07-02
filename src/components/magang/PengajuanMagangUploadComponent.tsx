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
import {
  AlertCircle,
  CheckIcon,
  Clock,
  FileArchive,
  FileWarning,
  PenIcon,
  TimerIcon,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  getFileBlobByNamafile,
  setFile,
} from "@/services/UploadDokumenServices";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { updateStatusKelengkapanDokumen } from "@/services/Magang/RiwayatMagangService";

const PengajuanMagangUploadComponent = ({
  dataServer,
  dataDiriServer,
  statusServer,
  fileUploadedServer,
}: {
  dataServer: {
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
  } | null;
  dataDiriServer: {
    Nama: string;
    Mhs: {
      UserId: string;
      MhsId: string;
      JenisKelamin: JenisKelamin;
      Nik: string;
      Nim: string;
      Alamat: string;
      AsalSekolah: string;
    }[];
    UserId: string;
    Email: string;
  } | null;
  statusServer: {
    Status: {
      Nama: string;
      StatusId: string;
    };
    CatatanPenilai: {
      Nama: string;
      Pesan: string;
    }[];
  } | null;
  fileUploadedServer: {
    Nama: string;
    MhsId: string;
    FileId: string;
    FileMhsId: string;
  }[];
}) => {
  const [data, setData] = React.useState(fileUploadedServer);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [fileUploadHelper, setFileUploadHelper] = React.useState<File | null>(
    null
  );
  const [statusHelper, setStatusHelper] = React.useState<string>(
    statusServer?.Status.Nama ?? ""
  );
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [openDialogPreview, setOpenDialogPreview] =
    React.useState<boolean>(false);
  const [previewTemp, setPreviewTemp] = React.useState<FileMhs | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = React.useState<string | null>(null);

  const preview = async (e: FileMhs) => {
    setPreviewTemp(e);
    setOpenDialogPreview(true);
    const res = await getFileBlobByNamafile(e.Nama);
    setPdfPreviewUrl(res);
  };

  const openToUpload = (FileId: string, MhsId: string | undefined) => {
    if (MhsId) {
      setPdfPreviewUrl(null);
      setFileUploadHelper(null);
      setOpenDialog(true);
      setPreviewTemp({
        FileMhsId: "",
        FileId: FileId,
        MhsId: MhsId,
        Nama: "",
      });
    }
  };

  const submitToCloud = () => {
    if (fileUploadHelper && previewTemp) {
      setLoading(true);
      setFile(fileUploadHelper, previewTemp.MhsId, previewTemp.FileId)
        .then(async (res) => {
          setData([...data, res]);
          toast("Data Dokumen Disimpan");
          setOpenDialog(false);
          setPdfPreviewUrl(null);
          setFileUploadHelper(null);
          setPreviewTemp(null);
          setLoading(false);
        })
        .catch((err) => {
          setErrorMessage("Error: " + err);
          toast("Error: " + err);
          setLoading(false);
        });
    }
  };

  const gotoNextStep = (FormasiId: string, MhsId: string | undefined) => {
    if (MhsId) {
      Swal.fire({
        title: "Lanjutkan Ke Proses berikutnya ?",
        text: "Anda tidak dapat mengubah dokumen yang telah di unggah ? Periksa kembali dokumen anda.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f45f24",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Lanjutkan",
        cancelButtonText: "Batalin",
      }).then((result) => {
        if (result.isConfirmed) {
          updateStatusKelengkapanDokumen(FormasiId, MhsId).then(() => {
            Swal.fire({
              title: "Sukses!",
              text: "Pengajuan Magang Anda sudah dilanjutkan ke proses Subbag.",
              icon: "success",
            });
            setStatusHelper("Kelengkapan Dokumen");
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
      {!statusServer ? (
        <></>
      ) : (
        statusServer.CatatanPenilai.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            <Card>
              <CardHeader>
                <CardTitle>Pesan</CardTitle>
                <CardDescription>Pesan dari Penilai</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableHead>Penilai</TableHead>
                    <TableHead>Isi Pesan</TableHead>
                  </TableHeader>
                  <TableBody>
                    {statusServer.CatatanPenilai.map((cp, index) => (
                      <TableRow key={index}>
                        <TableCell>{cp.Nama}</TableCell>
                        <TableCell>{cp.Pesan}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )
      )}
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
                    {!dataDiriServer ? "" : dataDiriServer?.Nama}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>
                    {!dataDiriServer ? "" : dataDiriServer?.Email}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>NIK</TableCell>
                  <TableCell>
                    {!dataDiriServer
                      ? ""
                      : dataDiriServer.Mhs.length == 0
                      ? ""
                      : dataDiriServer.Mhs[0].Nik ?? ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>NIM</TableCell>
                  <TableCell>
                    {!dataDiriServer
                      ? ""
                      : dataDiriServer.Mhs.length == 0
                      ? ""
                      : dataDiriServer.Mhs[0].Nim ?? ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Alamat</TableCell>
                  <TableCell>
                    {!dataDiriServer
                      ? ""
                      : dataDiriServer.Mhs.length == 0
                      ? ""
                      : dataDiriServer.Mhs[0].Alamat ?? ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Asal Sekolah / Universitas</TableCell>
                  <TableCell>
                    {!dataDiriServer
                      ? ""
                      : dataDiriServer.Mhs.length == 0
                      ? ""
                      : dataDiriServer.Mhs[0].AsalSekolah ?? ""}
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
                    {!dataServer ? "" : dataServer.Magang.Nama ?? ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Periode Awal</TableCell>
                  <TableCell>
                    {!dataServer
                      ? ""
                      : formatDateToIndonesian(
                          dataServer.Magang.PeriodeAwal as unknown as string
                        )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Periode Akhir</TableCell>
                  <TableCell>
                    {!dataServer
                      ? ""
                      : formatDateToIndonesian(
                          dataServer.Magang.PeriodeAkhir as unknown as string
                        )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Formasi</TableCell>
                  <TableCell>{!dataServer ? "" : dataServer.Nama}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Kebutuhan</TableCell>
                  <TableCell>
                    {!dataServer ? "" : dataServer.Kebutuhan + " orang"}
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
                  dataServer.File.map((f, index) => {
                    let x = data.find((file) => file.FileId === f.FileId);
                    return (
                      <TableRow key={f.FileId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{f.Nama}</TableCell>
                        <TableCell>
                          {x ? (
                            <Button
                              variant={"default"}
                              onClick={() => preview(x)}
                              className="cursor-pointer hover:scale-105 active:scale-95 transition-all duration-100 "
                            >
                              <FileArchive />
                            </Button>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        {statusHelper.match("Pendaftaran") && (
                          <TableCell>
                            <Button
                              variant={"default"}
                              onClick={() =>
                                openToUpload(
                                  f.FileId,
                                  dataDiriServer?.Mhs[0].MhsId
                                )
                              }
                              className="cursor-pointer hover:scale-105 active:scale-95 transition-all duration-100 "
                            >
                              <UploadCloud />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            {statusHelper.match("Pendaftaran") &&
              dataServer?.File.length === data.length && (
                <div className="w-full flex justify-center my-5">
                  <Button
                    variant={"default"}
                    onClick={() =>
                      gotoNextStep(
                        dataServer.FormasiId,
                        dataDiriServer?.Mhs[0].MhsId
                      )
                    }
                    className="cursor-pointer hover:scale-105 active:scale-95 transition-all duration-100 "
                  >
                    <CheckIcon />
                    Dokumen Saya Lengkap
                  </Button>
                </div>
              )}
          </CardFooter>
        </Card>
      </div>
      <DialogUploadDokumen
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        loading={loading}
        pdfPreviewUrl={pdfPreviewUrl}
        setPdfPreviewUrl={setPdfPreviewUrl}
        errorMessage={errorMessage}
        previewTemp={previewTemp}
        setPreviewTemp={setPreviewTemp}
        submitToCloud={submitToCloud}
        fileUploadHelper={fileUploadHelper}
        setFileUploadHelper={setFileUploadHelper}
      />
      <DialogPreviewDokumen
        data={previewTemp}
        pdfPreview={pdfPreviewUrl}
        openDialogPreview={openDialogPreview}
        setOpenDialogPreview={setOpenDialogPreview}
      />
    </div>
  );
};

export default PengajuanMagangUploadComponent;

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

function DialogUploadDokumen({
  openDialog,
  setOpenDialog,
  loading,
  pdfPreviewUrl,
  setPdfPreviewUrl,
  errorMessage,
  previewTemp,
  setPreviewTemp,
  submitToCloud,
  fileUploadHelper,
  setFileUploadHelper,
}: {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  pdfPreviewUrl: string | null;
  setPdfPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  errorMessage: string | null;
  previewTemp: FileMhs | null;
  setPreviewTemp: React.Dispatch<React.SetStateAction<FileMhs | null>>;
  submitToCloud: () => void;
  fileUploadHelper: File | null;
  setFileUploadHelper: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Unggah Dokumen Anda</DialogTitle>
          <DialogDescription>Unggah Dokumen Anda</DialogDescription>
        </DialogHeader>
        <div className="w-full justify-center md:justify-between">
          <Alert className="w-full mt-3" variant={"default"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              Memiliki Banyak File di Satu Jenis Dokumen ?
            </AlertTitle>
            <AlertDescription>
              Gabungkan beberapa file sejenis ke dalam satu PDF, lalu pilih
              jenis dokumennya
            </AlertDescription>
          </Alert>
          {errorMessage && (
            <Alert className="w-full mt-3" variant={"destructive"}>
              <FileWarning className="h-4 w-4" />
              <AlertTitle>Terdapat Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-4 py-4">
            {pdfPreviewUrl && (
              <iframe
                src={pdfPreviewUrl || ""}
                title="PDF Preview"
                width="100%"
                height="500px"
                className="border rounded"
              ></iframe>
            )}
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFileUploadHelper(file);
                  setPdfPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
          </div>
        </div>
        <DialogFooter className="mt-3">
          <Button
            className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
            variant={"default"}
            disabled={loading}
            type="button"
            onClick={() => submitToCloud()}
          >
            {loading ? (
              <>
                <TimerIcon />
                Loading
              </>
            ) : (
              <>
                <PenIcon />
                Simpan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
