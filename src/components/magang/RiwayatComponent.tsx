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
  Briefcase,
  Building,
  Building2,
  CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  MoreHorizontal,
  PenIcon,
  Ticket,
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { RiwayatMagangPagination } from "@/types/types";
import { getRiwayatMagangPagination } from "@/services/Magang/RiwayatMagangService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useRouter } from "next/navigation";

const RiwayatComponent = () => {
  const router = useRouter();
  const [dataMagang, setDataMagang] = React.useState<RiwayatMagangPagination[]>(
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
  const [dataDetail, setDataDetail] =
    React.useState<RiwayatMagangPagination | null>(null);

  React.useEffect(() => {
    setLoading(true);
    getRiwayatMagangPagination(
      paginationState.page,
      paginationState.limit,
      search
    )
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

  const gotoDetail = (formasiId: string) => {
    router.push("/magang/riwayat/" + formasiId);
  };
  const columns: ColumnDef<RiwayatMagangPagination>[] = [
    {
      accessorKey: "Status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Status")}</div>
      ),
    },
    {
      accessorKey: "NamaMagang",
      header: "Magang",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("NamaMagang")}</div>
      ),
    },
    {
      accessorKey: "NamaFormasi",
      header: "Formasi",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("NamaFormasi")}</div>
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
      accessorKey: "Kebutuhan",
      header: "Kebutuhan",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Kebutuhan")}</div>
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
                onClick={() => navigator.clipboard.writeText(jd.MagangId)}
              >
                Copy Magang ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => gotoDetail(jd.FormasiId)}>
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenDialog(true);
                  setDataDetail(jd);
                }}
              >
                Lihat Kartu Pendaftaran
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
          placeholder="Cari Program ..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
        <div className="w-full justify-end flex">
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
      <SheetDetailTicket
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        titleDialog={titleDialog}
        loading={loading}
        dataDetail={dataDetail}
      />
    </div>
  );
};

export default RiwayatComponent;

function SheetDetailTicket({
  openDialog,
  setOpenDialog,
  titleDialog,
  loading,
  dataDetail,
}: {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  titleDialog: string;
  loading: boolean;
  dataDetail: RiwayatMagangPagination | null;
}) {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-[425px] p-6 bg-white rounded-lg shadow-2xl border-t-8 border-blue-600 dark:bg-gray-800">
        <DialogHeader className="text-center mb-6">
          <div className="flex justify-center items-center mb-3">
            <Building2 className="w-12 h-12 text-blue-600" />
          </div>
          <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Program Magang
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-md mt-2 dark:text-gray-200">
            Kamu berhasil terdaftar di Program {dataDetail?.NamaMagang} dengan
            Formasi {dataDetail?.NamaFormasi}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-gray-700">
          <div className="flex items-center justify-between p-3 bg-blue-50  dark:bg-blue-800 rounded-md border border-blue-100">
            <span className="text-sm font-semibold text-blue-800  dark:text-blue-100">
              Magang Id:
            </span>
            <span className="text-lg font-bold text-blue-900  dark:text-blue-100">
              #12345
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-gray-600 dark:text-gray-200" />
            <span className="font-medium text-gray-600 dark:text-gray-200">
              Program:
            </span>
            <span className="flex-1 text-right text-gray-600 dark:text-gray-200">
              {dataDetail?.NamaMagang}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-200" />
            <span className="font-medium text-gray-600 dark:text-gray-200">
              Formasi:
            </span>
            <span className="flex-1 text-right text-gray-600 dark:text-gray-200">
              {dataDetail?.NamaFormasi}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-5 h-5 text-gray-600 dark:text-gray-200" />
            <span className="font-medium text-gray-600 dark:text-gray-200">
              Periode:
            </span>
            <span className="flex-1 text-right text-gray-600 dark:text-gray-200">
              {dataDetail
                ? formatDateToIndonesian(
                    dataDetail.PeriodeAwal as unknown as string
                  )
                : ""}{" "}
              s/d{" "}
              {dataDetail
                ? formatDateToIndonesian(
                    dataDetail.PeriodeAkhir as unknown as string
                  )
                : ""}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {dataDetail?.Status === "Pendaftaran" ? (
              <Clock className="w-5 h-5 text-yellow-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <span className="font-medium text-gray-600 dark:text-gray-200">
              Status:
            </span>
            <span className="flex-1 text-right font-semibold text-gray-600 dark:text-gray-200">
              {dataDetail?.Status}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-5 h-5 text-gray-600 dark:text-gray-200" />
            <span className="font-medium text-gray-600 dark:text-gray-200">
              Submission Date:
            </span>
            <span className="flex-1 text-right text-gray-600 dark:text-gray-200">
              {dataDetail
                ? formatDateToIndonesian(
                    dataDetail?.PeriodeAkhir as unknown as string
                  )
                : ""}
            </span>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-center">
          <Button
            type="button"
            className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md"
            onClick={() => setOpenDialog(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
