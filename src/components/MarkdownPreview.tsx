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
            font-size: 18px;
            line-height: 1.7;
            color: #111827;
          }
          .preview-container .markdown-body h1 {
            color: #111827;
            font-size: 2.25rem;
            font-weight: 700;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
          }
          .preview-container .markdown-body h2 {
            color: #1f2937;
            font-size: 1.875rem;
            font-weight: 600;
            border-bottom: 2px solid #6b7280;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
          }
          .preview-container .markdown-body h3 {
            color: #374151;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
          }
          .preview-container .markdown-body h4,
          .preview-container .markdown-body h5,
          .preview-container .markdown-body h6 {
            color: #4b5563;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          .preview-container .markdown-body p {
            color: #111827;
            margin-bottom: 1rem;
            font-size: 18px;
          }
          .preview-container .markdown-body code {
            background-color: #f3f4f6;
            color: #dc2626;
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-size: 16px;
            font-weight: 500;
          }
          .preview-container .markdown-body pre {
            background-color: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 1.5rem;
            font-size: 16px;
            color: #111827;
          }
          .preview-container .markdown-body pre code {
            background: none;
            color: #111827;
            padding: 0;
            font-size: 16px;
          }
          .preview-container .markdown-body blockquote {
            border-left: 4px solid #3b82f6;
            background-color: #eff6ff;
            padding: 1.5rem;
            border-radius: 0 0.75rem 0.75rem 0;
            color: #1e40af;
            font-size: 18px;
          }
          .preview-container .markdown-body table {
            border-collapse: collapse;
            border-radius: 0.75rem;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            font-size: 16px;
          }
          .preview-container .markdown-body th {
            background-color: #f3f4f6;
            font-weight: 700;
            color: #111827;
            padding: 1rem;
          }
          .preview-container .markdown-body td {
            color: #111827;
            padding: 1rem;
          }
          .preview-container .markdown-body tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .preview-container .markdown-body ul,
          .preview-container .markdown-body ol {
            color: #111827;
            font-size: 18px;
          }
          .preview-container .markdown-body li {
            margin-bottom: 0.5rem;
          }
          .preview-container .markdown-body a {
            color: #2563eb;
            font-weight: 500;
            text-decoration: underline;
          }
          .preview-container .markdown-body a:hover {
            color: #1d4ed8;
          }
          .preview-container .markdown-body strong {
            color: #111827;
            font-weight: 700;
          }
          .preview-container .markdown-body em {
            color: #374151;
            font-style: italic;
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