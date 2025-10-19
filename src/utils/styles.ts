// github-markdown-css（public/github-markdown.css）の完全版
export const githubMarkdownCss = `
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
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  margin: 0;
  color: var(--fgColor-default);
  background-color: var(--bgColor-default);
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
}

@media (prefers-color-scheme: light) {
  .markdown-body, [data-theme="light"] {
    color-scheme: light;
    --focus-outlineColor: #0969da;
    --fgColor-default: #1f2328;
    --fgColor-muted: #59636e;
    --fgColor-accent: #0969da;
    --fgColor-success: #1a7f37;
    --fgColor-attention: #9a6700;
    --fgColor-danger: #d1242f;
    --fgColor-done: #8250df;
    --bgColor-default: #ffffff;
    --bgColor-muted: #f6f8fa;
    --bgColor-neutral-muted: #818b981f;
    --bgColor-attention-muted: #fff8c5;
    --borderColor-default: #d1d9e0;
    --borderColor-muted: #d1d9e0b3;
    --borderColor-neutral-muted: #d1d9e0b3;
    --borderColor-accent-emphasis: #0969da;
    --borderColor-success-emphasis: #1a7f37;
    --borderColor-attention-emphasis: #9a6700;
    --borderColor-danger-emphasis: #cf222e;
    --borderColor-done-emphasis: #8250df;
  }
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: var(--base-size-24);
  margin-bottom: var(--base-size-16);
  font-weight: var(--base-text-weight-semibold, 600);
  line-height: 1.25;
}

.markdown-body h1 {
  margin: .67em 0;
  font-weight: var(--base-text-weight-semibold, 600);
  padding-bottom: .3em;
  font-size: 2em;
  border-bottom: 1px solid var(--borderColor-muted);
}

.markdown-body h2 {
  font-weight: var(--base-text-weight-semibold, 600);
  padding-bottom: .3em;
  font-size: 1.5em;
  border-bottom: 1px solid var(--borderColor-muted);
}

.markdown-body h3 {
  font-weight: var(--base-text-weight-semibold, 600);
  font-size: 1.25em;
}

.markdown-body h4 {
  font-weight: var(--base-text-weight-semibold, 600);
  font-size: 1em;
}

.markdown-body h5 {
  font-weight: var(--base-text-weight-semibold, 600);
  font-size: .875em;
}

.markdown-body h6 {
  font-weight: var(--base-text-weight-semibold, 600);
  font-size: .85em;
  color: var(--fgColor-muted);
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 10px;
}

.markdown-body blockquote {
  margin: 0;
  padding: 0 1em;
  color: var(--fgColor-muted);
  border-left: .25em solid var(--borderColor-default);
}

.markdown-body ul,
.markdown-body ol {
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 2em;
}

.markdown-body code,
.markdown-body tt {
  padding: .2em .4em;
  margin: 0;
  font-size: 85%;
  white-space: break-spaces;
  background-color: var(--bgColor-neutral-muted);
  border-radius: 6px;
  font-family: var(--fontStack-monospace, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace);
}

.markdown-body pre {
  padding: var(--base-size-16);
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  color: var(--fgColor-default);
  background-color: var(--bgColor-muted);
  border-radius: 6px;
  margin-top: 0;
  margin-bottom: var(--base-size-16);
  font-family: var(--fontStack-monospace, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace);
}

.markdown-body pre code {
  padding: 0;
  margin: 0;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
  font-size: 100%;
}

.markdown-body a {
  background-color: transparent;
  color: var(--fgColor-accent);
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body b,
.markdown-body strong {
  font-weight: var(--base-text-weight-semibold, 600);
}

.markdown-body em {
  font-style: italic;
}

.markdown-body img {
  border-style: none;
  max-width: 100%;
  box-sizing: content-box;
}

.markdown-body table {
  border-spacing: 0;
  border-collapse: collapse;
  display: block;
  width: max-content;
  max-width: 100%;
  overflow: auto;
  margin-top: 0;
  margin-bottom: var(--base-size-16);
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid var(--borderColor-default);
}

.markdown-body table th {
  font-weight: var(--base-text-weight-semibold, 600);
}

.markdown-body table tr {
  background-color: var(--bgColor-default);
  border-top: 1px solid var(--borderColor-muted);
}

.markdown-body table tr:nth-child(2n) {
  background-color: var(--bgColor-muted);
}

.markdown-body>*:first-child {
  margin-top: 0 !important;
}

.markdown-body>*:last-child {
  margin-bottom: 0 !important;
}

.markdown-body hr {
  box-sizing: content-box;
  overflow: hidden;
  background: transparent;
  border-bottom: 1px solid var(--borderColor-muted);
  height: .25em;
  padding: 0;
  margin: var(--base-size-24) 0;
  background-color: var(--borderColor-default);
  border: 0;
}
`;

