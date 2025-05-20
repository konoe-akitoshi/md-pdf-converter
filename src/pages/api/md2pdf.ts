import type { NextApiRequest, NextApiResponse } from "next";
import { tmpdir } from "os";
import { join } from "path";
import { writeFile, unlink, readFile } from "fs/promises";
import { convert } from "mdpdf";

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

    // 一時ファイルパス
    const tmpMd = join(tmpdir(), `md2pdf_${Date.now()}.md`);
    const tmpPdf = join(tmpdir(), `md2pdf_${Date.now()}.pdf`);
    const stylePath = join(process.cwd(), "public/github-markdown.css");

    // Markdownを一時ファイルに保存
    await writeFile(tmpMd, markdown, "utf-8");

    // mdpdfでPDF生成
    await convert({
      source: tmpMd,
      destination: tmpPdf,
      styles: stylePath,
      pdf: {
        format: "A4",
        orientation: "portrait",
        printBackground: true,
        margin: { top: "40mm", bottom: "40mm", left: "40mm", right: "40mm" },
      },
    });

    // PDFバッファを読み込み
    const pdfBuffer = await readFile(tmpPdf);

    // 一時ファイル削除
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