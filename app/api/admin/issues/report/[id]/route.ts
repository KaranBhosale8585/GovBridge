import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/models/Issue";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { status } = await req.json();

  const updatedIssue = await Issue.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  );
  return NextResponse.json(updatedIssue);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Issue.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Issue deleted" });
}
