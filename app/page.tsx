"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const [location, setLocation] = useState("Auto-detecting...");

  const issue = {
    title: "Garbage Overflow",
    location: "Sector 8, Pune",
    imageUrl: "/garbage.jpg",
    upvotes: 12,
    comments: 5,
    status: "In Progress",
  };

  const detectLocation = () => {
    // You can implement Geolocation API here
    setLocation("Sector 8, Pune");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">CivicSync</h1>
        <nav className="space-x-4">
          <Link href="/report" className="text-blue-600 hover:underline">
            Report
          </Link>
        </nav>
        <nav className="space-x-4">
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </nav>
      </header>

      {/* Location and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📍</span>
          <span>{location}</span>
          <button
            onClick={detectLocation}
            className="text-sm text-blue-600 hover:underline ml-2"
          >
            Auto-detect
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search issues..."
            className="px-3 py-2 border rounded-md w-48"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Filter
          </button>
        </div>
      </div>

      {/* Issue Card */}
      <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-md mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-1">🏷️ {issue.title}</h2>
            <p className="text-sm text-gray-600">🗺️ {issue.location}</p>
          </div>
          <Image
            src={issue.imageUrl}
            alt="Issue"
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
        </div>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
          <div>
            👍 {issue.upvotes} upvotes &nbsp;|&nbsp; 💬 {issue.comments}{" "}
            comments
          </div>
          <div className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
            Status: {issue.status}
          </div>
        </div>
      </div>
    </div>
  );
}
