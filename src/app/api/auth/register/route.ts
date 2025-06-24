import { JenisKelamin } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { UserMhsInterface } from "@/types/ProfilTypes";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import Bycript from "bcrypt";

const app = new Hono().basePath("/api/auth/register");

app.post("/", async (c) => {
  const body: UserMhsInterface = await c.req.json();

  const salt = await Bycript.genSalt(12);
  const hashedPassword = await Bycript.hash(body.Password, salt);
  const role = await prisma.role.findFirst({
    select: { RoleId: true },
    where: { Nama: "Magang" },
  });

  if (!role)
    return c.json(
      { status: " error", message: "role not found", data: [] },
      404
    );

  const user = await prisma.user.create({
    data: {
      Nama: body.Nama,
      Email: body.Email,
      Password: hashedPassword,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    },
  });

  await prisma.userHasRoles.create({
    data: {
      UserId: user.UserId,
      RoleId: role.RoleId,
    },
  });

  const mhs = await prisma.mhs.create({
    data: {
      UserId: user.UserId,
      JenisKelamin: body.JenisKelamin.match("PRIA")
        ? JenisKelamin.PRIA
        : JenisKelamin.WANITA,
      Nik: body.Nik,
      Nim: body.Nim,
      Alamat: body.Alamat,
      AsalSekolah: body.AsalSekolah,
    },
  });

  return c.json<UserMhsInterface>(
    {
      MhsId: mhs.MhsId,
      UserId: user.UserId,
      JenisKelamin: mhs.JenisKelamin,
      Nik: mhs.Nik,
      Nim: mhs.Nim,
      Alamat: mhs.Alamat,
      AsalSekolah: mhs.AsalSekolah,
      RoleId: role.RoleId,
      Nama: user.Nama,
      Email: user.Email,
      Password: "",
    },
    200
  );
});
export const POST = handle(app);
