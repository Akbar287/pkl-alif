import { Status } from "@/generated/prisma";
import { Pagination } from "@/types/Pagination";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getStatusPagination(
  page: number,
  limit: number,
  search: string
): Promise<Pagination<Status[]>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/status?${params.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
}

export async function getStatus(): Promise<Status[]> {
  const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/status`);
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
}

export async function getStatusId(statusId: string): Promise<Status> {
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/status?id=${statusId}`
  );
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
}

export async function setStatus(data: Status): Promise<Status> {
  const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create status");
  }
  return res.json();
}

export async function updateStatus(data: Status): Promise<Status> {
  const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to update status");
  }
  return res.json();
}

export async function deleteStatus(id: string): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/protected/manajemen-data/status?id=${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to delete status");
  }
  return res.json();
}
