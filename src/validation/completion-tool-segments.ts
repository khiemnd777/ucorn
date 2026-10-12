import type { CompletionModel, CompletionMetadata } from '../domain/completion';
import type { CompletionReaders } from './completion-readers';

/** Physical classification owns a segment; it never appends another pipe length. */
export function claimToolSegment(tubingId: string, segmentId: string, meta: CompletionMetadata,
  path: string, model: CompletionModel, occupied: Set<string>, read: CompletionReaders) {
  const { issue } = read;
  if (tubingId !== model.tubing.id) issue('DANGLING_REFERENCE', `${path}.tubingId`, 'Tool must belong to the supplied tubing.', meta.id);
  const segment = model.tubing.segments.find(s => s.id === segmentId);
  if (!segment) issue('DANGLING_REFERENCE', `${path}.segmentId`, 'Owned tubing segment is missing.', meta.id);
  if (occupied.has(segmentId)) issue('SEGMENT_OCCUPIED', `${path}.segmentId`, 'A physical tool already owns this tubing segment.', meta.id);
  occupied.add(segmentId);
  if (meta.lifecycle === 'installed' && model.tubing.lifecycle !== 'installed') issue('LIFECYCLE_CONFLICT', `${path}.lifecycle`, 'Installed tool requires installed tubing.', meta.id);
  return segment;
}
