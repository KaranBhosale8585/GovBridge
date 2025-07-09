import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/models/Issue";

export async function POST(req: NextRequest, context: any) {
  const { id } = context.params;
  await connectDB();

  try {
    const updated = await Issue.findByIdAndUpdate(
      id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json({ upvotes: updated.upvotes });
  } catch (err) {
    console.error("Upvote error:", err);
    return NextResponse.json({ error: "Failed to upvote" }, { status: 500 });
  }
}
