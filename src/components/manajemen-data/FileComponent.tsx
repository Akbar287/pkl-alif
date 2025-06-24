"use client";
import { cn, formatDateToIndonesian, replaceItemAtIndex } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  PenIcon,
  Timer,
} from "lucide-react";
import Swal from "sweetalert2";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  FileFormValidation,
  FileSkemaValidation,
} from "@/validation/FileValidation";
import {
  deleteFile,
  getFilePagination,
  setFile,
  updateFile,
} from "@/services/ManajemenData/FileServices";
import { File } from "@/generated/prisma";

const FileComponent = ({
  dataServer,
}: {
  dataServer: {
    Nama: string;
    MagangId: string;
    Formasi: {
      FormasiId: string;
      Nama: string;
    }[];
  }[];
}) => {
  const [selectedData, setSelectedData] = React.useState<{
    MagangId: string;
    NamaMagang: string;
    NamaFormasi: string;
    FormasiId: string;
  }>({ MagangId: "", NamaMagang: "", FormasiId: "", NamaFormasi: "" });
  const [dataFile, setDataFile] = React.useState<File[]>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [paginationState, setPaginationState] = React.useState<{
    page: number;
    limit: number;
    totalElement: number;
    totalPage: number;
    isFirst: boolean;
    isLast: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
  }>({
    page: 1,
    limit: 5,
    totalElement: 0,
    totalPage: 0,
    isFirst: false,
    isLast: false,
    hasNext: false,
    hasPrevious: false,
  });
  const [search, setSearch] = React.useState<string>("");
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [titleDialog, setTitleDialog] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const form = useForm<FileFormValidation>({
    resolver: zodResolver(FileSkemaValidation),
    defaultValues: {
      FileId: "",
      FormasiId: "",
      Nama: "",
    },
  });
  const onSubmit = async (data: FileFormValidation) => {
    setLoading(true);

    if (titleDialog === "Ubah File") {
      await updateFile({
        FileId: data.FileId ?? "",
        FormasiId: data.FormasiId ?? "",
        Nama: data.Nama,
      })
        .then((res) => {
          toast("Data File berhasil diubah");
          let idx = dataFile.findIndex((r) => r.FileId === data.FileId);
          setDataFile(replaceItemAtIndex(dataFile, idx, res));
          setOpenDialog(false);
          setLoading(false);
        })
        .catch((err) => {
          toast("Data File gagal diubah. Error: " + err);
          setLoading(false);
        });
    } else {
      await setFile({
        FileId: "",
        FormasiId: data.FormasiId ?? "",
        Nama: data.Nama,
      })
        .then((res) => {
          toast("Data File berhasil ditambah");
          setDataFile([...dataFile, res]);
          setLoading(false);
          setOpenDialog(false);
        })
        .catch((err) => {
          toast("Data File gagal ditambah. Error: " + err);
          setLoading(false);
        });
    }
  };

  React.useEffect(() => {
    if (selectedData.FormasiId) {
      setLoading(true);
      getFilePagination(
        paginationState.page,
        paginationState.limit,
        search,
        selectedData.FormasiId
      )
        .then((res) => {
          setDataFile(res.data);
          setLoading(false);
          setPaginationState({
            page: res.page,
            limit: res.limit,
            totalElement: res.totalElement,
            totalPage: res.totalPage,
            isFirst: res.isFirst,
            isLast: res.isLast,
            hasNext: res.hasNext,
            hasPrevious: res.hasPrevious,
          });
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [
    paginationState.page,
    search,
    paginationState.limit,
    selectedData.FormasiId,
  ]);

  const buatData = () => {
    form.reset();
    form.setValue("FormasiId", selectedData.FormasiId);
    setTitleDialog("Tambah File");
    setOpenDialog(true);
  };
  const ubahData = (jd: File) => {
    form.setValue("FileId", String(jd.FileId));
    form.setValue("FormasiId", jd.FormasiId);
    form.setValue("Nama", String(jd.Nama));
    setTitleDialog("Ubah File");
    setOpenDialog(true);
  };
  const hapusData = (jd: File) => {
    Swal.fire({
      title: "Ingin Hapus File " + jd.Nama + " ?",
      text: "Aksi ini tidak dapat di undo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f45f24",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batalin",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFile(jd.FileId).then(() => {
          setDataFile(dataFile.filter((r) => r.FileId !== jd.FileId));
          Swal.fire({
            title: "Terhapus!",
            text: "Data sudah dihapus.",
            icon: "success",
          });
        });
      }
    });
  };
  const columns: ColumnDef<File>[] = [
    {
      accessorKey: "Nama",
      header: "Nama",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Nama")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const jd = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(jd.FileId)}
              >
                Copy File ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => ubahData(jd)}>
                Ubah Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => hapusData(jd)}>
                Hapus Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: dataFile,
    columns,
    manualPagination: true,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: paginationState.totalPage,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
  });
  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <Select
          value={selectedData.MagangId}
          onValueChange={(value) => {
            const x = dataServer.find((y) => y.MagangId === value);
            setSelectedData({
              MagangId: value,
              NamaMagang: x ? x.Nama : "",
              NamaFormasi: "",
              FormasiId: "",
            });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Magang" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Pilih Magang</SelectLabel>
              {dataServer.map((l, idx) => (
                <SelectItem value={l.MagangId} key={idx}>
                  {l.Nama}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={selectedData.FormasiId}
          onValueChange={(value) => {
            const temp = dataServer
              .find((x) => x.MagangId === selectedData.MagangId)
              ?.Formasi.find((y) => y.FormasiId === value);
            setSelectedData({
              ...selectedData,
              FormasiId: value,
              NamaFormasi: temp ? temp.Nama : "",
            });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Formasi" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Pilih Formasi</SelectLabel>
              {dataServer
                .find((x) => x.MagangId === selectedData.MagangId)
                ?.Formasi.map((l, idx) => (
                  <SelectItem value={l.FormasiId} key={idx}>
                    {l.Nama}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {selectedData.FormasiId === "" ? (
        <div className="w-full flex justify-center h-52 items-center">
          <h1 className="font-semibold">Silakan Pilih Magang dan Formasi</h1>
        </div>
      ) : (
        <React.Fragment>
          <div className="flex items-center py-4">
            <Input
              placeholder="Cari Data ..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="max-w-sm"
            />
            <div className="w-full justify-end flex">
              <Button className="mr-2" onClick={() => buatData()}>
                Tambah
              </Button>
              <Select
                value={String(paginationState.limit)}
                onValueChange={(value) =>
                  setPaginationState({
                    ...paginationState,
                    limit: Number(value),
                  })
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Pilih Limit Data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pilih Limit Data</SelectLabel>
                    {[5, 10, 20, 50, 75, 100].map((l, idx) => (
                      <SelectItem value={String(l)} key={idx}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: paginationState.limit }).map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[60%]" />
                    <Skeleton className="h-4 w-[40%]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        Tidak Ada Data.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Menampilkan{" "}
              {paginationState.page * paginationState.limit -
                paginationState.limit +
                1}{" "}
              -{" "}
              {paginationState.totalElement <
              paginationState.page * paginationState.limit
                ? paginationState.totalElement
                : paginationState.page * paginationState.limit}{" "}
              dari {paginationState.totalElement} Data.
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPaginationState({
                    ...paginationState,
                    page: paginationState.page - 1,
                  });
                }}
                disabled={!paginationState.hasPrevious}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from(
                { length: paginationState.totalPage },
                (_, i) => i + 1
              ).map((p) => (
                <Button
                  key={p}
                  variant={p === paginationState.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (paginationState.page !== p) {
                      setPaginationState({
                        ...paginationState,
                        page: p,
                      });
                    }
                  }}
                >
                  {p}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPaginationState({
                    ...paginationState,
                    page: paginationState.page + 1,
                  });
                }}
                disabled={!paginationState.hasNext}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </React.Fragment>
      )}
      <SheetManageData
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onSubmit={onSubmit}
        loading={loading}
        form={form}
        titleDialog={titleDialog}
        selectedData={selectedData}
      />
    </div>
  );
};

export default FileComponent;

export function SheetManageData({
  openDialog,
  setOpenDialog,
  onSubmit,
  loading,
  form,
  titleDialog,
  selectedData,
}: {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  onSubmit: (data: FileFormValidation) => void;
  form: UseFormReturn<FileFormValidation>;
  titleDialog: string;
  selectedData: {
    MagangId: string;
    NamaMagang: string;
    NamaFormasi: string;
    FormasiId: string;
  };
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet open={openDialog} onOpenChange={setOpenDialog}>
        <SheetContent
          side="right"
          className="w-screen h-screen max-w-full overflow-scroll"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SheetHeader>
                <SheetTitle>{titleDialog}</SheetTitle>
                <SheetDescription>Tambah / Ubah data</SheetDescription>
              </SheetHeader>
              <div className="w-full grid grid-cols-1 gap-3 px-4">
                <div className="container mx-auto">
                  <div className="grid grid-cols-1 gap-3">
                    <FormField
                      control={form.control}
                      name="FileId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Magang</FormLabel>
                          <FormControl>
                            <Input readOnly value={selectedData.NamaMagang} />
                          </FormControl>
                          <FormDescription>Nama Magang</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="FileId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Formasi</FormLabel>
                          <FormControl>
                            <Input readOnly value={selectedData.NamaFormasi} />
                          </FormControl>
                          <FormDescription>Nama Formasi</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Nama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama</FormLabel>
                          <FormControl>
                            <Input readOnly={loading} {...field} />
                          </FormControl>
                          <FormDescription>Nama</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <SheetFooter>
                <Button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer hover:scale-105  active:scale-95 transition-all duration-100"
                >
                  {loading ? (
                    <>
                      <Timer />
                      Loading
                    </>
                  ) : (
                    <>
                      <PenIcon /> Simpan
                    </>
                  )}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
