-- CreateTable
CREATE TABLE "statcatatan_penilaius" (
    "catatan_penilai_id" TEXT NOT NULL,
    "status_formasi_mhs_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,

    CONSTRAINT "statcatatan_penilaius_pkey" PRIMARY KEY ("catatan_penilai_id")
);

-- AddForeignKey
ALTER TABLE "statcatatan_penilaius" ADD CONSTRAINT "statcatatan_penilaius_status_formasi_mhs_id_fkey" FOREIGN KEY ("status_formasi_mhs_id") REFERENCES "status_formasi_mhs"("status_formasi_mhs_id") ON DELETE CASCADE ON UPDATE CASCADE;
