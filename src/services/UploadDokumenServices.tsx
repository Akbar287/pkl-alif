import { FileMhs } from "@/generated/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getFileBlobByNamafile(NamaFile: string): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/api/protected/upload-dokumen?file=${NamaFile}`
  );

  if (!res.ok) {
    throw new Error("Failed to get dokumen ");
  }

  const blob = await res.blob();
  const previewUrl = URL.createObjectURL(blob);
  return previewUrl;
}

export async function setFile(
  data: File,
  MhsId: string,
  FileId: string
): Promise<FileMhs> {
  const formData = new FormData();
  formData.append("files", data);
  formData.append("MhsId", MhsId);
  formData.append("FileId", FileId);

  const res = await fetch(`${BASE_URL}/api/protected/upload-dokumen`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload dokumen");
  }

  return await res.json();
}

export async function deleteFile(FileMhsId: string): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/protected/upload-dokumen?id=${FileMhsId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to upload dokumen");
  }
  return res.json();
}
