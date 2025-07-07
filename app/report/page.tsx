"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import toast, { Toaster } from "react-hot-toast";
import { UploadButton } from "@/utils/uploadthing";
import {
  Megaphone,
  Image as ImageIcon,
  LocateFixed,
  MapPin,
} from "lucide-react";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});

type LatLng = { lat: number; lng: number };

export default function ReportIssuePage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    pin: "",
  });

  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [position, setPosition] = useState<LatLng | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !position && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setPosition({ lat: coords.latitude, lng: coords.longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [mounted, position]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "pin" && value.length === 6) {
      fetchCoordinatesFromPIN(value);
    }
  };

  const fetchCoordinatesFromPIN = async (pin: string) => {
    try {
      toast.loading("Locating from PIN...");
      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${pin}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}&limit=1`
      );
      const data = await res.json();
      toast.dismiss();

      const loc = data?.results?.[0]?.geometry;
      if (loc) {
        setPosition({ lat: loc.lat, lng: loc.lng });
        toast.success("Location found");
      } else {
        toast.error("No location found for this PIN");
      }
    } catch {
      toast.dismiss();
      toast.error("Failed to get coordinates");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!position) return toast.error("Please mark a location.");
    if (!mediaUrl) return toast.error("Upload an image or video first.");

    const payload = {
      ...form,
      lat: position.lat,
      lng: position.lng,
      mediaUrl,
    };

    toast.loading("Submitting...");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.dismiss();
      if (res.ok) {
        toast.success("Issue submitted");
        setForm({ title: "", description: "", category: "", pin: "" });
        setMediaUrl(null);
      } else {
        toast.error("Failed to submit");
      }
    } catch {
      toast.dismiss();
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black px-4 sm:px-6 py-8">
        <Toaster />
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <Megaphone className="w-6 h-6" />
            Report an Issue
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-black"
                autoComplete="off"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-black"
              />
            </div>

            {/* Upload */}
            <div>
              <label className="block font-medium mb-1 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Image / Video Upload
              </label>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.url) {
                    setMediaUrl(res[0].url);
                    toast.success("Upload successful");
                  }
                }}
                onUploadError={(error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
              />
              {mediaUrl && (
                <p className="text-sm mt-2 text-gray-600 break-all">
                  Uploaded: {mediaUrl}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-black"
              >
                <option value="">-- Select Category --</option>
                <option value="garbage">Garbage</option>
                <option value="road">Road Damage</option>
                <option value="electricity">Electricity</option>
                <option value="water">Water</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* PIN Input */}
            <div>
              <label className="block font-medium mb-1">PIN Code</label>
              <input
                name="pin"
                value={form.pin}
                onChange={handleChange}
                maxLength={6}
                required
                type="number"
                autoComplete="off"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-black"
              />
              <button
                type="button"
                onClick={() => fetchCoordinatesFromPIN(form.pin)}
                className="text-sm flex items-center gap-1 text-gray-700 mt-2 underline hover:text-black"
              >
                <LocateFixed className="w-4 h-4" />
                Detect from PIN
              </button>
            </div>

            {/* Map */}
            <div>
              <label className="block font-medium mb-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Mark Location on Map
              </label>
              <div className="h-64 sm:h-72 md:h-80 border rounded-md overflow-hidden">
                {mounted && position ? (
                  <LeafletMap position={position} setPosition={setPosition} />
                ) : (
                  <p className="text-center text-gray-400 pt-20">
                    Detecting your location...
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 transition"
            >
              Submit Issue
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
