"use client";

import React, { useState, useEffect } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeMathjax from "rehype-mathjax";
import rehypeStringify from "rehype-stringify";
import MarkdownPreview from "../components/MarkdownPreview";
import { githubMarkdownCss, katexCss, extractTitle } from "../utils/styles";

const SAMPLE_PLACEHOLDER = `# マークダウン→PDF変換デモ

日本語・**太字**・*イタリック*・[リンク](https://example.com)  
数式もOK: $E=mc^2$

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
`;

export default function Home() {
  const [markdown, setMarkdown] = useState<string>(""); // 初期値は空

  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Markdown→HTML変換（remark/rehypeパイプライン）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeMathjax)
        .use(rehypeStringify)
        .process(markdown);
      if (!cancelled) setHtml(String(file));
    })();
    return () => {
      cancelled = true;
    };
  }, [markdown]);

  // 新しいウィンドウでHTML表示
  const handleOpenHtml = () => {
    setIsLoading(true);
    try {
      const title = extractTitle(markdown);
      const htmlDoc = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>${githubMarkdownCss}</style>
          <style>${katexCss}</style>
          <style>
            body {
              box-sizing: border-box;
              margin: 0;
              padding: 40px;
              background: #fff;
            }
            .markdown-body {
              box-sizing: border-box;
              min-width: 200px;
              max-width: 794px;
              margin: 0 auto;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <article class="markdown-body">
            ${html}
          </article>
        </body>
        </html>
      `;
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

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold mb-6">Markdown PDF変換</h1>
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
            placeholder={SAMPLE_PLACEHOLDER}
          />
        </div>
        {/* プレビュー */}
        <div className="flex-1 flex flex-col">
          <label className="mb-2 font-semibold">プレビュー</label>
          <MarkdownPreview html={html} />
        </div>
      </div>
      <button
        className={`mt-8 px-6 py-3 rounded font-bold transition ${
          isLoading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        onClick={handleOpenHtml}
        disabled={isLoading}
      >
        {isLoading ? (
          <span>
            <svg
              className="inline mr-2 w-5 h-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
              <path d="M12 2v4" />
              <path d="M12 22v-4" />
              <path d="M2 12h4" />
              <path d="M22 12h-4" />
            </svg>
            生成中...
          </span>
        ) : (
          "HTML新規タブで表示"
        )}
      </button>
    </div>
  );
}
