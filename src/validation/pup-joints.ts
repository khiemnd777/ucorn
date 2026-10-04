import type { CompletionModel } from '../domain/completion';
import type { NormalizedPupJoint } from '../domain/pup-joint';
import type { CompletionReaders, ObjectValue } from './completion-readers';

export function validatePupJoints(items: { c: ObjectValue; path: string }[], tubing: CompletionModel['tubing'], read: CompletionReaders): NormalizedPupJoint[] {
  const { string, metadata, allowedKeys, issue } = read;
  const occupied = new Set<string>();
  const pups: NormalizedPupJoint[] = [];
  for (const { c, path } of items) {
    allowedKeys(c, ['type', 'id', 'label', 'lifecycle', 'sources', 'verification', 'tubingId', 'segmentId', 'fromConnection', 'toConnection'], path);
    const meta = metadata(c, path);
    const tubingId = string(c.tubingId, `${path}.tubingId`), segmentId = string(c.segmentId, `${path}.segmentId`);
    const fromConnection = c.fromConnection === undefined ? undefined : string(c.fromConnection, `${path}.fromConnection`);
    const toConnection = c.toConnection === undefined ? undefined : string(c.toConnection, `${path}.toConnection`);
    if (tubingId !== tubing.id) issue('DANGLING_REFERENCE', `${path}.tubingId`, 'Pup Joint must belong to the supplied tubing.', meta.id);
    const segment = tubing.segments.find(s => s.id === segmentId);
    if (!segment) issue('DANGLING_REFERENCE', `${path}.segmentId`, 'Pup Joint segment is missing from the owner tubing.', meta.id);
    else {
      if (segment.bottom <= segment.top) issue('INVALID_INTERVAL', `${path}.segmentId`, 'Pup Joint requires a positive normalized physical length.', meta.id);
      pups.push({ ...meta, type: 'PupJoint', tubingId, segmentId, segment, fromConnection, toConnection });
    }
    if (occupied.has(segmentId)) issue('SEGMENT_OCCUPIED', `${path}.segmentId`, 'This segment already has a Pup Joint component.', meta.id);
    occupied.add(segmentId);
    if (meta.lifecycle === 'installed' && tubing.lifecycle !== 'installed') issue('LIFECYCLE_CONFLICT', `${path}.lifecycle`, 'Installed Pup Joint requires installed tubing.', meta.id);
    if (fromConnection === undefined || toConnection === undefined) issue('CONNECTION_UNRESOLVED', path, 'Pup Joint connection profiles are incomplete; compatibility is unverified.', meta.id, 'warning');
  }
  return pups.sort((a, b) => a.segment.top - b.segment.top || a.id.localeCompare(b.id));
}
