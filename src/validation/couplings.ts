import type { CompletionModel } from '../domain/completion';
import type { NormalizedCoupling } from '../domain/coupling';
import type { PackerHost } from './packers';
import type { CompletionReaders, ObjectValue } from './completion-readers';

export function validateCouplings(
  items: { c: ObjectValue; path: string }[],
  hosts: Map<string, PackerHost>,
  model: Pick<CompletionModel, 'tubing' | 'crossovers' | 'packers'>,
  read: CompletionReaders,
): NormalizedCoupling[] {
  const { tubing, crossovers, packers } = model;
  const { string, quantity, metadata, allowedKeys, issue } = read;
  const occupied = new Set(crossovers.map(c => c.fromSegmentId));
  const couplings: NormalizedCoupling[] = [];
  const epsilon = 1e-7;
  for (const { c, path } of items) {
    allowedKeys(c, ['type', 'id', 'label', 'lifecycle', 'sources', 'verification', 'tubingId', 'fromSegmentId', 'toSegmentId', 'at', 'od', 'innerDiameter', 'fromConnection', 'toConnection'], path);
    const meta = metadata(c, path);
    const tubingId = string(c.tubingId, `${path}.tubingId`);
    const fromSegmentId = string(c.fromSegmentId, `${path}.fromSegmentId`);
    const toSegmentId = string(c.toSegmentId, `${path}.toSegmentId`);
    const at = quantity(c.at, `${path}.at`, 'length');
    const od = quantity(c.od, `${path}.od`, 'diameter', true);
    const innerDiameter = c.innerDiameter === undefined ? undefined : quantity(c.innerDiameter, `${path}.innerDiameter`, 'diameter', true);
    const fromConnection = c.fromConnection === undefined ? undefined : string(c.fromConnection, `${path}.fromConnection`);
    const toConnection = c.toConnection === undefined ? undefined : string(c.toConnection, `${path}.toConnection`);
    const problem = (code: string, field: string, message: string) => issue(code, `${path}.${field}`, message, meta.id);
    if (tubingId !== tubing.id) problem('DANGLING_REFERENCE', 'tubingId', 'Coupling must belong to the supplied tubing.');
    if (innerDiameter !== undefined && innerDiameter >= od) problem('INVALID_DIAMETER', 'innerDiameter', 'Coupling ID must be smaller than body OD.');
    const fromIndex = tubing.segments.findIndex(s => s.id === fromSegmentId);
    const toIndex = tubing.segments.findIndex(s => s.id === toSegmentId);
    if (fromIndex < 0) problem('DANGLING_REFERENCE', 'fromSegmentId', 'Upper tubing segment is missing.');
    if (toIndex < 0) problem('DANGLING_REFERENCE', 'toSegmentId', 'Lower tubing segment is missing.');
    if (fromIndex >= 0 && toIndex >= 0) {
      const from = tubing.segments[fromIndex], to = tubing.segments[toIndex];
      if (from.bottom <= from.top || to.bottom <= to.top) problem('INVALID_INTERVAL', 'fromSegmentId', 'Coupling endpoints require positive normalized segment lengths.');
      if (toIndex !== fromIndex + 1) problem('INVALID_COUPLING_ATTACHMENT', 'toSegmentId', 'Coupling must connect adjacent segments in upper-to-lower order.');
      if (at < 0 || Math.abs(at - from.bottom) > epsilon || Math.abs(at - to.top) > epsilon) problem('ANCHOR_MISMATCH', 'at', 'Coupling MD must match both segment endpoints.');
      if (Math.abs(from.od - to.od) > epsilon) problem('UNSUPPORTED_CONFIGURATION', 'toSegmentId', 'This ordinary coupling slice requires the same tubing OD at both ends; use Crossover for size changes.');
      if (od < Math.max(from.od, to.od) - epsilon) problem('INVALID_COUPLING_GEOMETRY', 'od', 'External coupling body must enclose both tubing OD envelopes.');
      if (occupied.has(fromSegmentId)) problem('JUNCTION_OCCUPIED', 'fromSegmentId', 'This tubing junction already has a coupling or crossover.');
      occupied.add(fromSegmentId);
      const spans = tubing.hostSpans.filter(s => at >= s.top - epsilon && at <= s.bottom + epsilon);
      let unresolved = false;
      for (const span of spans) {
        const host = hosts.get(span.hostId);
        if (!host || host.kind !== 'casing') problem('UNSUPPORTED_CONFIGURATION', 'at', 'Coupling body clearance requires casing/liner context.');
        const bores = host?.bores.filter(b => at >= b.top - epsilon && at <= b.bottom + epsilon) ?? [];
        for (const bore of bores) {
          if (bore.diameter === undefined) unresolved = true;
          else if (od >= bore.diameter) problem('IMPOSSIBLE_FIT', 'od', 'Coupling body OD does not fit every explicit host bore at the junction.');
          if (bore.od !== undefined && od >= bore.od) problem('INVALID_COUPLING_GEOMETRY', 'od', 'Coupling body exceeds the displayed host envelope.');
        }
      }
      if (packers.some(p => p.innerConduitId === tubing.id && at >= p.top - epsilon && at <= p.bottom + epsilon)) problem('UNSUPPORTED_TOOL_OVERLAP', 'at', 'Coupling at a tubing packer interval/boundary requires a separate equipment profile.');
      if (unresolved) issue('COUPLING_FIT_UNRESOLVED', `${path}.od`, 'Host bore is unknown; coupling body clearance is unverified.', meta.id, 'warning');
      couplings.push({ ...meta, type: 'Coupling', tubingId, fromSegmentId, toSegmentId, at: from.bottom, od, innerDiameter, fromConnection, toConnection, from, to, fit: unresolved ? 'unresolved' : 'clearance-checked' });
    }
    if (meta.lifecycle === 'installed' && tubing.lifecycle !== 'installed') problem('LIFECYCLE_CONFLICT', 'lifecycle', 'Installed coupling requires installed tubing.');
    if (fromConnection === undefined || toConnection === undefined) issue('CONNECTION_UNRESOLVED', path, 'Coupling connection profiles are incomplete; compatibility is unverified.', meta.id, 'warning');
  }
  return couplings.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
}
