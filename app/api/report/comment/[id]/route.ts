import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/models/Issue";

// POST: Add a comment
export async function POST(req: NextRequest, context: any) {
  await connectDB();
  const { id } = context.params;
  const { comment } = await req.json();

  if (!comment || comment.trim() === "") {
    return NextResponse.json({ error: "Comment is required" }, { status: 400 });
  }

  try {
    const updated = await Issue.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            text: comment,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Comment error:", err);
    return NextResponse.json({ error: "Failed to comment" }, { status: 500 });
  }
}

// GET: Fetch comments
export async function GET(req: NextRequest, context: any) {
  await connectDB();
  const { id } = context.params;

  try {
    const issue = await Issue.findById(id).select("comments");

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(issue.comments || []);
  } catch (err) {
    console.error("Fetch comments error:", err);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
