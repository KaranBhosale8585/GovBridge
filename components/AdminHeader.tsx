"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, User } from "lucide-react";

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-xl sm:text-2xl font-bold text-gray-800 hover:text-black transition"
        >
          Admin Panel
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-black transition-colors"
          >
            <User size={20} />
            App
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 animate-slide-down">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block w-full px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-2">
              <User size={16} />
              App
            </div>
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="mt-2 w-full px-3 py-2 flex items-center gap-2 text-sm text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
