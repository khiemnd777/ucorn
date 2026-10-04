import type { CompletionModel } from '../domain/completion';
import type { NormalizedCrossover } from '../domain/crossover';
import type { CompletionReaders, ObjectValue } from './completion-readers';

export function validateCrossovers(
  items: { c: ObjectValue; path: string }[],
  tubing: CompletionModel['tubing'],
  read: CompletionReaders,
): NormalizedCrossover[] {
  const { string, quantity, metadata, allowedKeys, issue } = read;
  const crossovers: NormalizedCrossover[] = [];
  const occupied = new Set<string>();
  for (const { c, path } of items) {
    allowedKeys(c, ['type', 'id', 'label', 'lifecycle', 'sources', 'verification', 'tubingId', 'fromSegmentId', 'toSegmentId', 'at', 'fromConnection', 'toConnection'], path);
    const meta = metadata(c, path);
    const tubingId = string(c.tubingId, `${path}.tubingId`);
    const fromSegmentId = string(c.fromSegmentId, `${path}.fromSegmentId`);
    const toSegmentId = string(c.toSegmentId, `${path}.toSegmentId`);
    const at = quantity(c.at, `${path}.at`, 'length');
    const fromConnection = c.fromConnection === undefined ? undefined : string(c.fromConnection, `${path}.fromConnection`);
    const toConnection = c.toConnection === undefined ? undefined : string(c.toConnection, `${path}.toConnection`);
    const problem = (code: string, field: string, message: string) => issue(code, `${path}.${field}`, message, meta.id);
    if (tubingId !== tubing.id) problem('DANGLING_REFERENCE', 'tubingId', 'Crossover must belong to the supplied tubing.');
    const fromIndex = tubing.segments.findIndex(s => s.id === fromSegmentId);
    const toIndex = tubing.segments.findIndex(s => s.id === toSegmentId);
    if (fromIndex < 0) problem('DANGLING_REFERENCE', 'fromSegmentId', 'Upper tubing segment is missing.');
    if (toIndex < 0) problem('DANGLING_REFERENCE', 'toSegmentId', 'Lower tubing segment is missing.');
    if (fromIndex >= 0 && toIndex >= 0) {
      const from = tubing.segments[fromIndex], to = tubing.segments[toIndex];
      if (toIndex !== fromIndex + 1) problem('INVALID_CROSSOVER_ATTACHMENT', 'toSegmentId', 'Crossover must connect adjacent segments in upper-to-lower order.');
      if (at < 0 || Math.abs(at - from.bottom) > 1e-7 || Math.abs(at - to.top) > 1e-7) problem('ANCHOR_MISMATCH', 'at', 'Crossover MD must match both segment endpoints.');
      const junction = `${fromSegmentId}\0${toSegmentId}`;
      if (occupied.has(junction)) problem('CROSSOVER_OCCUPIED', 'fromSegmentId', 'This tubing junction already has a crossover.');
      occupied.add(junction);
      // Canonical endpoint removes unit-conversion roundoff from the display anchor.
      crossovers.push({ ...meta, type: 'Crossover', tubingId, fromSegmentId, toSegmentId, at: from.bottom, fromConnection, toConnection, from, to });
    }
    if (meta.lifecycle === 'installed' && tubing.lifecycle !== 'installed') problem('LIFECYCLE_CONFLICT', 'lifecycle', 'Installed crossover requires installed tubing.');
    if (fromConnection === undefined || toConnection === undefined) issue('CONNECTION_UNRESOLVED', path, 'Crossover connection profiles are incomplete; compatibility is unverified.', meta.id, 'warning');
  }
  return crossovers.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
}
