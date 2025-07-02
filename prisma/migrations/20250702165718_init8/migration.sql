/*
  Warnings:

  - Added the required column `file_base` to the `file_mhs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_base` to the `file_sk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file_mhs" ADD COLUMN     "file_base" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "file_sk" ADD COLUMN     "file_base" TEXT NOT NULL;
