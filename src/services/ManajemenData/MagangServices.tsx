import { Magang } from "@/generated/prisma";
import { Pagination } from "@/types/Pagination";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMagangPagination(
  page: number,
  limit: number,
  search: string
): Promise<Pagination<Magang[]>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/magang?${params.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch Magang");
  return res.json();
}

export async function getMagang(): Promise<Magang[]> {
  const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/magang`);
  if (!res.ok) throw new Error("Failed to fetch Magang");
  return res.json();
}

export async function getMagangId(MagangId: string): Promise<Magang> {
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/magang?id=${MagangId}`
  );
  if (!res.ok) throw new Error("Failed to fetch Magang");
  return res.json();
}

export async function setMagang(data: Magang): Promise<Magang> {
  const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/magang`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create Magang");
  }
  return res.json();
}

export async function updateMagang(data: Magang): Promise<Magang> {
  const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/magang`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to update Magang");
  }
  return res.json();
}

export async function deleteMagang(id: string): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/magang?id=${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to delete Magang");
  }
  return res.json();
}
