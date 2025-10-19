"use client";

import React from "react";

interface MarkdownInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
}

export default function MarkdownInput({
  value,
  onChange,
  onClear,
  placeholder,
}: MarkdownInputProps) {
  return (
    <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <span className="font-semibold text-gray-700 text-sm">入力</span>
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
          title="クリア"
        >
          クリア
        </button>
      </div>
      <textarea
        className="flex-1 p-5 font-mono text-sm text-gray-800 resize-none border-none outline-none focus:ring-0 leading-relaxed min-h-96 lg:min-h-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
