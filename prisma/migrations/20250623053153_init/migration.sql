/*
  Warnings:

  - You are about to drop the column `formasi_id` on the `mhs` table. All the data in the column will be lost.
  - You are about to drop the `status_mhs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mhs" DROP CONSTRAINT "mhs_formasi_id_fkey";

-- DropForeignKey
ALTER TABLE "status_mhs" DROP CONSTRAINT "status_mhs_mhs_id_fkey";

-- DropForeignKey
ALTER TABLE "status_mhs" DROP CONSTRAINT "status_mhs_status_id_fkey";

-- AlterTable
ALTER TABLE "mhs" DROP COLUMN "formasi_id",
ADD COLUMN     "formasiFormasiId" TEXT;

-- DropTable
DROP TABLE "status_mhs";

-- CreateTable
CREATE TABLE "status_formasi_mhs" (
    "status_formasi_mhs_id" TEXT NOT NULL,
    "formasi_id" TEXT NOT NULL,
    "status_id" TEXT NOT NULL,
    "mhs_id" TEXT NOT NULL,

    CONSTRAINT "status_formasi_mhs_pkey" PRIMARY KEY ("status_formasi_mhs_id")
);

-- AddForeignKey
ALTER TABLE "mhs" ADD CONSTRAINT "mhs_formasiFormasiId_fkey" FOREIGN KEY ("formasiFormasiId") REFERENCES "formasi"("formasi_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_formasi_mhs" ADD CONSTRAINT "status_formasi_mhs_formasi_id_fkey" FOREIGN KEY ("formasi_id") REFERENCES "formasi"("formasi_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_formasi_mhs" ADD CONSTRAINT "status_formasi_mhs_mhs_id_fkey" FOREIGN KEY ("mhs_id") REFERENCES "mhs"("mhs_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_formasi_mhs" ADD CONSTRAINT "status_formasi_mhs_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status"("status_id") ON DELETE CASCADE ON UPDATE CASCADE;
