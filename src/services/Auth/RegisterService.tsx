import { UserMhsInterface } from "@/types/ProfilTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function setRegister(
  data: UserMhsInterface
): Promise<UserMhsInterface> {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to register");
  }
  return res.json();
}
