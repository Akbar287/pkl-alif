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
  MagangFormValidation,
  MagangSkemaValidation,
} from "@/validation/MagangValidation";
import { Magang } from "@/generated/prisma";
import {
  deleteMagang,
  getMagangPagination,
  setMagang,
  updateMagang,
} from "@/services/ManajemenData/MagangServices";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

const MagangComponent = () => {
  const [dataMagang, setDataMagang] = React.useState<Magang[]>([]);
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

  const form = useForm<MagangFormValidation>({
    resolver: zodResolver(MagangSkemaValidation),
    defaultValues: {
      Nama: "",
      PeriodeAwal: new Date(),
      PeriodeAkhir: new Date(),
    },
  });
  const onSubmit = async (data: MagangFormValidation) => {
    setLoading(true);

    if (titleDialog === "Ubah Magang") {
      await updateMagang({
        MagangId: data.MagangId ?? "",
        Nama: data.Nama,
        PeriodeAwal: data.PeriodeAwal,
        PeriodeAkhir: data.PeriodeAkhir,
      })
        .then((res) => {
          toast("Data Magang berhasil diubah");
          let idx = dataMagang.findIndex((r) => r.MagangId === data.MagangId);
          setDataMagang(replaceItemAtIndex(dataMagang, idx, res));
          setOpenDialog(false);
          setLoading(false);
        })
        .catch((err) => {
          toast("Data Magang gagal diubah. Error: " + err);
          setLoading(false);
        });
    } else {
      await setMagang({
        MagangId: data.MagangId ?? "",
        Nama: data.Nama,
        PeriodeAwal: data.PeriodeAwal,
        PeriodeAkhir: data.PeriodeAkhir,
      })
        .then((res) => {
          toast("Data Magang berhasil ditambah");
          setDataMagang([...dataMagang, res]);
          setLoading(false);
          setOpenDialog(false);
        })
        .catch((err) => {
          toast("Data Magang gagal ditambah. Error: " + err);
          setLoading(false);
        });
    }
  };

  React.useEffect(() => {
    setLoading(true);
    getMagangPagination(paginationState.page, paginationState.limit, search)
      .then((res) => {
        setDataMagang(res.data);
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
  }, [paginationState.page, search, paginationState.limit]);

  const buatData = () => {
    form.reset();
    setTitleDialog("Tambah Magang");
    setOpenDialog(true);
  };
  const ubahData = (jd: Magang) => {
    form.setValue("MagangId", String(jd.MagangId));
    form.setValue("Nama", String(jd.Nama));
    form.setValue("PeriodeAwal", new Date(jd.PeriodeAwal));
    form.setValue("PeriodeAkhir", new Date(jd.PeriodeAkhir));
    setTitleDialog("Ubah Magang");
    setOpenDialog(true);
  };
  const hapusData = (jd: Magang) => {
    Swal.fire({
      title: "Ingin Hapus Magang " + jd.Nama + " ?",
      text: "Aksi ini tidak dapat di undo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f45f24",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batalin",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMagang(jd.MagangId).then(() => {
          setDataMagang(dataMagang.filter((r) => r.MagangId !== jd.MagangId));
          Swal.fire({
            title: "Terhapus!",
            text: "Data sudah dihapus.",
            icon: "success",
          });
        });
      }
    });
  };

  const columns: ColumnDef<Magang>[] = [
    {
      accessorKey: "Nama",
      header: "Nama",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Nama")}</div>
      ),
    },
    {
      accessorKey: "PeriodeAwal",
      header: "Periode Awal",
      cell: ({ row }) => {
        const x = row.getValue("PeriodeAwal") as string;
        return <div className="capitalize">{formatDateToIndonesian(x)}</div>;
      },
    },
    {
      accessorKey: "PeriodeAkhir",
      header: "Periode Akhir",
      cell: ({ row }) => {
        const x = row.getValue("PeriodeAkhir") as string;
        return <div className="capitalize">{formatDateToIndonesian(x)}</div>;
      },
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
                onClick={() => navigator.clipboard.writeText(jd.MagangId)}
              >
                Copy Magang ID
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
    data: dataMagang,
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
      <SheetManageData
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onSubmit={onSubmit}
        loading={loading}
        form={form}
        titleDialog={titleDialog}
      />
    </div>
  );
};

export default MagangComponent;
export function SheetManageData({
  openDialog,
  setOpenDialog,
  onSubmit,
  loading,
  form,
  titleDialog,
}: {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  onSubmit: (data: MagangFormValidation) => void;
  form: UseFormReturn<MagangFormValidation>;
  titleDialog: string;
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
                <SheetDescription>
                  Manage Data untuk {form.getValues("Nama")}
                </SheetDescription>
              </SheetHeader>
              <div className="w-full grid grid-cols-1 gap-3 px-4">
                <div className="container mx-auto">
                  <div className="grid grid-cols-1 gap-3">
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
                    <FormField
                      control={form.control}
                      name="PeriodeAwal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Periode Awal</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  disabled={loading}
                                >
                                  {field.value instanceof Date ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pilih Tanggal</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value ?? undefined}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Periode Awal Mulai Magang
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="PeriodeAkhir"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Periode Akhir</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  disabled={loading}
                                >
                                  {field.value instanceof Date ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pilih Tanggal</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value ?? undefined}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Periode Awal Akhir Magang
                          </FormDescription>
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
