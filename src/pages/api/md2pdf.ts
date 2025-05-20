import type { NextApiRequest, NextApiResponse } from "next";
import { tmpdir } from "os";
import { join } from "path";
import { writeFile, unlink, readFile } from "fs/promises";
import MarkdownIt from "markdown-it";
import mk from "markdown-it-katex";
import puppeteer from "puppeteer";

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

    // markdown-it + katexでHTML生成
    const mdParser = MarkdownIt({ html: true, linkify: true, typographer: true }).use(mk);
    const htmlContent = mdParser.render(markdown);

    // GitHub Markdown CSS, KaTeX CSS, KaTeX JSを読み込む
    const githubCss = await readFile(join(process.cwd(), "public/github-markdown.css"), "utf-8");
    const katexCss = await readFile(join(process.cwd(), "node_modules/katex/dist/katex.min.css"), "utf-8");
    // KaTeX JSはCDNで読み込む

    // HTMLテンプレート
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          ${githubCss}
          ${katexCss}
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
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
          onload="renderMathInElement(document.body, {delimiters: [{left: '$$', right: '$$', display: true},{left: '$', right: '$', display: false}]});"></script>
      </head>
      <body>
        <article class="markdown-body">
          ${htmlContent}
        </article>
      </body>
      </html>
    `;

    // 一時HTMLファイル作成
    const tmpHtml = join(tmpdir(), `md2pdf_${Date.now()}.html`);
    await writeFile(tmpHtml, html, "utf-8");

    // PuppeteerでPDF生成
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto("file://" + tmpHtml, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 20, bottom: 20, left: 20, right: 20 },
    });
    await browser.close();

    await unlink(tmpHtml);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(title)}.pdf"`);
    res.status(200).send(pdfBuffer);
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      res.status(500).send("PDF生成エラー: " + e.message);
    } else {
      res.status(500).send("PDF生成エラー: " + String(e));
    }
  }
}