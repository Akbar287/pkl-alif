import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { withApiAuth } from "@/middlewares/api-auth";
import { PersetujuanSubagPagination } from "@/types/types";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import mime from "mime";
import { getSession } from "@/provider/api";

const app = new Hono().basePath("/api/protected/penerbitan-sk");

app.use("*", withApiAuth);

app.get("/", async (c) => {
  const jenis = c.req.query("_j");

  if (jenis?.match("_fs")) {
    const filename = c.req.query("_nf");
    const file = await prisma.fileSk.findFirst({ where: { Nama: filename } });
    if (!file) {
      return c.json(
        { data: [], status: "error", message: "file is required" },
        { status: 400 }
      );
    }

    try {
      const buffer = Buffer.from(file.FileBase, "base64");

      const contentType = mime.getType(file.Nama) || "application/octet-stream";

      return c.body(buffer, 200, {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${file.Nama}"`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "error";
      return c.json(
        { data: [], status: "error", message: errorMessage },
        { status: 500 }
      );
    }
  } else if (jenis?.match("_pg")) {
    const page = Number(c.req.query("page") ?? "1");
    const limit = Number(c.req.query("limit") ?? "10");
    const search = c.req.query("search") ?? "";
    const roleName = c.req.query("_r");
    const session = await getSession();

    if (!roleName) {
      return c.json(
        {
          status: "error",
          message: "Query Error",
          data: [],
        },
        200
      );
    }
    if (!session) {
      return c.json(
        {
          status: "error",
          message: "Query Error",
          data: [],
        },
        200
      );
    }

    let where: Prisma.StatusFormasiMhsWhereInput = {};
    if (roleName.match("Magang")) {
      if (search) {
        where = {
          AND: [
            {
              OR: [
                {
                  Formasi: { Nama: { contains: search, mode: "insensitive" } },
                },
                {
                  Formasi: {
                    Magang: { Nama: { contains: search, mode: "insensitive" } },
                  },
                },
              ],
            },
            {
              Status: {
                Nama: "Sk Terbit",
              },
            },
            {
              Mhs: {
                UserId: session.user.id,
              },
            },
          ],
        };
      } else {
        where = {
          AND: [
            {
              Status: {
                Nama: "Sk Terbit",
              },
            },
            {
              Mhs: {
                UserId: session.user.id,
              },
            },
          ],
        };
      }
    } else {
      if (search) {
        where = {
          OR: [
            { Formasi: { Nama: { contains: search, mode: "insensitive" } } },
            {
              Formasi: {
                Magang: { Nama: { contains: search, mode: "insensitive" } },
              },
            },
          ],
          Status: {
            Nama: "Approved Kasubag",
          },
        };
      } else {
        where = {
          Status: {
            Nama: "Approved Kasubag",
          },
        };
      }
    }

    const [data, total] = await Promise.all([
      prisma.statusFormasiMhs.findMany({
        where,
        select: {
          Status: {
            select: {
              Nama: true,
            },
          },
          Mhs: {
            select: {
              User: {
                select: {
                  Nama: true,
                  Email: true,
                },
              },
              JenisKelamin: true,
              Nik: true,
              Nim: true,
              Alamat: true,
              AsalSekolah: true,
            },
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
                  PeriodeAkhir: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { Formasi: { Magang: { PeriodeAkhir: "asc" } } },
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
        MagangId: x.Formasi.Magang.MagangId ?? "",
        NamaMagang: x.Formasi.Magang.Nama ?? "",
        PeriodeAwal: x.Formasi.Magang.PeriodeAwal ?? "",
        PeriodeAkhir: x.Formasi.Magang.PeriodeAkhir ?? "",
        FormasiId: x.Formasi.FormasiId ?? "",
        NamaFormasi: x.Formasi.Nama ?? "",
        Kebutuhan: x.Formasi.Kebutuhan ?? "",
        Status: x.Status.Nama ?? "",
        Nama: x.Mhs.User.Nama ?? "",
        JenisKelamin: x.Mhs.JenisKelamin ?? "",
        Email: x.Mhs.User.Email ?? "",
        Nik: x.Mhs.Nik ?? "",
        Nim: x.Mhs.Nim ?? "",
        Alamat: x.Mhs.Alamat ?? "",
        AsalSekolah: x.Mhs.AsalSekolah ?? "",
        FormasiMhsId: x.FormasiMhsId,
      })),
      totalElement: total,
      totalPage: Math.ceil(total / limit),
      isFirst: page === 1,
      isLast:
        page === Math.ceil(total / limit) || Math.ceil(total / limit) === 0,
      hasNext: page < Math.ceil(total / limit),
      hasPrevious: page > 1,
    });
  } else {
    return c.json({}, 400);
  }
});

app.put("/", async (c) => {
  const FormasiMhsId = c.req.query("_fmi");

  const check = await prisma.statusFormasiMhs.findFirst({
    where: {
      FormasiMhsId: FormasiMhsId,
    },
  });

  if (!check)
    return c.json(
      { data: [], status: "error", message: "No queri found" },
      400
    );

  const status = await prisma.status.findFirst({
    select: { StatusId: true },
    where: { Nama: "Sk Terbit" },
  });

  if (!status)
    return c.json(
      { data: [], status: "error", message: "No queri found" },
      400
    );
  await prisma.statusFormasiMhs.update({
    data: {
      StatusId: status.StatusId,
    },
    where: {
      FormasiMhsId: check.FormasiMhsId,
    },
  });

  return c.json(null, 200);
});

export const GET = handle(app);
export const PUT = handle(app);
