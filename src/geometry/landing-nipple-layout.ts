import type { NormalizedLandingNipple } from '../domain/landing-nipple';
import type { LinePrimitive } from './completion-layout';
import { displayQuantity as display, layoutLabelRows } from './completion-labels';
import { pipeBoundaries, type ToolLayoutConfig, type ToolPrimitive } from './completion-tool-layout';

export function layoutLandingNipple(nipple: NormalizedLandingNipple, config: ToolLayoutConfig): ToolPrimitive {
  const { centerX, depthToY, diameterToWidth, labelX, labelY, datumId } = config;
  const segment = nipple.segment, topY = depthToY(segment.top), bottomY = depthToY(segment.bottom);
  const profile = (center: number, top: number, bottom: number, width: (mm: number) => number) => {
    const lines = pipeBoundaries(center, top, bottom, segment.od, undefined, width);
    const bore = nipple.sealBoreDiameter ?? segment.innerDiameter;
    const upper = top + (bottom - top) * 0.2, lower = top + (bottom - top) * 0.8;
    const add = (x1: number, y1: number, x2: number, y2: number, role: string) => lines.push({ x1, y1, x2, y2, role });
    for (const side of [-1, 1]) {
      if (bore === undefined) {
        if (nipple.noGoDiameter !== undefined) {
          const x = center + side * width(nipple.noGoDiameter) / 2;
          add(x, top + (bottom - top) * 0.7, x, lower, 'no-go');
        }
        continue;
      }
      const x = center + side * width(bore) / 2;
      add(x, upper, x, lower, 'profile-bore');
      if (segment.innerDiameter !== undefined) {
        const outer = center + side * width(segment.innerDiameter) / 2;
        add(outer, top, outer, upper, 'id'); add(outer, lower, outer, bottom, 'id');
        add(outer, upper, x, upper, 'profile-shoulder'); add(x, lower, outer, lower, 'profile-shoulder');
      }
      if (nipple.noGoDiameter !== undefined) {
        const noGo = center + side * width(nipple.noGoDiameter) / 2;
        add(x, lower, noGo, lower, 'no-go');
      }
    }
    return lines;
  };
  const rows = layoutLabelRows([
    `Landing Nipple ${nipple.id}${nipple.label ? ` — ${nipple.label}` : ''}`,
    `${nipple.tubingId} / segment ${nipple.segmentId}`,
    `${display(segment.top)}–${display(segment.bottom)} m MD @ ${datumId}`,
    `Length ${display(segment.bottom - segment.top)} m; included in tubing`,
    `Profile: ${nipple.profileType}; ${nipple.profile ?? 'unknown'}`,
    `Seal bore ${nipple.sealBoreDiameter === undefined ? 'unknown' : `${display(nipple.sealBoreDiameter)} mm`}`,
    `No-go ${nipple.noGoDiameter === undefined ? 'unknown' : `${display(nipple.noGoDiameter)} mm`}`,
    'Insert: unknown; compatibility unverified',
    `${nipple.lifecycle} | ${nipple.verification}`,
  ], labelX, labelY);
  return { id: nipple.id, topY, bottomY, lines: profile(centerX, topY, bottomY, diameterToWidth),
    detailLines: profile(labelX + 520, labelY + 20, labelY + 80, mm => mm / segment.od * 40),
    detailLabels: [{ x: labelX + 450, y: labelY + 8, text: 'Detail · not MD scale' }],
    ...rows, leaderX: centerX + diameterToWidth(segment.od) / 2 };
}
