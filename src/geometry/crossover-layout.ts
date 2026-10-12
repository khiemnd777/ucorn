import type { NormalizedCrossover } from '../domain/crossover';
import type { LabelPrimitive, LinePrimitive } from './completion-layout';
import { layoutJunctionWindow } from './junction-layout';

export interface CrossoverPrimitive {
  id: string;
  atY: number;
  topY: number;
  bottomY: number;
  lines: LinePrimitive[];
  labels: LabelPrimitive[];
}

export function layoutCrossover(crossover: NormalizedCrossover, config: {
  centerX: number;
  depthToY: (md: number) => number;
  diameterToWidth: (mm: number) => number;
  obstacles?: { topY: number; bottomY: number }[];
}): Omit<CrossoverPrimitive, 'labels'> {
  const { centerX, depthToY, diameterToWidth } = config;
  const { atY, topY, bottomY } = layoutJunctionWindow(crossover, depthToY, config.obstacles);
  const lines: LinePrimitive[] = [];
  for (const [role, from, to] of [
    ['od', crossover.from.od, crossover.to.od],
    ['id', crossover.from.innerDiameter, crossover.to.innerDiameter],
  ] as const) {
    // One missing bore prevents drawing a fabricated bore transition.
    if (from === undefined || to === undefined) continue;
    for (const side of [-1, 1]) {
      lines.push({ x1: centerX + side * diameterToWidth(from) / 2, y1: topY,
        x2: centerX + side * diameterToWidth(to) / 2, y2: bottomY, role });
    }
  }
  for (const [segment, y] of [[crossover.from, topY], [crossover.to, bottomY]] as const) {
    if (segment.innerDiameter === undefined) continue;
    for (const side of [-1, 1]) {
      lines.push({ x1: centerX + side * diameterToWidth(segment.od) / 2, y1: y,
        x2: centerX + side * diameterToWidth(segment.innerDiameter) / 2, y2: y, role: 'end-wall' });
    }
  }
  return { id: crossover.id, atY, topY, bottomY, lines };
}
