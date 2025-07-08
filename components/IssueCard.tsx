"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { MapPin, ThumbsUp, MessageCircle, AlertCircle } from "lucide-react";
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
  comments: {
    text: string;
    createdAt: string;
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
      toast.success("Upvoted!");
    } catch {
      toast.error("Failed to upvote");
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
      const res = await fetch(`/api/report/${issue._id}/comment`, {
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

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200 p-4 flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {issue.title}
          </h2>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-gray-500" />
            {address}
          </p>
          <p className="text-xs text-gray-500">Category: {issue.category}</p>
        </div>

        {issue.media?.url && issue.media.mimetype.startsWith("image/") && (
          <div className="mt-2 rounded overflow-hidden w-full max-h-48">
            <Image
              src={issue.media.url}
              alt={issue.title}
              width={400}
              height={200}
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        )}

        {issue.media?.url && issue.media.mimetype.startsWith("video/") && (
          <div className="mt-2 rounded overflow-hidden">
            <video
              width="100%"
              height="200"
              controls
              className="rounded-md object-cover w-full max-h-48"
            >
              <source src={issue.media.url} type={issue.media.mimetype} />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <p className="text-sm text-gray-800 mt-2 line-clamp-3">
          {issue.description}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 mt-4 pt-2 border-t border-gray-200">
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
                <DialogDescription>See and add comments</DialogDescription>
              </DialogHeader>

              <div className="max-h-60 overflow-y-auto space-y-2 my-2">
                {commentList.length === 0 ? (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                ) : (
                  commentList.map((c, idx) => (
                    <div key={idx} className="bg-gray-100 p-2 rounded text-sm">
                      <p>{c.text}</p>
                      <p className="text-xs text-gray-400 text-right">
                        {new Date(c.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <Textarea
                rows={3}
                placeholder="Write a comment..."
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

        <span className="flex items-center gap-1 italic text-gray-500">
          <AlertCircle className="w-4 h-4" />
          In Progress
        </span>
      </div>
    </div>
  );
}
