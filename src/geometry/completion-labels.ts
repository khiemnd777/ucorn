import type { LabelPrimitive } from './completion-layout';

export const displayQuantity = (n: number) => Number(n.toFixed(3)).toString();
export function layoutLabelRows(rows: string[], x: number, startY: number) {
  const labels: LabelPrimitive[] = [];
  let y = startY;
  // Reserve the detail lane even for wide glyphs in the 12 px label font.
  const charactersPerRow = 36;
  for (const row of rows) {
    let remaining = row;
    while (remaining.length) {
      const breakAt = remaining.length > charactersPerRow ? remaining.lastIndexOf(' ', charactersPerRow) : remaining.length;
      const end = breakAt > 0 ? breakAt : charactersPerRow;
      labels.push({ x, y, text: remaining.slice(0, end) }); y += 17;
      remaining = remaining.slice(end).trimStart();
    }
  }
  return { labels, nextLabelY: y + 20 };
}
