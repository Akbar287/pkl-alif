-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('PRIA', 'WANITA');

-- CreateTable
CREATE TABLE "magang" (
    "magang_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "periode_awal" TIMESTAMP(3) NOT NULL,
    "periode_akhir" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "magang_pkey" PRIMARY KEY ("magang_id")
);

-- CreateTable
CREATE TABLE "mhs" (
    "mhs_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "formasi_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenis_kelamin" "JenisKelamin" NOT NULL DEFAULT 'PRIA',
    "nik" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "asal_sekolah" TEXT NOT NULL,

    CONSTRAINT "mhs_pkey" PRIMARY KEY ("mhs_id")
);

-- CreateTable
CREATE TABLE "formasi" (
    "formasi_id" TEXT NOT NULL,
    "magang_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kebutuhan" INTEGER NOT NULL,

    CONSTRAINT "formasi_pkey" PRIMARY KEY ("formasi_id")
);

-- CreateTable
CREATE TABLE "file" (
    "file_id" TEXT NOT NULL,
    "formasi_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("file_id")
);

-- CreateTable
CREATE TABLE "file_mhs" (
    "file_mhs_id" TEXT NOT NULL,
    "mhs_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "file_mhs_pkey" PRIMARY KEY ("file_mhs_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "status" (
    "status_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("status_id")
);

-- CreateTable
CREATE TABLE "status_mhs" (
    "status_mhs_id" TEXT NOT NULL,
    "status_id" TEXT NOT NULL,
    "mhs_id" TEXT NOT NULL,

    CONSTRAINT "status_mhs_pkey" PRIMARY KEY ("status_mhs_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_has_roles" (
    "role_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_has_roles_pkey" PRIMARY KEY ("role_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "mhs" ADD CONSTRAINT "mhs_formasi_id_fkey" FOREIGN KEY ("formasi_id") REFERENCES "formasi"("formasi_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mhs" ADD CONSTRAINT "mhs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formasi" ADD CONSTRAINT "formasi_magang_id_fkey" FOREIGN KEY ("magang_id") REFERENCES "magang"("magang_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_formasi_id_fkey" FOREIGN KEY ("formasi_id") REFERENCES "formasi"("formasi_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_mhs" ADD CONSTRAINT "file_mhs_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("file_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_mhs" ADD CONSTRAINT "file_mhs_mhs_id_fkey" FOREIGN KEY ("mhs_id") REFERENCES "mhs"("mhs_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_mhs" ADD CONSTRAINT "status_mhs_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status"("status_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_mhs" ADD CONSTRAINT "status_mhs_mhs_id_fkey" FOREIGN KEY ("mhs_id") REFERENCES "mhs"("mhs_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_has_roles" ADD CONSTRAINT "user_has_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_has_roles" ADD CONSTRAINT "user_has_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
