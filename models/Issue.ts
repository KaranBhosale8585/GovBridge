import mongoose, { Schema } from "mongoose";

const IssueSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    pin: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    upvotes: { type: Number, default: 0 },
    comments: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    media: {
      url: String,
      filename: String,
      mimetype: String,
    },
  },
  { timestamps: true }
);

export const Issue =
  mongoose.models.Issue || mongoose.model("Issue", IssueSchema);
