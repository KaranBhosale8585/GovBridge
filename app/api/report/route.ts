import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/models/Issue";

// POST /api/report - Create new issue
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, description, category, pin, lat, lng, mediaUrl } = body;

    if (!title || !description || !category || !pin || !lat || !lng) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const issue = new Issue({
      title,
      description,
      category,
      pin,
      lat,
      lng,
      media: mediaUrl
        ? {
            url: mediaUrl,
            filename: mediaUrl.split("/").pop() || "unknown",
            mimetype: mediaUrl.endsWith(".mp4") ? "video/mp4" : "image/jpeg",
          }
        : null,
    });

    console.log("Saving issue with media URL:", issue.media?.url || "No media");

    await issue.save();

    return NextResponse.json({ message: "Issue submitted successfully!" });
  } catch (error) {
    console.error("Error saving issue:", error);
    return NextResponse.json(
      { error: "Failed to save issue" },
      { status: 500 }
    );
  }
}

// GET /api/report - Fetch all issues
export async function GET() {
  try {
    await connectDB();
    const issues = await Issue.find().sort({ createdAt: -1 });
    return NextResponse.json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      { error: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}
