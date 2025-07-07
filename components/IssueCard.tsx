"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

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
      } catch (err) {
        setAddress("Location not found");
      }
    };
    fetchAddress();
  }, [issue.lat, issue.lng]);

  console.log(issue)

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition duration-200 p-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-1">{issue.title}</h2>
          <p className="text-sm text-gray-600">📍 {address}</p>
          <p className="text-xs text-gray-400 mt-1">🗂️ {issue.category}</p>
        </div>

        {/* Render image or video */}
        {issue.media?.url && issue.media.mimetype.startsWith("image/") && (
          <Image
            src={issue.media.url}
            alt={issue.title}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
        )}
        {issue.media?.url && issue.media.mimetype.startsWith("video/") && (
          <video width={80} height={80} controls className="rounded-md">
            <source src={issue.media.url} type={issue.media.mimetype} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <p className="text-sm text-gray-700 mt-3 line-clamp-3">
        {issue.description}
      </p>

      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="text-gray-600">
          👍 {issue.upvotes || 0} &nbsp;| 💬 {issue.comments || 0}
        </div>
        <div className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
          Status: In Progress
        </div>
      </div>
    </div>
  );
}
