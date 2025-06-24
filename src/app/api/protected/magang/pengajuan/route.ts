import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { withApiAuth } from "@/middlewares/api-auth";
import { getSession } from "@/provider/api";
import { PengajuanMagangPagination } from "@/types/types";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api/protected/magang/pengajuan");

app.use("*", withApiAuth);

app.get("/", async (c) => {
  const page = Number(c.req.query("page") ?? "1");
  const limit = Number(c.req.query("limit") ?? "10");
  const search = c.req.query("search") ?? "";
  const session = await getSession()

  let where: Prisma.FormasiWhereInput = search
    ? {
        OR: [
          { Nama: { contains: search, mode: "insensitive" } },
          { Magang: { Nama: { contains: search, mode: "insensitive" } } },
        ],
        NOT: [
            {
                StatusFormasiMhs: {
                    some: {
                        Mhs: {
                            UserId: session?.user.id
                        }
                    }
                }
            }
        ]
      }
    : {NOT: [
            {
                StatusFormasiMhs: {
                    some: {
                        Mhs: {
                            UserId: session?.user.id
                        }
                    }
                }
            }
        ]};

  const [data, total] = await Promise.all([
    prisma.formasi.findMany({
      where,
      select: {
        FormasiId: true,
        MagangId: true,
        Kebutuhan: true,
        Nama: true,
        Magang: {
          select: { Nama: true, PeriodeAwal: true, PeriodeAkhir: true },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { Nama: "asc" },
    }),

    prisma.formasi.count({ where }),
  ]);

  return c.json<{
    data: PengajuanMagangPagination[];
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
      MagangId: x.MagangId,
      FormasiId: x.FormasiId,
      NamaMagang: x.Magang.Nama,
      NamaFormasi: x.Nama,
      Kebutuhan: x.Kebutuhan,
      PeriodeAwal: x.Magang.PeriodeAwal,
      PeriodeAkhir: x.Magang.PeriodeAkhir,
    })),
    totalElement: total,
    totalPage: Math.ceil(total / limit),
    isFirst: page === 1,
    isLast: page === Math.ceil(total / limit) || Math.ceil(total / limit) === 0,
    hasNext: page < Math.ceil(total / limit),
    hasPrevious: page > 1,
  });
});

app.post("/", async (c) => {
  const formasiId = await c.req.query("id");
  const session = await getSession();

  const formasi = await prisma.formasi.findFirst({
    where: { FormasiId: formasiId },
  });
  const status = await prisma.status.findFirst({
    where: { Nama: "Pendaftaran" },
  });

  if (formasi && status && session) {
    const mhs = await prisma.mhs.findFirst({
      where: { UserId: session.user.id },
    });
    if (!mhs)
      return c.json({ message: "no queri", status: "error", data: [] }, 400);
    const sfm = await prisma.statusFormasiMhs.findMany({
        where: {
            FormasiId: formasi.FormasiId,
            StatusId: status.StatusId,
            MhsId: mhs.MhsId,
        }
    })
    if (sfm.length > 0) {
        await prisma.statusFormasiMhs.deleteMany({
            where: {
                FormasiId: formasi.FormasiId,
                StatusId: status.StatusId,
                MhsId: mhs.MhsId,
            }
        })
    }
    await prisma.statusFormasiMhs.create({
      data: {
        FormasiId: formasi.FormasiId,
        StatusId: status.StatusId,
        MhsId: mhs.MhsId,
      },
    });
  }

  return c.json(null, 200);
});

export const GET = handle(app);
export const POST = handle(app);
