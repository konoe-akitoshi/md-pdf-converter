"use client";

import React from "react";

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-5 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Markdown Print
        </h1>
      </div>
    </header>
  );
}
