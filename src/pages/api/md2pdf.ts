import type { NextApiRequest, NextApiResponse } from "next";
import { tmpdir } from "os";
import { join } from "path";
import { mkdir } from "fs/promises";
import { writeFile, unlink, readFile } from "fs/promises";
import { existsSync } from "fs";
import puppeteer from "puppeteer";

// remark系
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeMathjax from "rehype-mathjax";
import rehypeStringify from "rehype-stringify";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  try {
    const { markdown } = req.body;
    if (typeof markdown !== "string" || !markdown.trim()) {
      res.status(400).send("No markdown provided");
      return;
    }

    // ファイル名生成
    let title = markdown.split("\n")[0].replace(/^#*\s*/, "").trim();
    if (!title) title = "markdown";
    title = title.replace(/[\\\/:*?"<>|]/g, "").slice(0, 50);

    // remarkパイプラインでMarkdown→HTML（GFM+数式対応, MathJax SVG出力）
    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeMathjax)
      .use(rehypeStringify)
      .process(markdown);

    const htmlContent = String(file);

    // GitHub Markdown CSSを読み込む
    const githubCss = await readFile(join(process.cwd(), "public/github-markdown.css"), "utf-8");

    // HTMLテンプレート
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          ${githubCss}
          body {
            box-sizing: border-box;
            margin: 0;
            padding: 40px;
            background: #fff;
          }
          .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <article class="markdown-body">
          ${htmlContent}
        </article>
      </body>
      </html>
    `;

    // HTMLを直接返す
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(title)}.html"`);
    res.status(200).send(html);
  } catch (e: unknown) {
    console.error("HTML生成中にエラーが発生しました:", e);
    
    // エラーメッセージをより詳細に
    let errorMessage = "不明なエラー";
    if (e instanceof Error) {
      errorMessage = e.message;
      console.error("エラースタック:", e.stack);
    } else {
      errorMessage = String(e);
    }
    
    // Vercel環境の情報を追加
    if (process.env.VERCEL) {
      console.log("Vercel環境情報:", {
        region: process.env.VERCEL_REGION,
        env: process.env.VERCEL_ENV,
        url: process.env.VERCEL_URL
      });
    }
    
    res.status(500).send("HTML生成エラー: " + errorMessage);
  }
}