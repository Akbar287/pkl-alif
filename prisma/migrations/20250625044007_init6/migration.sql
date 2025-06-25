/*
  Warnings:

  - You are about to drop the `statcatatan_penilaius` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "statcatatan_penilaius" DROP CONSTRAINT "statcatatan_penilaius_status_formasi_mhs_id_fkey";

-- DropTable
DROP TABLE "statcatatan_penilaius";

-- CreateTable
CREATE TABLE "catatan_penilai" (
    "catatan_penilai_id" TEXT NOT NULL,
    "status_formasi_mhs_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,

    CONSTRAINT "catatan_penilai_pkey" PRIMARY KEY ("catatan_penilai_id")
);

-- AddForeignKey
ALTER TABLE "catatan_penilai" ADD CONSTRAINT "catatan_penilai_status_formasi_mhs_id_fkey" FOREIGN KEY ("status_formasi_mhs_id") REFERENCES "status_formasi_mhs"("status_formasi_mhs_id") ON DELETE CASCADE ON UPDATE CASCADE;
