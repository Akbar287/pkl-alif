-- CreateTable
CREATE TABLE "file_sk" (
    "file_sk_id" TEXT NOT NULL,
    "formasi_mhs_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kode_qr" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_sk_pkey" PRIMARY KEY ("file_sk_id")
);

-- AddForeignKey
ALTER TABLE "file_sk" ADD CONSTRAINT "file_sk_formasi_mhs_id_fkey" FOREIGN KEY ("formasi_mhs_id") REFERENCES "status_formasi_mhs"("status_formasi_mhs_id") ON DELETE CASCADE ON UPDATE CASCADE;
