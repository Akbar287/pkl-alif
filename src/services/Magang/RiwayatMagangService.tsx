import { Pagination } from "@/types/Pagination";
import { RiwayatMagangPagination } from "@/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getRiwayatMagangPagination(
  page: number,
  limit: number,
  search: string
): Promise<Pagination<RiwayatMagangPagination[]>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });
  const res = await fetch(
    `${BASE_URL}/api/protected/magang/riwayat?${params.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch riwayat magang ");
  return res.json();
}

export async function updateStatusKelengkapanDokumen(
  FormasiId: string,
  MhsId: string
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/protected/magang/riwayat?formasi-id=${FormasiId}&mhs-id=${MhsId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    }
  );
  if (!res.ok) {
    throw new Error("Failed to update status ");
  }
  return res.json();
}
