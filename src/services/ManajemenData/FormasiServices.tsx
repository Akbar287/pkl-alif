import { Formasi } from "@/generated/prisma";
import { Pagination } from "@/types/Pagination";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getFormasiPagination(
  page: number,
  limit: number,
  search: string,
  MagangId?: string
): Promise<Pagination<Formasi[]>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/formasi?${params.toString()}${
      MagangId ? "&magang-id=" + MagangId : ""
    }`
  );
  if (!res.ok) throw new Error("Failed to fetch Formasi");
  return res.json();
}

export async function getFormasi(MagangId?: string): Promise<Formasi[]> {
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/formasi?${
      MagangId ? "&magang-id=" + MagangId : ""
    }`
  );
  if (!res.ok) throw new Error("Failed to fetch Formasi");
  return res.json();
}

export async function getFormasiId(FormasiId: string): Promise<Formasi> {
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/formasi?id=${FormasiId}`
  );
  if (!res.ok) throw new Error("Failed to fetch Formasi");
  return res.json();
}

export async function setFormasi(data: Formasi): Promise<Formasi> {
  const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/formasi`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create Formasi");
  }
  return res.json();
}

export async function updateFormasi(data: Formasi): Promise<Formasi> {
  const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/formasi`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to update Formasi");
  }
  return res.json();
}

export async function deleteFormasi(id: string): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/formasi?id=${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to delete Formasi");
  }
  return res.json();
}
