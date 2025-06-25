import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { withApiAuth } from "@/middlewares/api-auth";
import { PersetujuanSubagPagination } from "@/types/types";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api/protected/magang/persetujuan-kasubag");

app.use("*", withApiAuth);

app.get("/", async (c) => {
  const page = Number(c.req.query("page") ?? "1");
  const limit = Number(c.req.query("limit") ?? "10");
  const search = c.req.query("search") ?? "";

  let where: Prisma.StatusFormasiMhsWhereInput = search
    ? {
        OR: [
          { Formasi: { Nama: { contains: search, mode: "insensitive" } } },
          { Formasi: { Magang: { Nama: { contains: search, mode: "insensitive" } } } },
        ],
        Status: {
          Nama: "Approved Subbag"
        }
      }
    : {Status: {
          Nama: "Approved Subbag"
        }};

  const [data, total] = await Promise.all([
    prisma.statusFormasiMhs.findMany({
      where,
      select: {
        Status: {
          select: {
            Nama: true
          }
        },
        Mhs: {
          select: {
            User: {
              select: {
                Nama: true, Email: true
              }
            },
            JenisKelamin: true,
            Nik: true,
            Nim: true,
            Alamat: true,
            AsalSekolah: true,
          }
        },
        FormasiMhsId: true,
        Formasi: {
          select: {
            FormasiId: true,
            Nama: true,
            Kebutuhan: true,
            Magang: {
              select: { 
                MagangId: true,
                Nama: true, 
                PeriodeAwal: true, 
                PeriodeAkhir: true 
              },
            },
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { Formasi: {Magang: {PeriodeAkhir: "asc"}} },
    }),

    prisma.statusFormasiMhs.count({ where }),
  ]);

  return c.json<{
    data: PersetujuanSubagPagination[];
    page: number;
    limit: number;
    totalElement: number;
    totalPage: number;
    isFirst: boolean;
    isLast: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
  }>({
    page: page,
    limit: limit,
    data: data.map((x) => ({
        MagangId: x.Formasi.Magang.MagangId ?? '',
        NamaMagang: x.Formasi.Magang.Nama ??'',
        PeriodeAwal:x.Formasi.Magang.PeriodeAwal ?? '',
        PeriodeAkhir: x.Formasi.Magang.PeriodeAkhir ?? '',
        FormasiId: x.Formasi.FormasiId ??'',
        NamaFormasi: x.Formasi.Nama ?? '',
        Kebutuhan: x.Formasi.Kebutuhan ?? '',
        Status: x.Status.Nama ?? '',
        Nama: x.Mhs.User.Nama ?? '',
        JenisKelamin: x.Mhs.JenisKelamin ?? '',
        Email: x.Mhs.User.Email ?? '',
        Nik: x.Mhs.Nik ?? '',
        Nim: x.Mhs.Nim ?? '',
        Alamat: x.Mhs.Alamat ?? '',
        AsalSekolah: x.Mhs.AsalSekolah ?? '',
        FormasiMhsId: x.FormasiMhsId
    })),
    totalElement: total,
    totalPage: Math.ceil(total / limit),
    isFirst: page === 1,
    isLast: page === Math.ceil(total / limit) || Math.ceil(total / limit) === 0,
    hasNext: page < Math.ceil(total / limit),
    hasPrevious: page > 1,
  });
});

app.put('/', async c => {
  const FormasiMhsId = c.req.query("_fmi");
  const Keputuan = c.req.query("_p") as unknown as boolean
  const Keterangan = c.req.query("_k") as unknown as string | null

  const check = await prisma.statusFormasiMhs.findFirst({
    where: {
      FormasiMhsId: FormasiMhsId
    }
  })

  if(!check)
    return c.json({data: [], status: 'error', message: "No queri found"}, 400);
  

  const status = Keputuan ? await prisma.status.findFirst({select: {StatusId: true}, where: {Nama: "Approved Kasubag"}}) : await prisma.status.findFirst({select: {StatusId: true}, where: {Nama: "Declined Kasubag"}})

  if(!status) return c.json({data: [], status: 'error', message: "No queri found"}, 400);
  await prisma.statusFormasiMhs.update({
    data: {
      StatusId: status.StatusId
    },
    where: {
      FormasiMhsId: check.FormasiMhsId
    }
  })

  if(Keterangan && FormasiMhsId) {
    await prisma.catatanPenilai.create({
      data: {
        Nama: 'Kasubag', Pesan: Keterangan, FormasiMhsId: FormasiMhsId
      }
    })
  }
  return c.json(null, 200)
})

export const GET = handle(app);
export const PUT = handle(app);
