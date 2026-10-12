import type { LabelPrimitive, LinePrimitive } from './completion-layout';

export interface ToolPrimitive {
  id: string; topY: number; bottomY: number;
  lines: LinePrimitive[]; detailLines: LinePrimitive[];
  labels: LabelPrimitive[]; detailLabels: LabelPrimitive[];
  nextLabelY: number; leaderX: number;
}
export interface ToolLayoutConfig {
  centerX: number; depthToY: (md: number) => number; diameterToWidth: (mm: number) => number;
  labelX: number; labelY: number; datumId: string;
}
export function pipeBoundaries(center: number, top: number, bottom: number, od: number,
  innerDiameter: number | undefined, width: (mm: number) => number): LinePrimitive[] {
  const lines: LinePrimitive[] = [];
  for (const side of [-1, 1]) {
    for (const [role, diameter] of [['od', od], ['id', innerDiameter]] as const) {
      if (diameter === undefined) continue;
      const x = center + side * width(diameter) / 2;
      lines.push({ x1: x, x2: x, y1: top, y2: bottom, role });
    }
  }
  return lines;
}
