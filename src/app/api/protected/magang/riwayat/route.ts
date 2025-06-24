import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { withApiAuth } from "@/middlewares/api-auth";
import { getSession } from "@/provider/api";
import { RiwayatMagangPagination } from "@/types/types";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api/protected/magang/riwayat");

app.use("*", withApiAuth);

app.get("/", async (c) => {
  const page = Number(c.req.query("page") ?? "1");
  const limit = Number(c.req.query("limit") ?? "10");
  const search = c.req.query("search") ?? "";
  const session = await getSession()

  let where: Prisma.StatusFormasiMhsWhereInput = search
    ? {
        OR: [
          { Formasi: { Nama: { contains: search, mode: "insensitive" } } },
          {Status: {Nama:{ contains: search, mode: "insensitive" } }},
          { Formasi: { Magang: { Nama: { contains: search, mode: "insensitive" } } } },
        ],
        Mhs: {
          UserId: session?.user.id
        },
      }
    : {Mhs: {
          UserId: session?.user.id
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
    data: RiwayatMagangPagination[];
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
      MagangId: x.Formasi.Magang.MagangId,
      Status: x.Status.Nama,
      FormasiId: x.Formasi.FormasiId,
      NamaMagang: x.Formasi.Magang.Nama,
      NamaFormasi: x.Formasi.Nama,
      Kebutuhan: x.Formasi.Kebutuhan,
      PeriodeAwal: x.Formasi.Magang.PeriodeAwal,
      PeriodeAkhir: x.Formasi.Magang.PeriodeAkhir,
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
  const FormasiId = c.req.query("formasi-id");
  const MhsId = c.req.query("mhs-id");

  const check = await prisma.statusFormasiMhs.findFirst({
    where: {
      FormasiId, 
      MhsId
    }
  })

  if(!check) 
    return c.json({data: [], status: 'error', message: "No queri found"}, 400);
  

  const status = await prisma.status.findFirst({select: {StatusId: true}, where: {Nama: "Kelengkapan Dokumen"}})

  if(!status) return c.json({data: [], status: 'error', message: "No queri found"}, 400);
  await prisma.statusFormasiMhs.update({
    data: {
      StatusId: status.StatusId
    },
    where: {
      FormasiMhsId: check.FormasiMhsId
    }
  })

  return c.json(null, 200)
})

export const GET = handle(app);
export const PUT = handle(app);
