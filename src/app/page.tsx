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
  const [markdown, setMarkdown] = useState<string>(SAMPLE_PLACEHOLDER);
  const [html, setHtml] = useState<string>("");
  const [sourceHtml, setSourceHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('html');
  const [options, setOptions] = useState<Options>({
    gfm: true,
    math: true,
    breaks: false,
  });

  // Markdown→HTML変換（remark/rehypeパイプライン）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const file = await unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkMath)
          .use(remarkRehype)
          .use(rehypeMathjax)
          .use(rehypeStringify)
          .process(markdown);
        
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b-2 border-blue-500 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Markdown PDF変換</h1>
          
          {/* オプション */}
          <div className="flex flex-wrap gap-6 text-base">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={options.gfm}
                onChange={() => handleOptionChange('gfm')}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>GitHub Flavored Markdown</span>
            </label>
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={options.math}
                onChange={() => handleOptionChange('math')}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>数式 (KaTeX)</span>
            </label>
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={options.breaks}
                onChange={() => handleOptionChange('breaks')}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>改行を&lt;br&gt;に変換</span>
            </label>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="flex-1 flex">
        {/* 左側: 入力エリア */}
        <div className="w-1/2 flex flex-col bg-white border-r-2 border-gray-300">
          <div className="bg-blue-50 border-b-2 border-blue-200 px-4 py-3 flex items-center justify-between">
            <span className="font-bold text-gray-900 text-lg">Markdown入力</span>
            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="px-4 py-2 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
              >
                クリア
              </button>
              <button
                onClick={handleOpenHtml}
                disabled={isLoading}
                className={`px-4 py-2 text-base font-medium rounded-lg transition-colors shadow-sm ${
                  isLoading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isLoading ? "生成中..." : "新規タブで表示"}
              </button>
            </div>
          </div>
          <textarea
            className="flex-1 p-4 font-mono text-base text-gray-900 resize-none border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset leading-relaxed"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Markdownを入力してください..."
          />
        </div>

        {/* 右側: 結果表示エリア */}
        <div className="w-1/2 flex flex-col bg-white">
          {/* タブ */}
          <div className="bg-blue-50 border-b-2 border-blue-200 px-4 py-3">
            <div className="flex gap-2">
              {[
                { key: 'html' as ViewMode, label: 'プレビュー' },
                { key: 'source' as ViewMode, label: 'HTMLソース' },
                { key: 'debug' as ViewMode, label: 'デバッグ' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key)}
                  className={`px-4 py-2 text-base font-medium rounded-lg transition-colors ${
                    viewMode === key
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:text-gray-900 hover:bg-white border-2 border-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 結果表示 */}
          <div className="flex-1 overflow-auto bg-white">
            {viewMode === 'html' && (
              <MarkdownPreview html={html} />
            )}
            {viewMode === 'source' && (
              <pre className="p-4 text-base font-mono text-gray-900 whitespace-pre-wrap bg-gray-50 h-full leading-relaxed">
                {sourceHtml}
              </pre>
            )}
            {viewMode === 'debug' && (
              <pre className="p-4 text-base font-mono text-gray-700 bg-gray-50 h-full leading-relaxed">
                {JSON.stringify({
                  options,
                  markdownLength: markdown.length,
                  htmlLength: html.length,
                  timestamp: new Date().toISOString()
                }, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