// KaTeX CSS（node_modules/katex/dist/katex.min.css）をインライン化
export const katexCss = `@font-face{font-family:KaTeX_AMS;font-style:normal;font-weight:400;src:url(fonts/KaTeX_AMS-Regular.woff2) format("woff2"),url(fonts/KaTeX_AMS-Regular.woff) format("woff"),url(fonts/KaTeX_AMS-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Caligraphic;font-style:normal;font-weight:700;src:url(fonts/KaTeX_Caligraphic-Bold.woff2) format("woff2"),url(fonts/KaTeX_Caligraphic-Bold.woff) format("woff"),url(fonts/KaTeX_Caligraphic-Bold.ttf) format("truetype")}@font-face{font-family:KaTeX_Caligraphic;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Caligraphic-Regular.woff2) format("woff2"),url(fonts/KaTeX_Caligraphic-Regular.woff) format("woff"),url(fonts/KaTeX_Caligraphic-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Fraktur;font-style:normal;font-weight:700;src:url(fonts/KaTeX_Fraktur-Bold.woff2) format("woff2"),url(fonts/KaTeX_Fraktur-Bold.woff) format("woff"),url(fonts/KaTeX_Fraktur-Bold.ttf) format("truetype")}@font-face{font-family:KaTeX_Fraktur;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Fraktur-Regular.woff2) format("woff2"),url(fonts/KaTeX_Fraktur-Regular.woff) format("woff"),url(fonts/KaTeX_Fraktur-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:normal;font-weight:700;src:url(fonts/KaTeX_Main-Bold.woff2) format("woff2"),url(fonts/KaTeX_Main-Bold.woff) format("woff"),url(fonts/KaTeX_Main-Bold.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:italic;font-weight:700;src:url(fonts/KaTeX_Main-BoldItalic.woff2) format("woff2"),url(fonts/KaTeX_Main-BoldItalic.woff) format("woff"),url(fonts/KaTeX_Main-BoldItalic.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:italic;font-weight:400;src:url(fonts/KaTeX_Main-Italic.woff2) format("woff2"),url(fonts/KaTeX_Main-Italic.woff) format("woff"),url(fonts/KaTeX_Main-Italic.ttf) format("truetype")}@font-face{font-family:KaTeX_Main;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Main-Regular.woff2) format("woff2"),url(fonts/KaTeX_Main-Regular.woff) format("woff"),url(fonts/KaTeX_Main-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Math;font-style:italic;font-weight:700;src:url(fonts/KaTeX_Math-BoldItalic.woff2) format("woff2"),url(fonts/KaTeX_Math-BoldItalic.woff) format("woff"),url(fonts/KaTeX_Math-BoldItalic.ttf) format("truetype")}@font-face{font-family:KaTeX_Math;font-style:italic;font-weight:400;src:url(fonts/KaTeX_Math-Italic.woff2) format("woff2"),url(fonts/KaTeX_Math-Italic.woff) format("woff"),url(fonts/KaTeX_Math-Italic.ttf) format("truetype")}@font-face{font-family:"KaTeX_SansSerif";font-style:normal;font-weight:700;src:url(fonts/KaTeX_SansSerif-Bold.woff2) format("woff2"),url(fonts/KaTeX_SansSerif-Bold.woff) format("woff"),url(fonts/KaTeX_SansSerif-Bold.ttf) format("truetype")}@font-face{font-family:"KaTeX_SansSerif";font-style:italic;font-weight:400;src:url(fonts/KaTeX_SansSerif-Italic.woff2) format("woff2"),url(fonts/KaTeX_SansSerif-Italic.woff) format("woff"),url(fonts/KaTeX_SansSerif-Italic.ttf) format("truetype")}@font-face{font-family:"KaTeX_SansSerif";font-style:normal;font-weight:400;src:url(fonts/KaTeX_SansSerif-Regular.woff2) format("woff2"),url(fonts/KaTeX_SansSerif-Regular.woff) format("woff"),url(fonts/KaTeX_SansSerif-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Script;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Script-Regular.woff2) format("woff2"),url(fonts/KaTeX_Script-Regular.woff) format("woff"),url(fonts/KaTeX_Script-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size1;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Size1-Regular.woff2) format("woff2"),url(fonts/KaTeX_Size1-Regular.woff) format("woff"),url(fonts/KaTeX_Size1-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size2;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Size2-Regular.woff2) format("woff2"),url(fonts/KaTeX_Size2-Regular.woff) format("woff"),url(fonts/KaTeX_Size2-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size3;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Size3-Regular.woff2) format("woff2"),url(fonts/KaTeX_Size3-Regular.woff) format("woff"),url(fonts/KaTeX_Size3-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Size4;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Size4-Regular.woff2) format("woff2"),url(fonts/KaTeX_Size4-Regular.woff) format("woff"),url(fonts/KaTeX_Size4-Regular.ttf) format("truetype")}@font-face{font-family:KaTeX_Typewriter;font-style:normal;font-weight:400;src:url(fonts/KaTeX_Typewriter-Regular.woff2) format("woff2"),url(fonts/KaTeX_Typewriter-Regular.woff) format("woff"),url(fonts/KaTeX_Typewriter-Regular.ttf) format("truetype")}.katex{font:normal 1.21em KaTeX_Main,Times New Roman,serif;line-height:1.2;text-indent:0;text-rendering:auto}.katex *{-ms-high-contrast-adjust:none!important;border-color:currentColor}.katex .katex-version:after{content:"0.16.22"}`;

// プレビューコンテナのスタイル
export const previewContainerStyles = `
.preview-container {
  box-sizing: border-box;
  margin: 0;
  padding: 2rem;
  background: #fff;
  min-height: 100%;
}
.preview-container .markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: none;
  margin: 0;
  padding: 0;
}
`;

// 共通のMarkdownスタイル（プレビュー・印刷両方で使用）
export const markdownCustomStyles = `
.markdown-body {
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
`;

export function extractTitle(markdown: string): string {
  const firstLine = markdown.split("\n").find(line => line.trim() !== "") || "";
  const title = firstLine.replace(/^#+\s*/, "").trim();
  return title || "Markdownプレビュー";
}

export function generatePrintHTML(html: string, title: string): string {
  return `<!DOCTYPE html>
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
    }
    ${markdownCustomStyles}
  </style>
</head>
<body>
  <article class="markdown-body">${html}</article>
</body>
</html>`;
}