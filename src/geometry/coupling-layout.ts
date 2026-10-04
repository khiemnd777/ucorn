import type { NormalizedCoupling } from '../domain/coupling';
import type { LabelPrimitive, LinePrimitive } from './completion-layout';
import { layoutJunctionWindow, type JunctionWindow } from './junction-layout';
import { displayQuantity as display, layoutLabelRows } from './completion-labels';

export interface CouplingPrimitive extends JunctionWindow {
  id: string;
  lines: LinePrimitive[];
  detailLines: LinePrimitive[];
  detailLabels: LabelPrimitive[];
  labels: LabelPrimitive[];
  nextLabelY: number;
  leaderX: number;
}

export function layoutCoupling(coupling: NormalizedCoupling, config: {
  centerX: number; depthToY: (md: number) => number; diameterToWidth: (mm: number) => number;
  labelX: number; labelY: number; datumId: string;
  obstacles: { topY: number; bottomY: number }[];
}): CouplingPrimitive {
  const { centerX, depthToY, diameterToWidth, labelX, labelY, datumId } = config;
  const { atY, topY, bottomY } = layoutJunctionWindow(coupling, depthToY, config.obstacles);
  const body = (centerX: number, topY: number, bottomY: number, diameterToWidth: (mm: number) => number) => {
    const lines: LinePrimitive[] = [];
    for (const side of [-1, 1]) {
      const x = centerX + side * diameterToWidth(coupling.od) / 2;
      lines.push({ x1: x, y1: topY, x2: x, y2: bottomY, role: 'od' });
      for (const [segment, y] of [[coupling.from, topY], [coupling.to, bottomY]] as const) {
        lines.push({ x1: centerX + side * diameterToWidth(segment.od) / 2, y1: y, x2: x, y2: y, role: 'shoulder' });
        if (coupling.innerDiameter !== undefined && segment.innerDiameter !== undefined) {
          lines.push({ x1: centerX + side * diameterToWidth(segment.innerDiameter) / 2, y1: y,
            x2: centerX + side * diameterToWidth(coupling.innerDiameter) / 2, y2: y, role: 'bore-step' });
        }
      }
      if (coupling.innerDiameter !== undefined) {
        const innerX = centerX + side * diameterToWidth(coupling.innerDiameter) / 2;
        lines.push({ x1: innerX, y1: topY, x2: innerX, y2: bottomY, role: 'id' });
      }
    }
    return lines;
  };
  const lines = body(centerX, topY, bottomY, diameterToWidth);
  const detailWidth = (mm: number) => mm / coupling.od * 32;
  const detailLines = body(labelX + 520, labelY + 20, labelY + 60, detailWidth);
  for (const [segment, edge, outside] of [[coupling.from, labelY + 20, labelY + 10], [coupling.to, labelY + 60, labelY + 70]] as const) {
    for (const [role, diameter] of [['od', segment.od], ['id', segment.innerDiameter]] as const) {
      if (diameter === undefined) continue;
      for (const side of [-1, 1]) {
        const x = labelX + 520 + side * detailWidth(diameter) / 2;
        detailLines.push({ x1: x, y1: edge, x2: x, y2: outside, role });
      }
    }
  }
  const rows = layoutLabelRows([
    `Coupling ${coupling.id}${coupling.label ? ` — ${coupling.label}` : ''}`,
    `${coupling.tubingId}: ${coupling.fromSegmentId} → ${coupling.toSegmentId}`,
    `${display(coupling.at)} m MD @ ${datumId}; length unknown`,
    `Body OD ${display(coupling.od)} / ID ${coupling.innerDiameter === undefined ? 'unknown' : display(coupling.innerDiameter)} mm; clearance: ${coupling.fit}`,
    `Connections: ${coupling.fromConnection ?? 'unknown'} → ${coupling.toConnection ?? 'unknown'}`,
    `${coupling.lifecycle} | ${coupling.verification}; compatibility unverified`,
  ], labelX, labelY);
  return { id: coupling.id, atY, topY, bottomY, lines, detailLines,
    detailLabels: [{ x: labelX + 450, y: labelY + 8, text: 'Detail · not MD scale' }],
    ...rows, leaderX: centerX + diameterToWidth(coupling.od) / 2 };
}
