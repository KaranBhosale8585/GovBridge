"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import toast, { Toaster } from "react-hot-toast";
import IssueCard from "@/components/IssueCard";

type Issue = {
  _id: string;
  title: string;
  description: string;
  category: string;
  pin: string;
  lat: number;
  lng: number;
  upvotes: number;
  comments: number;
  createdAt: string;
  media?: {
    url: string;
    filename: string;
    mimetype: string;
  };
};

export default function HomePage() {
  const [location, setLocation] = useState("Auto-detecting...");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filterPin, setFilterPin] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const fetchIssues = async () => {
    try {
      const res = await fetch("/api/report");
      const data = await res.json();
      setIssues(data);
    } catch (err) {
      toast.error("Failed to load issues");
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported.");
      return;
    }

    toast.loading("Detecting location...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${coords.latitude}+${coords.longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`
        )
          .then((res) => res.json())
          .then((data) => {
            const loc = data?.results?.[0]?.formatted || "Location detected";
            setLocation(loc);
            toast.dismiss();
            toast.success("Location detected!");
          })
          .catch(() => {
            toast.dismiss();
            toast.error("Failed to get location name.");
          });
      },
      (error) => {
        toast.dismiss();
        toast.error("Location detection failed.");
        console.error("Geolocation error:", error);
      }
    );
  };

  const filteredIssues = issues.filter((issue) => {
    return (
      (filterPin ? issue.pin.includes(filterPin) : true) &&
      (filterCategory ? issue.category === filterCategory : true)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-6">
      <Toaster />
      <Header />

      {/* Location and filters */}
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

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Filter by PIN"
            value={filterPin}
            onChange={(e) => setFilterPin(e.target.value)}
            className="px-3 py-2 border rounded-md w-40"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border rounded-md w-40"
          >
            <option value="">All Categories</option>
            <option value="garbage">Garbage</option>
            <option value="road">Road Damage</option>
            <option value="electricity">Electricity</option>
            <option value="water">Water</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Issues */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {filteredIssues.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No issues found.
          </p>
        ) : (
          filteredIssues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))
        )}
      </div>
    </div>
  );
}
