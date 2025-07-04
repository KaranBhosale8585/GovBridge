"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

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
  const [media, setMedia] = useState<File | null>(null);
  const [position, setPosition] = useState<LatLng | null>(null);

  const fetchCoordinatesFromPIN = async (pin: string) => {
    try {
      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${pin}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}&limit=1`
      );
      const data = await res.json();
      const loc = data.results?.[0]?.geometry;

      if (loc) {
        setPosition({ lat: loc.lat, lng: loc.lng });
      } else {
        alert("❌ Location not found for this PIN code.");
      }
    } catch (err) {
      alert("❌ Failed to fetch coordinates from PIN.");
    }
  };

  useEffect(() => {
    if (!position && typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setPosition({ lat: coords.latitude, lng: coords.longitude });
          console.log("📍 Location detected:", coords);
        },
        (error) => {
          console.error("❌ Geolocation error:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("❌ Location access denied by user.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("❌ Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("❌ The request to get user location timed out.");
              break;
            default:
              alert("❌ An unknown error occurred.");
              break;
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [position]);
  
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

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setMedia(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!position) return alert("📍 Please select or detect a location first.");

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("category", form.category);
    data.append("pin", form.pin);
    data.append("lat", String(position.lat));
    data.append("lng", String(position.lng));
    if (media) data.append("media", media);

    const res = await fetch("/api/report", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      alert("✅ Issue submitted successfully!");
      setForm({ title: "", description: "", category: "", pin: "" });
      setMedia(null);
    } else {
      alert("❌ Failed to submit issue.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">📢 Report an Issue</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Image/Video Upload</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
            />
            {media && (
              <p className="text-sm mt-1 text-gray-600">
                Selected: {media.name}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">-- Choose --</option>
              <option value="garbage">Garbage</option>
              <option value="road">Road Damage</option>
              <option value="electricity">Electricity</option>
              <option value="water">Water</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">PIN Code</label>
            <input
              name="pin"
              value={form.pin}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
            <button
              type="button"
              className="text-sm text-blue-600 mt-1 underline"
              onClick={() => fetchCoordinatesFromPIN(form.pin)}
            >
              Detect Location from PIN
            </button>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Mark Location on Map
            </label>
            <div className="h-64 border rounded-md overflow-hidden">
              {position && (
                <LeafletMap position={position} setPosition={setPosition} />
              )}
            </div>
          </div>

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
