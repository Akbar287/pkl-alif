import { withApiAuth } from "@/middlewares/api-auth";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import mime from "mime";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { FileMhs } from "@/generated/prisma";

const app = new Hono().basePath("/api/protected/upload-dokumen");

app.use("*", withApiAuth);

app.get("/", async (c) => {
  const filename = c.req.query("file");

  const file = await prisma.fileMhs.findFirst({ where: { Nama: filename } });
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
});

app.post("/", async (c) => {
  const body = await c.req.parseBody();

  const file = body.files;
  const MhsId = body.MhsId as string;
  const FileId = body.FileId as string;

  if (!file || !(file instanceof File)) {
    return c.json(
      { status: "error", message: "File is required", data: [] },
      { status: 400 }
    );
  }

  if (!MhsId) {
    return c.json(
      { status: "error", message: "Mhs Perlu diisi", data: [] },
      { status: 400 }
    );
  }

  if (!FileId) {
    return c.json(
      { status: "error", message: "Id File Perlu diisi", data: [] },
      { status: 400 }
    );
  }

  const MAX_SIZE_MB = 5;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return c.json(
      {
        status: "error",
        message: "Ukuran file melebihi 5MB",
        data: [],
      },
      { status: 400 }
    );
  }

  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const allowedExtensions = ["pdf", "doc", "docx"];

  const fileExt = mime.getExtension(file.type) || "";
  if (
    !allowedMimeTypes.includes(file.type) ||
    !allowedExtensions.includes(fileExt)
  ) {
    return c.json(
      {
        status: "error",
        message:
          "Format file tidak valid. Hanya PDF dan Word (doc/docx) yang diperbolehkan.",
        data: [],
      },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64String = buffer.toString("base64");
  const filename = `${uuidv4()}.${fileExt}`;

  const data = await prisma.fileMhs.create({
    data: {
      FileId: FileId,
      FileBase: base64String,
      MhsId: MhsId,
      Nama: filename,
    },
  });

  return c.json<FileMhs>(
    {
      FileMhsId: data.FileMhsId,
      FileId: data.FileId,
      FileBase: "",
      MhsId: data.MhsId,
      Nama: data.Nama,
    },
    200
  );
});

app.delete("/", async (c) => {
  const id = c.req.query("id");

  await prisma.fileMhs.delete({
    where: {
      FileMhsId: id,
    },
  });

  return c.json(null, 200);
});

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
