/**
 * ChatGPT形式の数式記法を標準記法に変換
 */
export function preprocessMath(text: string): string {
  // インライン数式: \( ... \) または ( ... ) (LaTeX含む) を $ ... $ に変換
  let result = text.replace(/\\\(([^)]+)\\\)/g, '$$$1$$');
  result = result.replace(/\(([^)]*\\[^)]+[^)]*)\)/g, '$$$1$$');

  // ブロック数式: \[ ... \] または [ ... ] (LaTeX含む) を $$ ... $$ に変換
  result = result.replace(/\\\[([^\]]+)\\\]/g, '\n$$$$$$\n$1\n$$$$$$\n');
  result = result.replace(/^\[\s*\n/gm, '\n$$$$$$\n');
  result = result.replace(/\n\s*\]$/gm, '\n$$$$$$\n');
  result = result.replace(/\[([^\]]*\\[^\]]+[^\]]*)\]/g, '\n$$$$$$\n$1\n$$$$$$\n');

  return result;
}
