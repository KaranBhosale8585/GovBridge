"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import toast from "react-hot-toast";
import IssueCard from "@/components/IssueCard";
import { Loader, MapPin } from "lucide-react";

type Issue = {
  _id: string;
  title: string;
  description: string;
  category: string;
  pin: string;
  lat: number;
  lng: number;
  upvotes: number;
  comments: { text: string; createdAt: string }[];
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
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/report");
      const data = await res.json();

      if (Array.isArray(data)) {
        setIssues(data);
      } else {
        console.error("Unexpected data from API:", data);
        setIssues([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load issues");
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

 // Will show the same payload echoed back

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

  const filteredIssues = Array.isArray(issues)
    ? issues.filter((issue) => {
        return (
          (filterPin ? issue.pin.includes(filterPin) : true) &&
          (filterCategory ? issue.category === filterCategory : true)
        );
      })
    : [];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black px-4 sm:px-6 py-8">
        {/* Location & Filters */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Location Info */}
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <MapPin className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 truncate max-w-[250px] sm:max-w-none">
                {location}
              </span>
              <button
                onClick={detectLocation}
                className="text-xs underline text-gray-600 hover:text-black transition ml-2"
              >
                Auto-detect
              </button>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Filter by PIN"
                value={filterPin}
                onChange={(e) => setFilterPin(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-black text-sm w-40"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-black text-sm w-40"
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
        </div>

        {/* Issues Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center mt-10">
              <Loader className="h-8 w-8 animate-spin text-gray-700" />
            </div>
          ) : filteredIssues.length === 0 ? (
            <p className="text-center text-gray-500 text-sm mt-10">
              No issues found.
            </p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredIssues.map((issue) => (
                <IssueCard key={issue._id} issue={issue} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}