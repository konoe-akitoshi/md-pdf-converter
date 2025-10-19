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

## 機能

- [x] GitHub Flavored Markdown
- [x] 数式レンダリング (KaTeX)
- [x] リアルタイムプレビュー
- [ ] PDF出力

### コードブロック

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### 数式

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

### テーブル

| 項目 | 説明 |
|------|------|
| Markdown | 軽量マークアップ言語 |
| PDF | Portable Document Format |
`;

type ViewMode = 'html' | 'source' | 'debug';

interface Options {
  gfm: boolean;
  math: boolean;
  breaks: boolean;
}

export default function Home() {
  const [markdown, setMarkdown] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [sourceHtml, setSourceHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('html');
  const [options, setOptions] = useState<Options>({
    gfm: true,
    math: true,
    breaks: false,
  });

  // ChatGPT形式の数式記法を標準記法に変換
  const preprocessMath = (text: string): string => {
    // インライン数式: \( ... \) または ( ... ) (LaTeX含む) を $ ... $ に変換
    let result = text.replace(/\\\(([^)]+)\\\)/g, '$$$1$$');
    result = result.replace(/\(([^)]*\\[^)]+[^)]*)\)/g, '$$$1$$');

    // ブロック数式: \[ ... \] または [ ... ] (LaTeX含む) を $$ ... $$ に変換
    result = result.replace(/\\\[([^\]]+)\\\]/g, '\n$$$$$$\n$1\n$$$$$$\n');
    result = result.replace(/^\[\s*\n/gm, '\n$$$$$$\n');
    result = result.replace(/\n\s*\]$/gm, '\n$$$$$$\n');
    result = result.replace(/\[([^\]]*\\[^\]]+[^\]]*)\]/g, '\n$$$$$$\n$1\n$$$$$$\n');

    return result;
  };

  // Markdown→HTML変換（remark/rehypeパイプライン）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // 前処理: ChatGPT形式の数式を標準記法に変換
        const processedMarkdown = preprocessMath(markdown);

        const file = await unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkMath)
          .use(remarkRehype)
          .use(rehypeMathjax)
          .use(rehypeStringify)
          .process(processedMarkdown);

        const htmlResult = String(file);

        if (!cancelled) {
          setHtml(htmlResult);
          setSourceHtml(htmlResult);
        }
      } catch (error) {
        console.error('Markdown processing error:', error);
        if (!cancelled) {
          setHtml('<p style="color: red;">エラー: Markdownの処理に失敗しました</p>');
          setSourceHtml('');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [markdown, options]);

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
              padding: 2rem;
              background: #fff;
            }
            .markdown-body {
              box-sizing: border-box;
              min-width: 200px;
              max-width: 794px;
              margin: 0 auto;
              padding: 0;
              font-size: 18px;
              line-height: 1.7;
              color: #111827;
            }
            .markdown-body h1 {
              color: #111827;
              font-size: 2.25rem;
              font-weight: 700;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 0.5rem;
              margin-bottom: 1.5rem;
            }
            .markdown-body h2 {
              color: #1f2937;
              font-size: 1.875rem;
              font-weight: 600;
              border-bottom: 2px solid #6b7280;
              padding-bottom: 0.5rem;
              margin-bottom: 1rem;
            }
            .markdown-body h3 {
              color: #374151;
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 0.75rem;
            }
            .markdown-body h4,
            .markdown-body h5,
            .markdown-body h6 {
              color: #4b5563;
              font-weight: 600;
              margin-bottom: 0.5rem;
            }
            .markdown-body p {
              color: #111827;
              margin-bottom: 1rem;
              font-size: 18px;
            }
            .markdown-body code {
              background-color: #f3f4f6;
              color: #dc2626;
              padding: 0.25rem 0.5rem;
              border-radius: 0.375rem;
              font-size: 16px;
              font-weight: 500;
            }
            .markdown-body pre {
              background-color: #f9fafb;
              border: 2px solid #e5e7eb;
              border-radius: 0.75rem;
              padding: 1.5rem;
              font-size: 16px;
              color: #111827;
            }
            .markdown-body pre code {
              background: none;
              color: #111827;
              padding: 0;
              font-size: 16px;
            }
            .markdown-body blockquote {
              border-left: 4px solid #3b82f6;
              background-color: #eff6ff;
              padding: 1.5rem;
              border-radius: 0 0.75rem 0.75rem 0;
              color: #1e40af;
              font-size: 18px;
            }
            .markdown-body table {
              border-collapse: collapse;
              border-radius: 0.75rem;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              font-size: 16px;
            }
            .markdown-body th {
              background-color: #f3f4f6;
              font-weight: 700;
              color: #111827;
              padding: 1rem;
            }
            .markdown-body td {
              color: #111827;
              padding: 1rem;
            }
            .markdown-body tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .markdown-body ul,
            .markdown-body ol {
              color: #111827;
              font-size: 18px;
            }
            .markdown-body li {
              margin-bottom: 0.5rem;
            }
            .markdown-body a {
              color: #2563eb;
              font-weight: 500;
              text-decoration: underline;
            }
            .markdown-body a:hover {
              color: #1d4ed8;
            }
            .markdown-body strong {
              color: #111827;
              font-weight: 700;
            }
            .markdown-body em {
              color: #374151;
              font-style: italic;
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

  const handleClear = () => {
    setMarkdown("");
  };

  const handleOptionChange = (key: keyof Options) => {
    setOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Markdown Print
          </h1>

          {/* オプション */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.gfm}
                onChange={() => handleOptionChange('gfm')}
                className="w-4 h-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span>GFM</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.math}
                onChange={() => handleOptionChange('math')}
                className="w-4 h-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span>数式</span>
            </label>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
        {/* 左側: 入力エリア */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <span className="font-semibold text-gray-700 text-sm">入力</span>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
              title="クリア"
            >
              クリア
            </button>
          </div>
          <textarea
            className="flex-1 p-5 font-mono text-sm text-gray-800 resize-none border-none outline-none focus:ring-0 leading-relaxed min-h-96 lg:min-h-0"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder={SAMPLE_PLACEHOLDER}
          />
        </div>

        {/* 右側: 結果表示エリア */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* タブ */}
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
              onClick={handleOpenHtml}
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

          {/* 結果表示 */}
          <div className="flex-1 overflow-auto min-h-96 lg:min-h-0">
            {viewMode === 'html' && (
              <MarkdownPreview html={html} />
            )}
            {viewMode === 'source' && (
              <pre className="p-5 text-xs font-mono text-gray-700 whitespace-pre-wrap bg-gray-50 h-full leading-relaxed">
                {sourceHtml}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
