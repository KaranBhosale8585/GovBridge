import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/user"; // make sure this exists

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const payload = await verifyToken(token);
    await connectDB();

    const user = await User.findOne({ email: payload?.email });
    if (!user) return null;

    return user; // Full user doc including _id
  } catch (error) {
    console.error("Invalid token or DB error:", error);
    return null;
  }
}
