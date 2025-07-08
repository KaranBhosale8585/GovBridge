import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/models/Issue";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } } // ✅ Correct usage
) {
  await connectDB();

  const { id } = params;
  console.log("Upvote request received for issue:", id);

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
