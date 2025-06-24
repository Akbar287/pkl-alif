import { Pagination } from "@/types/Pagination";
import { UserMhsInterface } from "@/types/ProfilTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPenggunaPagination(
  page: number,
  limit: number,
  search: string
): Promise<Pagination<UserMhsInterface[]>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/pengguna?${params.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch Pengguna");
  return res.json();
}

export async function getPengguna(): Promise<UserMhsInterface[]> {
  const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/pengguna`);
  if (!res.ok) throw new Error("Failed to fetch Pengguna");
  return res.json();
}

export async function getFormasiId(
  FormasiId: string
): Promise<UserMhsInterface> {
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/pengguna?id=${FormasiId}`
  );
  if (!res.ok) throw new Error("Failed to fetch Pengguna");
  return res.json();
}

export async function setPengguna(
  data: UserMhsInterface
): Promise<UserMhsInterface> {
  const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/pengguna`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create Pengguna");
  }
  return res.json();
}

export async function updatePengguna(
  data: UserMhsInterface
): Promise<UserMhsInterface> {
  const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/pengguna`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to update Pengguna");
  }
  return res.json();
}

export async function deletePengguna(id: string): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/pengguna?id=${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to delete Pengguna");
  }
  return res.json();
}
