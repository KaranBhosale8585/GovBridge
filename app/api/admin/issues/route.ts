import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/models/Issue";
import { verifyToken } from "@/utils/auth";

export async function GET(req: NextRequest) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  const user = token ? await verifyToken(token) : null;

  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const issues = await Issue.find()
    .populate("user", "name email")
    .populate("comments.user", "name email");
  return NextResponse.json(issues);
}
