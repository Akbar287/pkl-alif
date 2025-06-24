import { Pagination } from "@/types/Pagination";
import { PengajuanMagangPagination } from "@/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMagangPagination(
  page: number,
  limit: number,
  search: string
): Promise<Pagination<PengajuanMagangPagination[]>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });
  const res = await fetch(
    `${BASE_URL}/api/protected/magang/pengajuan?${params.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch magang ");
  return res.json();
}

export async function setMagangMhs(formasiId: string): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/protected/magang/pengajuan?id=${formasiId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    }
  );
  if (!res.ok) {
    throw new Error("Failed to create magang");
  }
  return res.json();
}
