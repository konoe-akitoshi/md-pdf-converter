import type { NextApiRequest, NextApiResponse } from "next";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

import chrome from "chrome-aws-lambda";

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

    // 1行目からファイル名生成
    let title = markdown.split("\n")[0].replace(/^#*\s*/, "").trim();
    if (!title) title = "markdown";
    // ファイル名に使えない文字を除去
    title = title.replace(/[\\\/:*?"<>|]/g, "").slice(0, 50);

    const tmpMd = join(tmpdir(), `md2pdf_${Date.now()}.md`);
    const tmpPdf = join(tmpdir(), `md2pdf_${Date.now()}.pdf`);
    await writeFile(tmpMd, markdown, "utf-8");

    const { mdToPdf } = await import("md-to-pdf");
    // process.cwd()からの絶対パスで指定
    const stylesheet = join(process.cwd(), "node_modules/github-markdown-css/github-markdown.css");

    // VercelやLambdaなどのサーバーレス環境ではchrome-aws-lambdaを利用
    const isServerless = !!process.env.AWS_LAMBDA_FUNCTION_VERSION || !!process.env.VERCEL;
    const launchOptions = isServerless
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: true,
        }
      : undefined;

    await mdToPdf(
      { path: tmpMd },
      { dest: tmpPdf, stylesheet: [stylesheet], launch_options: launchOptions }
    );

    const pdfBuffer = await (await import("fs")).promises.readFile(tmpPdf);

    await unlink(tmpMd);
    await unlink(tmpPdf);

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