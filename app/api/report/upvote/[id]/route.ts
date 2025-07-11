import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/models/Issue";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: NextRequest, context: any) {
  const { id } = context.params;
  await connectDB();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const userId = (user as { _id: { toString: () => string } })._id.toString();
    const likedIndex = issue.likedBy.findIndex(
      (uid: any) => uid.toString() === userId
    );

    if (likedIndex === -1) {
      // Not liked yet → add like
      issue.likedBy.push(userId);
    } else {
      // Already liked → remove like
      issue.likedBy.splice(likedIndex, 1);
    }

    issue.upvotes = issue.likedBy.length;
    await issue.save();

    return NextResponse.json({
      upvotes: issue.upvotes,
      likedBy: issue.likedBy,
      liked: likedIndex === -1, // true if now liked
    });
  } catch (err) {
    console.error("Toggle like error:", err);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
