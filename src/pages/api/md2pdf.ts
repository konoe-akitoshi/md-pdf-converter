import type { NextApiRequest, NextApiResponse } from "next";
import { tmpdir } from "os";
import { join } from "path";
import { writeFile, unlink, readFile } from "fs/promises";
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
    // SVG数式が描画されるまで待機（SVG要素が出現するまで）
    await page.waitForFunction(() => !!document.querySelector('svg[data-mml-node]'), { timeout: 5000 }).catch(() => {});
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 20, bottom: 40, left: 20, right: 20 },
      displayHeaderFooter: true,
      footerTemplate: `
        <div style="width:100%;font-size:10px;color:#888;text-align:center;padding:4px 0;font-family:'Noto Sans JP','Yu Gothic','Meiryo',sans-serif;">
          <span class="pageNumber"></span>
        </div>
      `,
      headerTemplate: "<div></div>"
    });
    await browser.close();

    await unlink(tmpHtml);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(title)}.pdf"`);
    res.status(200).end(pdfBuffer);
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      res.status(500).send("PDF生成エラー: " + e.message);
    } else {
      res.status(500).send("PDF生成エラー: " + String(e));
    }
  }
}