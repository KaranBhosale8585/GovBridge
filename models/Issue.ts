import mongoose, { Schema } from "mongoose";

// ✅ Define Comment Schema separately (this is required!)
const CommentSchema = new Schema(
  {
    text: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const IssueSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    pin: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    upvotes: { type: Number, default: 0 },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },

    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [CommentSchema],
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
