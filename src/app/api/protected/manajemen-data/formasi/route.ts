import { Formasi, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { withApiAuth } from "@/middlewares/api-auth";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api/protected/manajemen-data/formasi");

app.use("*", withApiAuth);

app.get("/", async (c) => {
  const id = c.req.query("id");
  const magangId = c.req.query("magang-id");
  const page = Number(c.req.query("page") ?? "1");
  const limit = Number(c.req.query("limit") ?? "10");
  const search = c.req.query("search") ?? "";

  let data = null;

  if (id) {
    data = await prisma.formasi.findFirst({ where: { FormasiId: id } });
  } else if (page && limit) {
    let where: Prisma.FormasiWhereInput = {};
    if (magangId) {
      if (search) {
        where = {
          AND: [
            { Nama: { contains: search, mode: "insensitive" } },
            { Magang: { Nama: { contains: search, mode: "insensitive" } } },
            { MagangId: magangId },
          ],
        };
      } else {
        where = {
          MagangId: magangId,
        };
      }
    } else {
      if (search) {
        where = {
          AND: [
            { Nama: { contains: search, mode: "insensitive" } },
            { Magang: { Nama: { contains: search, mode: "insensitive" } } },
          ],
        };
      } else {
        where = {};
      }
    }

    const [data, total] = await Promise.all([
      prisma.formasi.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { Nama: "asc" },
      }),

      prisma.formasi.count({ where }),
    ]);

    return c.json<{
      data: Formasi[];
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
      data: data,
      totalElement: total,
      totalPage: Math.ceil(total / limit),
      isFirst: page === 1,
      isLast:
        page === Math.ceil(total / limit) || Math.ceil(total / limit) === 0,
      hasNext: page < Math.ceil(total / limit),
      hasPrevious: page > 1,
    });
  } else {
    data = magangId
      ? await prisma.formasi.findMany({ where: { MagangId: magangId } })
      : await prisma.formasi.findMany();
  }

  return c.json(data);
});

app.post("/", async (c) => {
  const body: Formasi = await c.req.json();

  const data = await prisma.formasi.create({
    data: {
      Nama: body.Nama,
      Kebutuhan: body.Kebutuhan,
      MagangId: body.MagangId,
    },
  });

  return c.json(data);
});

app.put("/", async (c) => {
  const body: Formasi = await c.req.json();

  const data = await prisma.formasi.update({
    data: {
      Nama: body.Nama,
      Kebutuhan: body.Kebutuhan,
    },
    where: {
      FormasiId: body.FormasiId,
    },
  });

  return c.json(data);
});

app.delete("/", async (c) => {
  const id = c.req.query("id");

  await prisma.formasi.delete({
    where: {
      FormasiId: id,
    },
  });

  return c.json([]);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
