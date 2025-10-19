"use client";

import React, { useState } from "react";
import { SAMPLE_PLACEHOLDER, ViewMode } from "../utils/constants";
import { extractTitle, generatePrintHTML } from "../utils/styles";
import { useMarkdownProcessor } from "../hooks/useMarkdownProcessor";
import Header from "../components/Header";
import MarkdownInput from "../components/MarkdownInput";
import MarkdownOutput from "../components/MarkdownOutput";

export default function Home() {
  const [markdown, setMarkdown] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('html');

  const html = useMarkdownProcessor(markdown);

  const handleOpenHtml = () => {
    setIsLoading(true);
    try {
      const title = extractTitle(markdown);
      const htmlDoc = generatePrintHTML(html, title);
      const win = window.open();
      if (win) {
        win.document.open();
        win.document.write(htmlDoc);
        win.document.close();
      } else {
        alert("新しいタブを開けませんでした。ポップアップブロックを解除してください。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMarkdown("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
        <MarkdownInput
          value={markdown}
          onChange={setMarkdown}
          onClear={handleClear}
          placeholder={SAMPLE_PLACEHOLDER}
        />

        <MarkdownOutput
          html={html}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onPrint={handleOpenHtml}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
