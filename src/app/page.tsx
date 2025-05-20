"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

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
          <div className="markdown-body border rounded p-4 bg-white min-h-96">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
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
