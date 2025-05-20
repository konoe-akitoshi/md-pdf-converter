"use client";

import React, { useState, useRef } from "react";
import MarkdownIt from "markdown-it";
import mk from "markdown-it-katex";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const mdParser = MarkdownIt({ html: true, linkify: true, typographer: true }).use(mk);
export default function Home() {
  const [markdown, setMarkdown] = useState<string>(
    `# マークダウン→PDF変換デモ

日本語・**太字**・*イタリック*・[リンク](https://example.com)  
数式もOK: $E=mc^2$

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
`
  );
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    try {
      const res = await fetch("/api/md2pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown }),
      });
      if (!res.ok) {
        const errText = await res.text();
        alert("PDF生成エラー: " + errText);
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Content-Dispositionヘッダからファイル名を取得
      let filename = "markdown.pdf";
      const disposition = res.headers.get("Content-Disposition");
      if (disposition) {
        const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)["']?/i);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert("PDF生成エラー: " + e?.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold mb-6">Markdown→PDF変換サイト</h1>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        {/* 入力エリア */}
        <div className="flex-1 flex flex-col">
          <label className="mb-2 font-semibold" htmlFor="markdown-input">
            マークダウン入力
          </label>
          <textarea
            id="markdown-input"
            className="w-full h-96 p-3 border rounded resize-y font-mono text-base"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="ここにMarkdownを入力してください"
          />
        </div>
        {/* プレビュー */}
        <div className="flex-1 flex flex-col">
          <label className="mb-2 font-semibold">プレビュー</label>
          <div
            className="w-full h-96 overflow-auto border rounded bg-white text-black p-4"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            dangerouslySetInnerHTML={{ __html: mdParser.render(markdown) }}
          />
          {/* PDF用: 非表示・高さ制限なし */}
          <div
            ref={previewRef}
            className="w-full border rounded bg-white text-black p-4 absolute left-[-9999px] top-0"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", position: "absolute", left: "-9999px", top: 0 }}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: mdParser.render(markdown) }}
          />
        </div>
      </div>
      <button
        className="mt-8 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
        onClick={handleDownloadPDF}
      >
        PDFとしてダウンロード
      </button>
      <div className="mt-8 text-sm text-gray-500">
        日本語・数式（KaTeX）・画像・リンク等に対応
      </div>
    </div>
  );
}
