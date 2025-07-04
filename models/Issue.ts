import mongoose, { Schema } from "mongoose";

const IssueSchema = new Schema(
  {
    title: String,
    description: String,
    category: String,
    pin: String,
    lat: Number,
    lng: Number,
    media: {
      filename: String,
      mimetype: String,
      buffer: Buffer,
    },
  },
  { timestamps: true }
);

export const Issue =
  mongoose.models.Issue || mongoose.model("Issue", IssueSchema);
