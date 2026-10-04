import { PACKER_ROLES } from '../domain/completion';
import type { CompletionModel, NormalizedPacker } from '../domain/completion';
import type { CompletionReaders, ObjectValue } from './completion-readers';
export interface PackerHost {
  kind: 'casing' | 'hole';
  top: number; bottom: number;
  bores: { top: number; bottom: number; diameter?: number; od?: number }[];
  pipeType?: string;
}
const epsilon = 1e-7;

/** Validate explicit seal endpoints against the already normalized context and tubing. */
export function validatePackers(items: { c: ObjectValue; path: string }[], hosts: Map<string, PackerHost>, tube: CompletionModel['tubing'], read: CompletionReaders): NormalizedPacker[] {
  const { string, quantity, metadata, allowedKeys, issue } = read;
  const packers: NormalizedPacker[] = [];
  for (const { c, path } of items) {
    allowedKeys(c, ['type', 'id', 'label', 'lifecycle', 'sources', 'verification', 'role', 'innerConduitId', 'outerHostId', 'top', 'bottom', 'setState', 'retrievable'], path);
    const meta = metadata(c, path);
    const top = quantity(c.top, `${path}.top`, 'length'), bottom = quantity(c.bottom, `${path}.bottom`, 'length');
    const innerConduitId = string(c.innerConduitId, `${path}.innerConduitId`), outerHostId = string(c.outerHostId, `${path}.outerHostId`);
    const problem = (code: string, field: string, message: string) => issue(code, `${path}.${field}`, message, meta.id);
    if (!PACKER_ROLES.includes(c.role as NormalizedPacker['role'])) problem('INVALID_PACKER_ROLE', 'role', 'Declare production, liner-top, isolation or test.');
    if (!['set', 'unset', 'unknown'].includes(String(c.setState))) problem('INVALID_SET_STATE', 'setState', 'Declare set, unset or unknown; installed does not imply set.');
    if (c.retrievable !== undefined && typeof c.retrievable !== 'boolean') problem('INVALID_BOOLEAN', 'retrievable', 'Expected a boolean; omit when unknown.');
    if (top < 0 || bottom <= top) problem('INVALID_INTERVAL', 'bottom', 'Packer requires a positive interval with nonnegative top.');
    const outer = hosts.get(outerHostId);
    if (!outer) problem('DANGLING_REFERENCE', 'outerHostId', 'Packer outer casing/liner is missing.');
    else if (outer.kind !== 'casing') problem('UNSUPPORTED_CONFIGURATION', 'outerHostId', 'This packer slice supports casing/liner hosts only, not openhole.');
    if (outer && (top < outer.top - epsilon || bottom > outer.bottom + epsilon)) problem('HOST_INTERVAL', 'outerHostId', 'Outer host must cover the full packer interval.');
    let innerOD: number | undefined;
    if (c.role === 'liner-top') {
      const liner = hosts.get(innerConduitId);
      if (!liner) problem('DANGLING_REFERENCE', 'innerConduitId', 'Liner is missing.');
      else {
        if (!['Production Liner', 'Drilling Liner'].includes(liner.pipeType ?? '')) problem('INVALID_PACKER_ATTACHMENT', 'innerConduitId', 'Liner-top packer must reference a liner, not tubing or casing.');
        if (Math.abs(top - liner.top) > epsilon || bottom > liner.bottom + epsilon) problem('ANCHOR_MISMATCH', 'top', 'Liner-top packer must begin at liner top and remain within the liner overlap.');
        innerOD = constantDiameter(liner.bores, top, bottom, 'od');
      }
      if (innerConduitId === outerHostId || outer?.pipeType?.includes('Liner')) problem('INVALID_PACKER_ATTACHMENT', 'outerHostId', 'Liner-top packer requires a distinct parent casing.');
    } else {
      if (innerConduitId !== tube.id) problem('DANGLING_REFERENCE', 'innerConduitId', 'This role must reference the supplied tubing.');
      if (top < tube.top - epsilon || bottom > tube.bottom + epsilon) problem('HOST_INTERVAL', 'innerConduitId', 'Tubing must cover the full packer interval.');
      innerOD = constantDiameter(tube.segments, top, bottom, 'od');
      const spans = tube.hostSpans.filter(s => Math.max(top, s.top) < Math.min(bottom, s.bottom) - epsilon);
      if (!spans.length || spans.some(s => s.hostId !== outerHostId)) problem('INVALID_PACKER_ATTACHMENT', 'outerHostId', 'Seal host must match the declared tubing host throughout the interval.');
      if (meta.lifecycle === 'installed' && tube.lifecycle !== 'installed') problem('LIFECYCLE_CONFLICT', 'lifecycle', 'Installed tubing packer requires installed tubing.');
    }
    if (innerOD === undefined) problem('UNSUPPORTED_GEOMETRY', 'top', 'Packer must lie in a uniform inner OD interval; crossing a taper is unsupported.');
    const outerID = outer && constantDiameter(outer.bores, top, bottom, 'diameter');
    const displayDiameter = outer && constantDiameter(outer.bores, top, bottom, 'od');
    if (outer && displayDiameter === undefined) problem('UNSUPPORTED_GEOMETRY', 'outerHostId', 'Packer must lie in a uniform outer casing interval.');
    const knownBores = outer?.bores.filter(b => Math.max(top, b.top) < Math.min(bottom, b.bottom) - epsilon) ?? [];
    if (knownBores.some(b => b.diameter !== undefined) && outerID === undefined && knownBores.every(b => b.diameter !== undefined)) problem('UNSUPPORTED_GEOMETRY', 'outerHostId', 'Packer cannot cross an outer bore diameter change.');
    if (innerOD !== undefined && knownBores.some(b => b.diameter !== undefined && innerOD >= b.diameter)) problem('IMPOSSIBLE_FIT', 'outerHostId', 'Inner OD must be smaller than every explicit outer host bore along the interval.');
    if (innerOD !== undefined && displayDiameter !== undefined && innerOD >= displayDiameter) problem('INVALID_SEAL_GEOMETRY', 'outerHostId', 'Displayed annulus has no positive width.');
    if (outer?.kind === 'casing' && outerID === undefined) issue('PACKER_FIT_UNRESOLVED', `${path}.outerHostId`, 'Host ID is unknown; outline uses legacy displayed diameter and does not assert seal contact.', meta.id, 'warning');
    const packer: NormalizedPacker = { ...meta, type: 'CompletionPacker', role: c.role as NormalizedPacker['role'], innerConduitId, outerHostId, top, bottom, setState: c.setState as NormalizedPacker['setState'], retrievable: c.retrievable as boolean | undefined, innerOD: innerOD ?? 0, outerDiameter: outerID ?? displayDiameter ?? 0, fit: outerID === undefined ? 'unresolved' : 'clearance-checked' };
    // Interval occupancy is explicit; adjacent endpoints are allowed, overlapping tools are not.
    if (packers.some(p => p.innerConduitId === innerConduitId && p.outerHostId === outerHostId && Math.max(p.top, top) < Math.min(p.bottom, bottom) - epsilon)) problem('PACKER_OVERLAP', 'top', 'Packers on the same annulus must not overlap.');
    packers.push(packer);
  }
  return packers.sort((a, b) => a.top - b.top || a.id.localeCompare(b.id));
}

function constantDiameter(sections: { top: number; bottom: number; od?: number; diameter?: number }[], top: number, bottom: number, key: 'od' | 'diameter'): number | undefined {
  const touching = sections.filter(s => Math.max(top, s.top) < Math.min(bottom, s.bottom) - epsilon);
  if (!touching.length || touching.some(s => s[key] === undefined)) return undefined;
  const first = touching[0][key]!;
  return touching.every(s => Math.abs(s[key]! - first) <= epsilon) ? first : undefined;
}
