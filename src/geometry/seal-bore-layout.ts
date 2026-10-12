import type { NormalizedSealBore, NormalizedSealAssembly } from '../domain/seal-bore';
import type { LinePrimitive } from './completion-layout';
import { displayQuantity as display, layoutLabelRows } from './completion-labels';
import { pipeBoundaries, type ToolLayoutConfig, type ToolPrimitive } from './completion-tool-layout';

export function layoutSealBore(bore: NormalizedSealBore, config: ToolLayoutConfig): ToolPrimitive {
  const { centerX, depthToY, diameterToWidth, labelX, labelY, datumId } = config;
  const topY = depthToY(bore.top), bottomY = depthToY(bore.bottom);
  const rows = layoutLabelRows([
    `${bore.variant === 'pbr' ? 'PBR' : 'Seal Bore'} ${bore.id}${bore.label ? ` — ${bore.label}` : ''}`,
    `Owner ${bore.ownerId}; host ${bore.hostId}`,
    `${display(bore.top)}–${display(bore.bottom)} m MD @ ${datumId}`,
    `OD ${display(bore.od)} / ID ${bore.innerDiameter === undefined ? 'unknown' : display(bore.innerDiameter)} mm`,
    `Profile: ${bore.profile ?? 'unknown'}`,
    `${bore.lifecycle} | ${bore.verification}`,
    `Body/host clearance: ${bore.fit}`,
    'Seal compatibility unverified',
  ], labelX, labelY);
  return { id: bore.id, topY, bottomY,
    lines: pipeBoundaries(centerX, topY, bottomY, bore.od, bore.innerDiameter, diameterToWidth),
    detailLines: pipeBoundaries(labelX + 520, labelY + 20, labelY + 80, bore.od, bore.innerDiameter, mm => mm / bore.od * 48),
    detailLabels: [{ x: labelX + 450, y: labelY + 8, text: 'Detail · not MD scale' }],
    ...rows, leaderX: centerX + diameterToWidth(bore.od) / 2 };
}

export function layoutSealAssembly(assembly: NormalizedSealAssembly, config: ToolLayoutConfig): ToolPrimitive {
  const { centerX, depthToY, diameterToWidth, labelX, labelY, datumId } = config;
  const topY = depthToY(assembly.top), bottomY = depthToY(assembly.bottom), segment = assembly.segment;
  const marks = (center: number, top: number, bottom: number, width: (mm: number) => number) => {
    const lines: LinePrimitive[] = [];
    // Three marks identify a seal interval; they are not seal dimensions/contact.
    for (const side of [-1, 1]) for (const position of [0.2, 0.5, 0.8]) {
      const x = center + side * width(segment.od) / 2, y = top + (bottom - top) * position;
      lines.push({ x1: x, y1: y, x2: x + side * 2, y2: y, role: 'seal-marker' });
    }
    return lines;
  };
  const rows = layoutLabelRows([
    `Seal Assembly ${assembly.id}${assembly.label ? ` — ${assembly.label}` : ''}`,
    `${assembly.tubingId} / ${assembly.segmentId} → ${assembly.receptacleId}`,
    `${display(assembly.top)}–${display(assembly.bottom)} m MD @ ${datumId}`,
    `Engagement: ${assembly.engagement}`,
    `Geometric overlap ${display(assembly.overlapLength)} m`,
    `Profile: ${assembly.profile ?? 'unknown'}`,
    `${assembly.lifecycle} | ${assembly.verification}`,
    `Mandrel clearance: ${assembly.fit}`,
    'Seal compatibility unverified',
  ], labelX, labelY);
  const detailWidth = (mm: number) => mm / segment.od * 24;
  return { id: assembly.id, topY, bottomY, lines: marks(centerX, topY, bottomY, diameterToWidth),
    detailLines: [...pipeBoundaries(labelX + 520, labelY + 20, labelY + 80, segment.od, segment.innerDiameter, detailWidth),
      ...marks(labelX + 520, labelY + 20, labelY + 80, detailWidth)],
    detailLabels: [{ x: labelX + 450, y: labelY + 8, text: 'Detail · not MD scale' }],
    ...rows, leaderX: centerX + diameterToWidth(segment.od) / 2 + 2 };
}
