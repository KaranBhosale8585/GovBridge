"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import toast, { Toaster } from "react-hot-toast";
import { UploadButton } from "@/utils/uploadthing";

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

  // Auto-detect geolocation once on client
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation && !position) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setPosition({ lat: coords.latitude, lng: coords.longitude });
          console.log("📍 Auto location:", coords.latitude, coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [position]);

  // Handle form input changes
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

  // Get coordinates from PIN
  const fetchCoordinatesFromPIN = async (pin: string) => {
    try {
      toast.loading("📍 Locating from PIN...");
      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${pin}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}&limit=1`
      );
      const data = await res.json();
      toast.dismiss();

      const loc = data?.results?.[0]?.geometry;
      if (loc) {
        setPosition({ lat: loc.lat, lng: loc.lng });
        toast.success("📍 Location found!");
      } else {
        toast.error("No location found for this PIN.");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to get coordinates.");
    }
  };

  // Submit issue to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!position) return toast.error("📍 Please mark a location.");
    if (!mediaUrl) return toast.error("📷 Upload an image/video first.");

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
        toast.success("✅ Issue submitted!");
        setForm({ title: "", description: "", category: "", pin: "" });
        setMediaUrl(null);
      } else {
        toast.error("❌ Failed to submit.");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6">
      <Toaster />
      <Header />

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">📢 Report an Issue</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
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
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          {/* Upload */}
          <div>
            <label className="block font-medium mb-1">Image/Video Upload</label>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                console.log("Upload result:", res);
                if (res?.[0]?.url) {
                  setMediaUrl(res[0].url);
                  toast.success("📷 Uploaded successfully!");
                }
              }}
              onUploadError={(error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
            />
            {mediaUrl && (
              <p className="text-sm mt-1 text-gray-600 break-all">
                ✅ Uploaded: {mediaUrl}
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
              className="w-full border px-3 py-2 rounded-md"
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
              className="w-full border px-3 py-2 rounded-md"
              maxLength={6}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => fetchCoordinatesFromPIN(form.pin)}
              className="text-sm text-blue-600 mt-1 underline"
            >
              Detect from PIN
            </button>
          </div>

          {/* Map */}
          <div>
            <label className="block font-medium mb-1">
              Mark Location on Map
            </label>
            <div className="h-64 border rounded-md overflow-hidden">
              {position ? (
                <LeafletMap position={position} setPosition={setPosition} />
              ) : (
                <p className="text-center text-gray-400 pt-20">
                  📍 Detecting your location...
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Submit Issue
          </button>
        </form>
      </div>
    </div>
  );
}
