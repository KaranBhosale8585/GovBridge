"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";

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
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
          <Link href="/dashboard">Admin Panel</Link>
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-black transition-colors"
          >
            <User size={16} /> App
            </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-100 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-sm font-medium text-gray-700 animate-slide-down">
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-gray-100 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
