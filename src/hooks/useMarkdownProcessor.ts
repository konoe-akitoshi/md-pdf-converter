import { useState, useEffect } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeMathjax from "rehype-mathjax";
import rehypeStringify from "rehype-stringify";
import { preprocessMath } from "../utils/mathPreprocessor";

export function useMarkdownProcessor(markdown: string) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
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
        }
      } catch (error) {
        console.error('Markdown processing error:', error);
        if (!cancelled) {
          setHtml('<p style="color: red;">エラー: Markdownの処理に失敗しました</p>');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [markdown]);

  return html;
}
