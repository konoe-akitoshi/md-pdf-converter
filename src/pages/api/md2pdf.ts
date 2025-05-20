import type { NextApiRequest, NextApiResponse } from "next";
import { tmpdir } from "os";
import { join } from "path";
import { writeFile, unlink, readFile } from "fs/promises";
import { marked } from "marked";
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

    // Markdown → HTML
    const htmlContent = marked.parse(markdown);

    // GitHub Markdown CSS を読み込む
    const stylesheetPath = join(process.cwd(), "public/github-markdown.css");
    const githubCss = await readFile(stylesheetPath, "utf-8");

    // HTML テンプレート
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
      margin: { top: 40, bottom: 40, left: 40, right: 40 },
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