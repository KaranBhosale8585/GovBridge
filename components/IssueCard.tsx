"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  MapPin,
  ThumbsUp,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Hammer,
  Clock,
  MapPinned,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Issue = {
  _id: string;
  title: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
  upvotes: number;
  status?: "open" | "in-progress" | "resolved";
  comments: {
    text: string;
    createdAt: string;
    user?: {
      name: string;
      email: string;
    };
  }[];
  media?: {
    url: string;
    filename: string;
    mimetype: string;
  };
};

export default function IssueCard({ issue }: { issue: Issue }) {
  const [address, setAddress] = useState("Resolving...");
  const [upvotes, setUpvotes] = useState(issue.upvotes);
  const [commentList, setCommentList] = useState(issue.comments || []);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${issue.lat}+${issue.lng}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`
        );
        const data = await res.json();
        const location = data?.results?.[0]?.formatted || "Unknown location";
        setAddress(location);
      } catch {
        setAddress("Location not found");
      }
    };

    fetchAddress();
  }, [issue.lat, issue.lng]);

  const handleUpvote = async () => {
    try {
      const res = await fetch(`/api/report/upvote/${issue._id}`, {
        method: "POST",
      });
      const data = await res.json();
      setUpvotes(data.upvotes);
      toast.success(data.liked ? "Upvoted!" : "Upvote removed");
    } catch {
      toast.error("Failed to update vote");
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/report/comment/${issue._id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCommentList(data.reverse());
      }
    } catch {
      toast.error("Failed to load comments");
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`/api/report/comment/${issue._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newComment }),
      });

      if (!res.ok) throw new Error();
      setNewComment("");
      toast.success("Comment added!");
      await loadComments();
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const statusBadge = (status?: string) => {
    switch (status) {
      case "resolved":
        return (
          <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Resolved
          </span>
        );
      case "in-progress":
        return (
          <span className="flex items-center gap-1 text-yellow-600 text-xs font-medium">
            <Hammer className="w-4 h-4" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-gray-500 text-xs font-medium">
            <Clock className="w-4 h-4" />
            Open
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col justify-between h-full">
      <div className="flex flex-col gap-3">
        {" "}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {issue.title}
          </h2>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-gray-500" />
            <span>{address}</span>
            <a
              href={`https://www.google.com/maps?q=${issue.lat},${issue.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-xs"
            >
              <MapPinned className="w-6 h-6 text-gray-500" />
            </a>
          </div>
          <p className="text-xs text-gray-500">Category: {issue.category}</p>
        </div>
        {/* Media */}
        {issue.media?.url && issue.media.mimetype.startsWith("image/") && (
          <div className="rounded-md overflow-hidden mt-1">
            <Image
              src={issue.media.url}
              alt={issue.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}
        {issue.media?.url && issue.media.mimetype.startsWith("video/") && (
          <video controls className="rounded-md mt-1 object-cover w-full h-48">
            <source src={issue.media.url} type={issue.media.mimetype} />
            Your browser does not support the video tag.
          </video>
        )}
        {/* Description */}
        <p className="text-sm text-gray-800 line-clamp-3">
          {issue.description}
        </p>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between text-xs text-gray-600 mt-4 pt-2 border-t border-gray-200">
        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleUpvote}
            className="flex items-center gap-1 hover:text-black"
          >
            <ThumbsUp className="w-4 h-4" />
            {upvotes}
          </button>

          <Dialog onOpenChange={(open) => open && loadComments()}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 hover:text-black">
                <MessageCircle className="w-4 h-4" />
                {commentList.length}
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Comments</DialogTitle>
                <DialogDescription>
                  See and post public feedback
                </DialogDescription>
              </DialogHeader>

              {/* Comments List */}
              <div className="max-h-60 overflow-y-auto space-y-2 mt-2">
                {commentList.length === 0 ? (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                ) : (
                  commentList.map((c, idx) => (
                    <div key={idx} className="bg-gray-100 p-2 rounded text-sm">
                      <p className="font-medium">
                        {c.user?.name || c.user?.email || "Anonymous"}
                      </p>
                      <p>{c.text}</p>
                      <p className="text-xs text-gray-400 text-right">
                        {new Date(c.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <Textarea
                rows={3}
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <DialogFooter className="mt-2">
                <Button onClick={submitComment} disabled={!newComment.trim()}>
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Status */}
        <div>{statusBadge(issue.status)}</div>
      </div>
    </div>
  );
}
