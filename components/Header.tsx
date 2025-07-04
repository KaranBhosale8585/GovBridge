import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          <Link href="/">CivicSync</Link>
        </h1>
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
    </div>
  );
};

export default Header;
