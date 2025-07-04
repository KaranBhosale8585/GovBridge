"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "public",
  });
  const [msg, setMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  // Ensure client-only rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMsg(data.message || data.error);
    } catch (err) {
      setMsg("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-black px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5"
        autoComplete="off"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Register
        </h2>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>

        {/* Role Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {form.role === "admin"
              ? "Registering as Admin"
              : "Registering as Public"}
          </span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.role === "admin"}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.checked ? "admin" : "public",
                })
              }
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
          </label>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="new-password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        {/* Message */}
        {msg && (
          <p className="text-center text-sm text-red-500">
            {msg}{" "}
            {msg.toLowerCase().includes("success") && (
              <Link href="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            )}
          </p>
        )}
      </form>
    </div>
  );
}
