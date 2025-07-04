// app/api/report/route.ts
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/models/Issue";

export async function POST(req: NextRequest) {
  await connectDB();

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const pin = formData.get("pin") as string;
  const lat = parseFloat(formData.get("lat") as string);
  const lng = parseFloat(formData.get("lng") as string);
  const media = formData.get("media") as File | null;

  const buffer = media ? Buffer.from(await media.arrayBuffer()) : null;

  try {
    const issue = new Issue({
      title,
      description,
      category,
      pin,
      lat,
      lng,
      media: media
        ? {
            filename: media.name,
            mimetype: media.type,
            buffer,
          }
        : null,
    });

    await issue.save();
    return Response.json({ message: "Issue submitted successfully!" });
  } catch (error) {
    console.error("Error saving issue:", error);
    return new Response("Failed to save issue", { status: 500 });
  }
}
