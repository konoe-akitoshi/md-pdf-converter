"use client";

import React from "react";
import { githubMarkdownCss, katexCss } from "../utils/styles";

interface MarkdownPreviewProps {
  html: string;
}

export default function MarkdownPreview({ html }: MarkdownPreviewProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: githubMarkdownCss }} />
      <style dangerouslySetInnerHTML={{ __html: katexCss }} />
      <style dangerouslySetInnerHTML={{
        __html: `
          .preview-container {
            box-sizing: border-box;
            margin: 0;
            padding: 40px;
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 0.375rem;
            min-height: 24rem;
          }
          .preview-container .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 794px;
            margin: 0 auto;
            font-size: 16px;
          }
        `
      }} />
      <div className="preview-container">
        <article className="markdown-body">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </div>
    </>
  );
}