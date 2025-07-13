import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/models/Issue";

export async function DELETE(req: NextRequest, context: any) {
  await connectDB();
  const { id } = context.params;
  await Issue.findByIdAndDelete(id);

  return NextResponse.json({ message: "Issue deleted" });
}
