import { File } from "@/generated/prisma";
import { Pagination } from "@/types/Pagination";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getFilePagination(
  page: number,
  limit: number,
  search: string,
  FormasiId?: string
): Promise<Pagination<File[]>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/file?${params.toString()}${
      FormasiId ? "&formasi-id=" + FormasiId : ""
    }`
  );
  if (!res.ok) throw new Error("Failed to fetch File");
  return res.json();
}

export async function getFileByFormasiId(FormasiId?: string): Promise<File[]> {
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/file?${
      FormasiId ? "&magang-id=" + FormasiId : ""
    }`
  );
  if (!res.ok) throw new Error("Failed to fetch File");
  return res.json();
}

export async function getFileId(FileId: string): Promise<File> {
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/file?id=${FileId}`
  );
  if (!res.ok) throw new Error("Failed to fetch File");
  return res.json();
}

export async function setFile(data: File): Promise<File> {
  const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/file`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create File");
  }
  return res.json();
}

export async function updateFile(data: File): Promise<File> {
  const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/file`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to update File");
  }
  return res.json();
}

export async function deleteFile(id: string): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/file?id=${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to delete File");
  }
  return res.json();
}
