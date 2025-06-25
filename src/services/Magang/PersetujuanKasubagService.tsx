import { Pagination } from "@/types/Pagination";
import { PersetujuanKasubagPagination } from "@/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPersetujuanKasubagPagination(
  page: number,
  limit: number,
  search: string
): Promise<Pagination<PersetujuanKasubagPagination[]>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });
  const res = await fetch(
    `${BASE_URL}/api/protected/magang/persetujuan-kasubag?${params.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch persetujuan kasubag magang ");
  return res.json();
}

export async function updateStatusApprovedKasubag(
  FormasiMhsId: string,
  Keterangan: string,
  Keputusan: boolean
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/protected/magang/persetujuan-kasubag?_fmi=${FormasiMhsId}&_k=${Keterangan}&_p=${Keputusan}`,
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
