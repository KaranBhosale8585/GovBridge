"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, ThumbsUp, MessageCircle, AlertCircle } from "lucide-react";

type Issue = {
  _id: string;
  title: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
  upvotes: number;
  comments: number;
  media?: {
    url: string;
    filename: string;
    mimetype: string;
  };
};

export default function IssueCard({ issue }: { issue: Issue }) {
  const [address, setAddress] = useState("Resolving...");

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

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200 p-4 flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2">
        {/* Title & Meta */}
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

        {/* Media Preview */}
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

        {/* Description */}
        <p className="text-sm text-gray-800 mt-2 line-clamp-3">
          {issue.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-gray-600 mt-4 pt-2 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            {issue.upvotes || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {issue.comments || 0}
          </span>
        </div>
        <span className="flex items-center gap-1 italic text-gray-500">
          <AlertCircle className="w-4 h-4" />
          In Progress
        </span>
      </div>
    </div>
  );
}
