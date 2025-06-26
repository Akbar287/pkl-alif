import { Pagination } from "@/types/Pagination";
import { PersetujuanSubagPagination } from "@/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPenerbitanSkPagination(
  page: number,
  limit: number,
  search: string
): Promise<Pagination<PersetujuanSubagPagination[]>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });
  const res = await fetch(
    `${BASE_URL}/api/protected/penerbitan-sk?${params.toString()}&_j=_pg`
  );
  if (!res.ok) throw new Error("Failed to fetch penerbitan sk ");
  return res.json();
}

export async function getFileSkBlobByNamafile(
  NamaFile: string
): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/api/protected/penerbitan-sk?_j=_fs&_nf=${NamaFile}`
  );

  if (!res.ok) {
    throw new Error("Failed to get dokumen ");
  }

  const blob = await res.blob();
  const previewUrl = URL.createObjectURL(blob);
  return previewUrl;
}

export async function updateStatusPenerbitanSk(
  FormasiMhsId: string
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/protected/penerbitan-sk?_fmi=${FormasiMhsId}`,
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
