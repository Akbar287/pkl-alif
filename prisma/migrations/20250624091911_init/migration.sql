/*
  Warnings:

  - You are about to drop the column `formasiFormasiId` on the `mhs` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `mhs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "mhs" DROP CONSTRAINT "mhs_formasiFormasiId_fkey";

-- AlterTable
ALTER TABLE "mhs" DROP COLUMN "formasiFormasiId",
DROP COLUMN "nama";
