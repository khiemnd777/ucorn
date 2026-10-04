import type { CompletionModel } from '../domain/completion';
import { tubingHangerProfile, HANGER_BORE_INSET } from './hanger-profile';
import { layoutCrossover, type CrossoverPrimitive } from './crossover-layout';
import { layoutCoupling, type CouplingPrimitive } from './coupling-layout';
import { layoutPupJoint, type PupJointPrimitive } from './pup-joint-layout';
import { trimTubingAtJunctions } from './junction-layout';

export interface LinePrimitive { x1: number; y1: number; x2: number; y2: number; role: string; segmentId?: string }
export interface LabelPrimitive { x: number; y: number; text: string }
export interface LayoutPoint { x: number; y: number }
export interface HangerPrimitive { points: LayoutPoint[]; leaderAnchor: LayoutPoint }
export interface HeadMouth { left: number; right: number; top: number }
export interface PackerPrimitive {
  id: string;
  blocks: { x: number; y: number; width: number; height: number }[];
  physicalTopY: number; physicalBottomY: number;
  labels: LabelPrimitive[];
}
export interface CompletionLayout {
  tubing: LinePrimitive[];
  tubingLeader: LayoutPoint;
  tubingRiser: LinePrimitive[];
  hanger: HangerPrimitive[];
  packers: PackerPrimitive[];
  crossovers: CrossoverPrimitive[];
  couplings: CouplingPrimitive[];
  pupJoints: PupJointPrimitive[];
  tubingLabels: LabelPrimitive[]; hangerLabels: LabelPrimitive[]; notes: LabelPrimitive[]; height: number; width: number; labelX: number;
}
const display = (n: number) => Number(n.toFixed(3)).toString();
const wrap = (text: string, length = 62) => {
  const lines: string[] = [];
  for (let at = 0; at < text.length; at += length) lines.push(text.slice(at, at + length));
  return lines.length ? lines : [''];
};

