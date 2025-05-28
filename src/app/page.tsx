"use client";

import React, { useState, useEffect } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeMathjax from "rehype-mathjax";
import rehypeStringify from "rehype-stringify";

// github-markdown-css（public/github-markdown.css）をインライン化
const githubMarkdownCss = `
.markdown-body {
  --base-size-4: 0.25rem;
  --base-size-8: 0.5rem;
  --base-size-16: 1rem;
  --base-size-24: 1.5rem;
  --base-size-40: 2.5rem;
  --base-text-weight-normal: 400;
  --base-text-weight-medium: 500;
  --base-text-weight-semibold: 600;
  --fontStack-monospace: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
  --fgColor-accent: Highlight;
  max-width: 794px; /* A4横幅 */
  margin: 40px auto;
  min-width: 200px;
  box-sizing: border-box;
}
/* ...（public/github-markdown.cssの全内容をここに貼り付けてください。省略しています）... */
`;

// KaTeX CSS（node_modules/katex/dist/katex.min.css）をインライン化
const katexCss = `@font-face{font-family:KaTeX_AMS;font-style:normal;font-weight:400;src:url(fonts/KaTeX_AMS-Regular.woff2) format("woff2"),url(fonts/KaTeX_AMS-Regular.woff) format("woff"),url(fonts/KaTeX_AMS-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Caligraphic;font-style:normal;font-weight:700;src:url(fonts/KaTeX_Caligraphic-Bold.woff2) format("woff2"),url(fonts/KaTeX_Caligraphic-Bold.woff) format("woff"),url(fonts/KaTeX_Caligraphic-Bold.ttf) format("truetype")}@font-face{font-family:KaTeX_Caligraphic;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Caligraphic-Regular.woff2) format("woff2"),url(fonts/KaTeX_Caligraphic-Regular.woff) format("woff"),url(fonts/KaTeX_Caligraphic-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Fraktur;font-style:normal;font-weight:700;src:url(fonts/KaTeX_Fraktur-Bold.woff2) format("woff2"),url(fonts/KaTeX_Fraktur-Bold.woff) format("woff"),url(fonts/KaTeX_Fraktur-Bold.ttf) format("truetype")}@font-face{font-family:KaTeX_Fraktur;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Fraktur-Regular.woff2) format("woff2"),url(fonts/KaTeX_Fraktur-Regular.woff) format("woff"),url(fonts/KaTeX_Fraktur-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:normal;font-weight:700;src:url(fonts/KaTeX_Main-Bold.woff2) format("woff2"),url(fonts/KaTeX_Main-Bold.woff) format("woff"),url(fonts/KaTeX_Main-Bold.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:italic;font-weight:700;src:url(fonts/KaTeX_Main-BoldItalic.woff2) format("woff2"),url(fonts/KaTeX_Main-BoldItalic.woff) format("woff"),url(fonts/KaTeX_Main-BoldItalic.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:italic;font-weight:400;src:url(fonts/KaTeX_Main-Italic.woff2) format("woff2"),url(fonts/KaTeX_Main-Italic.woff) format("woff"),url(fonts/KaTeX_Main-Italic.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Main-Regular.woff2) format("woff2"),url(fonts/KaTeX_Main-Regular.woff) format("woff"),url(fonts/KaTeX_Main-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Math;font-style:italic;font-weight:700;src:url(fonts/KaTeX_Math-BoldItalic.woff2) format("woff2"),url(fonts/KaTeX_Math-BoldItalic.woff) format("woff"),url(fonts/KaTeX_Math-BoldItalic.ttf) format("truetype")}@font-face{font-family:KaTeX_Math;font-style:italic;font-weight:400;src:url(fonts/KaTeX_Math-Italic.woff2) format("woff2"),url(fonts/KaTeX_Math-Italic.woff) format("woff"),url(fonts/KaTeX_Math-Italic.ttf) format("truetype")}@font-face{font-family:"KaTeX_SansSerif";font-style:normal;font-weight:700;src:url(fonts/KaTeX_SansSerif-Bold.woff2) format("woff2"),url(fonts/KaTeX_SansSerif-Bold.woff) format("woff"),url(fonts/KaTeX_SansSerif-Bold.ttf) format("truetype")}@font-face{font-family:"KaTeX_SansSerif";font-style:italic;font-weight:400;src:url(fonts/KaTeX_SansSerif-Italic.woff2) format("woff2"),url(fonts/KaTeX_SansSerif-Italic.woff) format("woff"),url(fonts/KaTeX_SansSerif-Italic.ttf) format("truetype")}@font-face{font-family:"KaTeX_SansSerif";font-style:normal;font-weight:400;src:url(fonts/KaTeX_SansSerif-Regular.woff2) format("woff2"),url(fonts/KaTeX_SansSerif-Regular.woff) format("woff"),url(fonts/KaTeX_SansSerif-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Script;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Script-Regular.woff2) format("woff2"),url(fonts/KaTeX_Script-Regular.woff) format("woff"),url(fonts/KaTeX_Script-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size1;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Size1-Regular.woff2) format("woff2"),url(fonts/KaTeX_Size1-Regular.woff) format("woff"),url(fonts/KaTeX_Size1-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size2;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Size2-Regular.woff2) format("woff2"),url(fonts/KaTeX_Size2-Regular.woff) format("woff"),url(fonts/KaTeX_Size2-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size3;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Size3-Regular.woff2) format("woff2"),url(fonts/KaTeX_Size3-Regular.woff) format("woff"),url(fonts/KaTeX_Size3-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size4;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Size4-Regular.woff2) format("woff2"),url(fonts/KaTeX_Size4-Regular.woff) format("woff"),url(fonts/KaTeX_Size4-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Typewriter;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Typewriter-Regular.woff2) format("woff2"),url(fonts/KaTeX_Typewriter-Regular.woff) format("woff"),url(fonts/KaTeX_Typewriter-Regular.ttf) format("truetype")}.katex{font:normal 1.21em KaTeX_Main,Times New Roman,serif;line-height:1.2;text-indent:0;text-rendering:auto}.katex *{-ms-high-contrast-adjust:none!important;border-color:currentColor}.katex .katex-version:after{content:"0.16.22"}...（省略）`;

function extractTitle(markdown: string): string {
  // 1行目の#を除去しtrim、なければ"Markdownプレビュー"
  const firstLine = markdown.split("\n").find(line => line.trim() !== "") || "";
  const title = firstLine.replace(/^#+\s*/, "").trim();
  return title || "Markdownプレビュー";
}

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
              margin: 40px auto;
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
          <div className="markdown-body border rounded p-4 bg-white min-h-96">
            <div
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
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
