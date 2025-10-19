"use client";

import React from "react";
import { ViewMode } from "../utils/constants";
import MarkdownPreview from "./MarkdownPreview";

interface MarkdownOutputProps {
  html: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onPrint: () => void;
  isLoading: boolean;
}

export default function MarkdownOutput({
  html,
  viewMode,
  setViewMode,
  onPrint,
  isLoading,
}: MarkdownOutputProps) {
  return (
    <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex gap-2">
          {[
            { key: 'html' as ViewMode, label: 'プレビュー' },
            { key: 'source' as ViewMode, label: 'ソース' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                viewMode === key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={onPrint}
          disabled={isLoading}
          className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
          }`}
          title="印刷用ウィンドウを開く"
        >
          {isLoading ? "..." : "プリント"}
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-96 lg:min-h-0">
        {viewMode === 'html' && <MarkdownPreview html={html} />}
        {viewMode === 'source' && (
          <pre className="p-5 text-xs font-mono text-gray-700 whitespace-pre-wrap bg-gray-50 h-full leading-relaxed">
            {html}
          </pre>
        )}
      </div>
    </div>
  );
}
