export const SAMPLE_PLACEHOLDER = `# マークダウン→PDF変換デモ

日本語・**太字**・*イタリック*・[リンク](https://example.com)
数式もOK: $E=mc^2$

## 機能

- [x] GitHub Flavored Markdown
- [x] 数式レンダリング (KaTeX)
- [x] リアルタイムプレビュー
- [ ] PDF出力

### コードブロック

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### 数式

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

### テーブル

| 項目 | 説明 |
|------|------|
| Markdown | 軽量マークアップ言語 |
| PDF | Portable Document Format |
`;

export type ViewMode = 'html' | 'source';
