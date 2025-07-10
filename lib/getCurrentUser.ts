// lib/getCurrentUser.ts
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const payload = await verifyToken(token);
  return payload;
}
