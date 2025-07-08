"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, FileEdit, LogIn, LogOut, UserPlus } from "lucide-react";

const Header = () => {
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
    <header className="border-b border-gray-300 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
          <Link href="/">GovBridge</Link>
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link
            href="/report"
            className="flex items-center gap-1 hover:text-black transition-colors"
          >
            <FileEdit size={16} /> Report
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1 hover:text-black transition-colors"
          >
            <LogIn size={16} /> Login
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-1 hover:text-black transition-colors"
          >
            <UserPlus size={16} /> Register
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 hover:text-black transition-colors"
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

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-sm font-medium text-gray-700">
          <Link
            href="/report"
            className="flex items-center gap-2 hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            <FileEdit size={16} /> Report
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            <LogIn size={16} /> Login
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            <UserPlus size={16} /> Register
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-2 hover:text-black"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
