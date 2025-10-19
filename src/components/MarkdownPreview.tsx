"use client";

import React from "react";
import { githubMarkdownCss, katexCss, markdownCustomStyles, previewContainerStyles } from "../utils/styles";

interface MarkdownPreviewProps {
  html: string;
}

export default function MarkdownPreview({ html }: MarkdownPreviewProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: githubMarkdownCss }} />
      <style dangerouslySetInnerHTML={{ __html: katexCss }} />
      <style dangerouslySetInnerHTML={{ __html: markdownCustomStyles }} />
      <style dangerouslySetInnerHTML={{ __html: previewContainerStyles }} />
      <div className="preview-container">
        <article className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </>
  );
}