"use client";
import { replaceItemAtIndex } from "@/lib/utils";
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
import { UserMhsInterface } from "@/types/ProfilTypes";
import {
  ProfilFormValidation,
  ProfilSkemaValidation,
} from "@/validation/ProfilValidation";
import {
  deletePengguna,
  getPenggunaPagination,
  setPengguna,
  updatePengguna,
} from "@/services/ManajemenData/PenggunaServices";
import { JenisKelamin } from "@/generated/prisma";
import { Textarea } from "../ui/textarea";

const PenggunaComponent = ({
  roleServer,
}: {
  roleServer: {
    RoleId: string;
    Nama: string;
  }[];
}) => {
  const [dataPengguna, setDataPengguna] = React.useState<UserMhsInterface[]>(
    []
  );
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

  const form = useForm<ProfilFormValidation>({
    resolver: zodResolver(ProfilSkemaValidation),
    defaultValues: {
      UserId: "",
      RoleId: "",
      MhsId: "",
      Nama: "",
      Email: "",
      Password: "",
      Nik: "",
      Nim: "",
      Alamat: "",
      AsalSekolah: "",
      JenisKelamin: undefined,
    },
  });
  const onSubmit = async (data: ProfilFormValidation) => {
    setLoading(true);

    if (titleDialog === "Ubah Pengguna") {
      await updatePengguna({
        UserId: data.UserId ?? "",
        RoleId: data.RoleId ?? "",
        MhsId: data.MhsId ?? "",
        Nama: data.Nama ?? "",
        Email: data.Email ?? "",
        Password: data.Password ?? "",
        Nik: data.Nik ?? "",
        Nim: data.Nim ?? "",
        Alamat: data.Alamat ?? "",
        AsalSekolah: data.AsalSekolah ?? "",
        JenisKelamin:
          data.JenisKelamin === "PRIA"
            ? JenisKelamin.PRIA
            : JenisKelamin.WANITA,
      })
        .then((res) => {
          toast("Data Pengguna berhasil diubah");
          let idx = dataPengguna.findIndex((r) => r.UserId === data.UserId);
          setDataPengguna(replaceItemAtIndex(dataPengguna, idx, res));
          setOpenDialog(false);
          setLoading(false);
        })
        .catch((err) => {
          toast("Data Pengguna gagal diubah. Error: " + err);
          setLoading(false);
        });
    } else {
      await setPengguna({
        UserId: data.UserId ?? "",
        RoleId: data.RoleId ?? "",
        MhsId: data.MhsId ?? "",
        Nama: data.Nama ?? "",
        Email: data.Email ?? "",
        Password: data.Password ?? "",
        Nik: data.Nik ?? "",
        Nim: data.Nim ?? "",
        Alamat: data.Alamat ?? "",
        AsalSekolah: data.AsalSekolah ?? "",
        JenisKelamin:
          data.JenisKelamin === "PRIA"
            ? JenisKelamin.PRIA
            : JenisKelamin.WANITA,
      })
        .then((res) => {
          toast("Data Pengguna berhasil ditambah");
          setDataPengguna([...dataPengguna, res]);
          setLoading(false);
          setOpenDialog(false);
        })
        .catch((err) => {
          toast("Data Pengguna gagal ditambah. Error: " + err);
          setLoading(false);
        });
    }
  };

  React.useEffect(() => {
    setLoading(true);
    getPenggunaPagination(paginationState.page, paginationState.limit, search)
      .then((res) => {
        setDataPengguna(res.data);
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
    setTitleDialog("Tambah Status");
    setOpenDialog(true);
  };
  const ubahData = (jd: UserMhsInterface) => {
    form.reset();
    form.setValue("Nama", String(jd.Nama));
    form.setValue("UserId", jd.UserId);
    form.setValue("RoleId", jd.RoleId);
    form.setValue("MhsId", jd.MhsId);
    form.setValue("Nama", jd.Nama);
    form.setValue("Email", jd.Email);
    form.setValue("Password", jd.Password);
    form.setValue("Nik", jd.Nik);
    form.setValue("Nim", jd.Nim);
    form.setValue("Alamat", jd.Alamat);
    form.setValue("AsalSekolah", jd.AsalSekolah);
    form.setValue("JenisKelamin", jd.JenisKelamin);
    setTitleDialog("Ubah Status");
    setOpenDialog(true);
  };
  const hapusData = (jd: UserMhsInterface) => {
    Swal.fire({
      title: "Ingin Hapus Pengguna " + jd.Nama + " ?",
      text: "Aksi ini tidak dapat di undo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f45f24",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batalin",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePengguna(jd.UserId).then(() => {
          setDataPengguna(dataPengguna.filter((r) => r.UserId !== jd.UserId));
          Swal.fire({
            title: "Terhapus!",
            text: "Data sudah dihapus.",
            icon: "success",
          });
        });
      }
    });
  };

  const columns: ColumnDef<UserMhsInterface>[] = [
    {
      accessorKey: "Nama",
      header: "Nama",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Nama")}</div>
      ),
    },
    {
      accessorKey: "Email",
      header: "Email",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Email")}</div>
      ),
    },
    {
      accessorKey: "Role",
      header: "Role",
      cell: ({ row }) => {
        const r = roleServer.find((x) => x.RoleId === row.original.RoleId);
        return <div className="capitalize">{r?.Nama ?? "-"}</div>;
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
                onClick={() => navigator.clipboard.writeText(jd.UserId)}
              >
                Copy User ID
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
    data: dataPengguna,
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
        roleServer={roleServer}
      />
    </div>
  );
};

