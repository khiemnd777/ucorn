import type { NormalizedPupJoint } from '../domain/pup-joint';
import type { LabelPrimitive, LinePrimitive } from './completion-layout';
import { displayQuantity as display, layoutLabelRows } from './completion-labels';

export interface PupJointPrimitive {
  id: string;
  topY: number;
  bottomY: number;
  lines: LinePrimitive[];
  detailLines: LinePrimitive[];
  detailLabels: LabelPrimitive[];
  labels: LabelPrimitive[];
  nextLabelY: number;
  leaderX: number;
}

export function layoutPupJoint(pup: NormalizedPupJoint, config: {
  centerX: number; depthToY: (md: number) => number; diameterToWidth: (mm: number) => number;
  labelX: number; labelY: number; datumId: string;
}): PupJointPrimitive {
  const { centerX, depthToY, diameterToWidth, labelX, labelY, datumId } = config;
  const segment = pup.segment;
  const topY = depthToY(segment.top), bottomY = depthToY(segment.bottom);
  const pipe = (center: number, top: number, bottom: number, width: (mm: number) => number) => {
    const lines: LinePrimitive[] = [];
    for (const side of [-1, 1]) {
      for (const [role, diameter] of [['od', segment.od], ['id', segment.innerDiameter]] as const) {
        if (diameter === undefined) continue;
        const x = center + side * width(diameter) / 2;
        lines.push({ x1: x, y1: top, x2: x, y2: bottom, role });
      }
      if (segment.innerDiameter !== undefined) for (const y of [top, bottom]) {
        lines.push({ x1: center + side * width(segment.od) / 2, y1: y,
          x2: center + side * width(segment.innerDiameter) / 2, y2: y, role: 'end-wall' });
      }
    }
    return lines;
  };
  const rows = layoutLabelRows([
    `Pup Joint ${pup.id}${pup.label ? ` — ${pup.label}` : ''}`,
    `${pup.tubingId} / segment ${pup.segmentId}`,
    `${display(segment.top)}–${display(segment.bottom)} m MD @ ${datumId}`,
    `Length ${display(segment.bottom - segment.top)} m; already included in tubing`,
    `OD ${display(segment.od)} / ID ${segment.innerDiameter === undefined ? 'unknown' : display(segment.innerDiameter)} mm`,
    `Connections: ${pup.fromConnection ?? 'unknown'} → ${pup.toConnection ?? 'unknown'}`,
    `${pup.lifecycle} | ${pup.verification}; compatibility unverified`,
  ], labelX, labelY);
  return { id: pup.id, topY, bottomY, lines: pipe(centerX, topY, bottomY, diameterToWidth),
    // Detail uses its own scale; never relocates the physical interval on the well.
    detailLines: pipe(labelX + 520, labelY + 20, labelY + 60, mm => mm / segment.od * 32),
    detailLabels: [{ x: labelX + 450, y: labelY + 8, text: 'Detail · not MD scale' }],
    ...rows, leaderX: centerX + diameterToWidth(segment.od) / 2 };
}