/** Pure mapping: pixel scales are injected independently of physical units. */
export function layoutCompletion(model: CompletionModel, config: {
  centerX: number; depthToY: (depth: number) => number; diameterToWidth: (mm: number) => number; labelX?: number; headMouth?: HeadMouth;
}): CompletionLayout {
  const { tubing: tube } = model;
  const { centerX, depthToY, diameterToWidth } = config;
  const labelX = config.labelX ?? 315;
  const lines: LinePrimitive[] = [];
  for (const [i, segment] of tube.segments.entries()) {
    for (const [role, diameter] of [['od', segment.od], ['id', segment.innerDiameter]] as const) {
      if (diameter === undefined) continue;
      for (const side of [-1, 1]) {
        const x = centerX + side * diameterToWidth(diameter) / 2;
        lines.push({ x1: x, x2: x, y1: depthToY(segment.top), y2: depthToY(segment.bottom), role, segmentId: segment.id });
        const previous = tube.segments[i - 1];
        const previousDiameter = role === 'od' ? previous?.od : previous?.innerDiameter;
        if (previousDiameter !== undefined && previousDiameter !== diameter) {
          lines.push({ x1: centerX + side * diameterToWidth(previousDiameter) / 2, x2: x, y1: depthToY(segment.top), y2: depthToY(segment.top), role });
        }
      }
    }
  }
  const tubingLabels: LabelPrimitive[] = [];
  let y = 55;
  const add = (text: string) => {
    for (const line of wrap(text)) { tubingLabels.push({ x: labelX, y, text: line }); y += 17; }
  };
  add(`Tubing ${tube.id}${tube.label ? ` — ${tube.label}` : ''}`);
  add(`${tube.purpose} | ${tube.lifecycle} | ${tube.verification}`);
  add(`${display(tube.top)}–${display(tube.bottom)} m MD @ ${model.datumId}`);
  for (const segment of tube.segments) add(`${segment.id}: OD ${display(segment.od)} / ID ${segment.innerDiameter === undefined ? 'unknown' : display(segment.innerDiameter)} mm; ${display(segment.bottom - segment.top)} m`);
  add(`Hosts: ${tube.hostSpans.map(s => s.hostId).join(' → ')}`);
  add(`Support: ${model.hanger?.id ?? 'unknown'}`);
  const hanger = model.hanger;
  const hangerLabels: LabelPrimitive[] = [];
  let hangerY = y + 25;
  if (hanger) {
    for (const text of [
      `Tubing Hanger ${hanger.id}${hanger.label ? ` — ${hanger.label}` : ''}`,
      `Supports ${hanger.tubingId}; ${hanger.headId} / ${hanger.seatId}`,
      `${display(hanger.at)} m MD @ ${model.datumId}`,
      `${hanger.lifecycle} | ${hanger.verification}; seal unknown`,
    ]) for (const line of wrap(text)) { hangerLabels.push({ x: labelX, y: hangerY, text: line }); hangerY += 17; }
  }
  const polygons: CompletionLayout['hanger'] = [];
  const tubingRiser: LinePrimitive[] = [];
  if (hanger) {
    const mouth = config.headMouth;
    if (!mouth) throw new Error('Tubing hanger layout requires the referenced wellhead mouth.');
    const tubeHalf = diameterToWidth(tube.segments[0].od) / 2;
    const tubeLeft = centerX - tubeHalf;
    const leftOuter = mouth.left + HANGER_BORE_INSET;
    const rightOuter = mouth.right - HANGER_BORE_INSET;
    if (tubeLeft <= leftOuter || rightOuter <= centerX + tubeHalf) throw new Error('Tubing hanger has no room inside the wellhead mouth.');
    // Slot zero: flat upper face at mouth, shared lower profile above casing hangers.
    // The ramp/riser depict an enlarged head assembly, never added MD length.
    const leftPoints = tubingHangerProfile(leftOuter, tubeLeft, mouth.top);
    polygons.push({ points: leftPoints, leaderAnchor: leftPoints[0] });
    const rightPoints = tubingHangerProfile(rightOuter, centerX + tubeHalf, mouth.top);
    polygons.push({ points: rightPoints, leaderAnchor: rightPoints[0] });
    for (const [role, diameter] of [['od', tube.segments[0].od], ['id', tube.segments[0].innerDiameter]] as const) {
      if (diameter === undefined) continue;
      for (const side of [-1, 1]) {
        const x = centerX + side * diameterToWidth(diameter) / 2;
        tubingRiser.push({ x1: x, x2: x, y1: mouth.top, y2: depthToY(tube.top), role });
      }
    }
  }
  const packers: PackerPrimitive[] = [];
  let packerLabelY = hangerY + 25;
  const packerRanges = model.packers.map(p => {
    const top = depthToY(p.top), bottom = depthToY(p.bottom), middle = (top + bottom) / 2;
    const height = Math.max(8, bottom - top);
    return { top, bottom, min: middle - height / 2, max: middle + height / 2 };
  });
  for (const [index, packer] of model.packers.entries()) {
    const range = packerRanges[index];
    const physicalTopY = range.top, physicalBottomY = range.bottom;
    const crowded = model.packers.some((other, i) => i !== index && other.innerConduitId === packer.innerConduitId && other.outerHostId === packer.outerHostId && Math.max(range.min, packerRanges[i].min) < Math.min(range.max, packerRanges[i].max))
      || model.couplings.some(c => c.tubingId === packer.innerConduitId && depthToY(c.at) >= range.min && depthToY(c.at) <= range.max);
    // Do not merge adjacent physical tools by enlarging their symbols into each other.
    const height = crowded ? physicalBottomY - physicalTopY : Math.max(8, physicalBottomY - physicalTopY);
    const glyphTop = (physicalTopY + physicalBottomY - height) / 2;
    const inner = diameterToWidth(packer.innerOD) / 2, outer = diameterToWidth(packer.outerDiameter) / 2;
    const labels: LabelPrimitive[] = [];
    for (const line of [
      `${packer.role} packer ${packer.id}${packer.label ? ` — ${packer.label}` : ''}`,
      `Annulus: ${packer.innerConduitId} / ${packer.outerHostId}`,
      `${display(packer.top)}–${display(packer.bottom)} m MD @ ${model.datumId}`,
      `${packer.setState} | ${packer.lifecycle} | ${packer.verification}`,
      `Retrievable: ${packer.retrievable === undefined ? 'unknown' : packer.retrievable ? 'yes' : 'no'}; clearance: ${packer.fit}`,
    ]) for (const text of wrap(line)) { labels.push({ x: labelX, y: packerLabelY, text }); packerLabelY += 17; }
    packerLabelY += 20;
    packers.push({ id: packer.id, blocks: [
      { x: centerX - outer, y: glyphTop, width: outer - inner, height },
      { x: centerX + inner, y: glyphTop, width: outer - inner, height },
    ], physicalTopY, physicalBottomY, labels });
  }
  const crossovers: CrossoverPrimitive[] = [];
  let crossoverLabelY = packers.length ? packerLabelY : hangerY + 25;
  for (const crossover of model.crossovers) {
    const labels: LabelPrimitive[] = [];
    const bore = (n: number | undefined) => n === undefined ? 'unknown' : display(n);
    for (const line of [
      `Crossover ${crossover.id}${crossover.label ? ` — ${crossover.label}` : ''}`,
      `${crossover.tubingId}: ${crossover.fromSegmentId} → ${crossover.toSegmentId}`,
      `${display(crossover.at)} m MD @ ${model.datumId}; length unknown`,
      `OD ${display(crossover.from.od)} → ${display(crossover.to.od)} mm; ID ${bore(crossover.from.innerDiameter)} → ${bore(crossover.to.innerDiameter)} mm`,
      `Connections: ${crossover.fromConnection ?? 'unknown'} → ${crossover.toConnection ?? 'unknown'}`,
      `${crossover.lifecycle} | ${crossover.verification}; compatibility unverified`,
    ]) for (const text of wrap(line)) { labels.push({ x: labelX, y: crossoverLabelY, text }); crossoverLabelY += 17; }
    crossoverLabelY += 20;
    crossovers.push({ ...layoutCrossover(crossover, config), labels });
  }
  let connectorLabelY = crossovers.length ? crossoverLabelY : packers.length ? packerLabelY : hangerY + 25;
  const couplings: CouplingPrimitive[] = [];
  for (const coupling of model.couplings) {
    const obstacles = packers.filter(p => model.packers.find(m => m.id === p.id)?.innerConduitId === coupling.tubingId)
      .map(p => ({ topY: p.blocks[0].y, bottomY: p.blocks[0].y + p.blocks[0].height }));
    const primitive = layoutCoupling(coupling, { ...config, labelX, labelY: connectorLabelY, datumId: model.datumId, obstacles });
    couplings.push(primitive); connectorLabelY = primitive.nextLabelY;
  }
  const junctions = [...crossovers, ...couplings];
  const pupJoints: PupJointPrimitive[] = [];
  for (const pup of model.pupJoints) {
    const primitive = layoutPupJoint(pup, { ...config, labelX, labelY: connectorLabelY, datumId: model.datumId });
    primitive.lines = trimTubingAtJunctions(primitive.lines, junctions);
    pupJoints.push(primitive); connectorLabelY = primitive.nextLabelY;
  }
  const trimmedTubing = trimTubingAtJunctions(lines, junctions);
  const tubingLeader = { x: trimmedTubing[0].x1, y: trimmedTubing[0].y2 };
  const pupSegments = new Set(model.pupJoints.map(p => p.segmentId));
  const tubingLines = trimmedTubing.filter(line => !line.segmentId || !pupSegments.has(line.segmentId));
  const notes: LabelPrimitive[] = [];
  let noteY = Math.max((pupJoints.length || couplings.length ? connectorLabelY : crossovers.length ? crossoverLabelY : packers.length ? packerLabelY : hangerY) + 28, 460);
  const note = (text: string) => { for (const line of wrap(text)) { notes.push({ x: labelX, y: noteY, text: line }); noteY += 17; } };
  note(`Wellbore: ${model.wellboreId}`);
  note(`Snapshot: ${model.snapshotAt}`);
  note('MD schematic; diameter and depth scales are independent.');
  note('Hanger outer bores: 10 px; lower ramps: 45 degrees.');
  note('Tubing Hanger upper face is flat at the head mouth.');
  note('Tubing Hanger stacks over casing hangers at head mouth.');
  note('Head/riser detail enlarged; no added tubing MD length.');
  note('Support symbol does not certify sealing or well safety.');
  note('Completion components and label leaders use solid lines.');
  if (packers.length) {
    note('Packer blocks depict declared annuli, not equipment profiles.');
    note('Set: crossed blocks; unset/unknown: outline with state text.');
    note('8 px glyph minimum when space permits; tight tools to scale.');
    note('Packer interval midpoints are unchanged by glyph sizing.');
    note('Clearance checks do not verify hydraulic sealing or ratings.');
  }
  if (crossovers.length) {
    note('Crossover is a point junction; physical length is unknown.');
    note('Glyph up to 8 px, constrained to neighbouring segments.');
    note('Tubing MD endpoints stay fixed; profiles are supplied text.');
    note('No thread compatibility or manufacturer geometry inferred.');
  }
  if (couplings.length) {
    note('Coupling body dimensions are supplied; length is unknown.');
    note('Point glyph up to 8 px; no extra tubing MD length.');
    note('Body clearance does not verify thread mating or ratings.');
    note('Coupling detail uses a separate scale, with open lumen.');
  }
  if (pupJoints.length) {
    note('Pup Joint length is included once in its tubing segment.');
    note('Main Pup Joint interval stays at physical MD scale.');
    note('Pup Joint detail uses a separate scale, with open lumen.');
  }
  for (const warning of model.diagnostics) note(`${warning.code}: ${warning.message}`);
  // The SVG group has a 100 px translation; reserve it beyond the detail lane.
  const width = labelX + (pupJoints.length || couplings.length ? 775 : 635);
  return { tubing: tubingLines, tubingLeader, tubingRiser, hanger: polygons, packers, crossovers, couplings, pupJoints, tubingLabels, hangerLabels, notes, height: Math.max(1000, noteY + 140), width, labelX };
}