export default PenggunaComponent;

export function SheetManageData({
  openDialog,
  setOpenDialog,
  onSubmit,
  loading,
  form,
  titleDialog,
  roleServer,
}: {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  onSubmit: (data: ProfilFormValidation) => void;
  form: UseFormReturn<ProfilFormValidation>;
  titleDialog: string;
  roleServer: {
    RoleId: string;
    Nama: string;
  }[];
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
                <SheetDescription>{form.getValues("Nama")}</SheetDescription>
              </SheetHeader>
              <div className="w-full grid grid-cols-1 gap-3 px-4">
                <div className="container mx-auto">
                  <div className="grid grid-cols-1 gap-3">
                    <FormField
                      control={form.control}
                      name="Nama"
                      disabled={loading}
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
                      disabled={loading}
                      name="Email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input readOnly={loading} {...field} />
                          </FormControl>
                          <FormDescription>Email</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Password"
                      disabled={loading}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              readOnly={loading}
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Masukan Password Baru untuk mengganti yang lama
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="RoleId"
                      disabled={loading}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Select
                              disabled={loading}
                              value={field.value ?? ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Role</SelectLabel>
                                  {roleServer.map((x) => (
                                    <SelectItem value={x.RoleId}>
                                      {x.Nama}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>Pilih Role Anda.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="JenisKelamin"
                      disabled={loading}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Kelamin</FormLabel>
                          <FormControl>
                            <Select
                              disabled={loading}
                              value={field.value ?? ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Jenis Kelamin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Jenis Kelamin</SelectLabel>
                                  <SelectItem value="PRIA">PRIA</SelectItem>
                                  <SelectItem value="WANITA">WANITA</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Pilih Jenis Kelamin Anda.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Nik"
                      disabled={loading}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nik</FormLabel>
                          <FormControl>
                            <Input readOnly={loading} {...field} />
                          </FormControl>
                          <FormDescription>Nik</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Nim"
                      disabled={loading}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nim</FormLabel>
                          <FormControl>
                            <Input readOnly={loading} {...field} />
                          </FormControl>
                          <FormDescription>Nim</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Alamat"
                      disabled={loading}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alamat</FormLabel>
                          <FormControl>
                            <Textarea
                              disabled={loading}
                              {...field}
                              placeholder="Alamat Anda."
                            />
                          </FormControl>
                          <FormDescription>
                            Masukan Alamat Lengkap Rumah Anda
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="AsalSekolah"
                      disabled={loading}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asal Sekolah</FormLabel>
                          <FormControl>
                            <Textarea
                              disabled={loading}
                              {...field}
                              placeholder="Asal Sekolah Anda."
                            />
                          </FormControl>
                          <FormDescription>
                            Masukan Asal Sekolah Anda
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
