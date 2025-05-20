"use client";

import React, { useState, useRef } from "react";
import MarkdownIt from "markdown-it";
import mk from "markdown-it-katex";
import html2pdf from "html2pdf.js";

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
      if (!previewRef.current) {
        alert("プレビューが見つかりません");
        return;
      }
      // ファイル名生成
      let title = markdown.split("\n")[0].replace(/^#*\s*/, "").trim();
      if (!title) title = "markdown";
      title = title.replace(/[\\\/:*?\"<>|]/g, "").slice(0, 50);

      await html2pdf()
        .set({
          margin: 10,
          filename: `${title}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(previewRef.current)
        .save();
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert("PDF生成エラー: " + e.message);
      } else {
        alert("PDF生成エラー: " + String(e));
      }
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
            ref={previewRef}
            className="markdown-body border rounded p-4 bg-white min-h-96"
            dangerouslySetInnerHTML={{ __html: mdParser.render(markdown) }}
          />
        </div>
      </div>
      <button
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
        onClick={handleDownloadPDF}
      >
        PDFダウンロード
      </button>
    </div>
  );
}
