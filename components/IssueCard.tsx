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
    filename: string;
    mimetype: string;
    buffer?: any;
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

  const imageSrc = issue.media?.buffer
    ? `data:${issue.media.mimetype};base64,${Buffer.from(
        issue.media.buffer.data
      ).toString("base64")}`
    : "/placeholder.jpg";

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition duration-200 p-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold mb-1">{issue.title}</h2>
          <p className="text-sm text-gray-600">📍 {address}</p>
          <p className="text-xs text-gray-400 mt-1">🗂️ {issue.category}</p>
        </div>
        {issue.media?.buffer && (
          <Image
            src={imageSrc}
            alt={issue.title}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
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
