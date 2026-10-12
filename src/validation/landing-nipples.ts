import type { CompletionModel } from '../domain/completion';
import type { NormalizedLandingNipple } from '../domain/landing-nipple';
import type { CompletionReaders, ObjectValue } from './completion-readers';
import { claimToolSegment } from './completion-tool-segments';

export function validateLandingNipples(items: { c: ObjectValue; path: string }[], model: CompletionModel, occupied: Set<string>, read: CompletionReaders): NormalizedLandingNipple[] {
  const { string, quantity, metadata, allowedKeys, issue } = read;
  const result: NormalizedLandingNipple[] = [];
  for (const { c, path } of items) {
    allowedKeys(c, ['type', 'id', 'label', 'lifecycle', 'verification', 'sources', 'tubingId', 'segmentId', 'profileType', 'profile', 'sealBoreDiameter', 'noGoDiameter'], path);
    const meta = metadata(c, path), tubingId = string(c.tubingId, `${path}.tubingId`), segmentId = string(c.segmentId, `${path}.segmentId`);
    const segment = claimToolSegment(tubingId, segmentId, meta, path, model, occupied, read);
    const profile = c.profile === undefined ? undefined : string(c.profile, `${path}.profile`);
    const sealBoreDiameter = c.sealBoreDiameter === undefined ? undefined : quantity(c.sealBoreDiameter, `${path}.sealBoreDiameter`, 'diameter', true);
    const noGoDiameter = c.noGoDiameter === undefined ? undefined : quantity(c.noGoDiameter, `${path}.noGoDiameter`, 'diameter', true);
    const problem = (code: string, field: string, message: string) => issue(code, `${path}.${field}`, message, meta.id);
    if (!['selective', 'no-go', 'ported', 'unknown'].includes(String(c.profileType)) || (noGoDiameter !== undefined && c.profileType !== 'no-go')) problem('INVALID_PROFILE_TYPE', 'profileType', 'Declare selective, no-go, ported or unknown; no-go diameter belongs only to no-go profiles.');
    for (const [field, diameter] of [['sealBoreDiameter', sealBoreDiameter], ['noGoDiameter', noGoDiameter]] as const) {
      if (diameter !== undefined && segment && (diameter >= segment.od || (segment.innerDiameter !== undefined && diameter > segment.innerDiameter + 1e-7))) problem('INVALID_DIAMETER', field, 'Profile diameter must fit the supplied tubing wall and ID.');
    }
    if (noGoDiameter !== undefined && sealBoreDiameter !== undefined && noGoDiameter > sealBoreDiameter + 1e-7) problem('INVALID_DIAMETER', 'noGoDiameter', 'No-go restriction cannot exceed seal-bore diameter.');
    if (segment) {
      const overlap = (p: { top: number; bottom: number }) => Math.max(segment.top, p.top) < Math.min(segment.bottom, p.bottom) - 1e-7;
      if (model.packers.some(p => p.innerConduitId === tubingId && overlap(p)) || model.sealBores.some(overlap)) problem('UNSUPPORTED_TOOL_OVERLAP', 'segmentId', 'Nipple cannot overlap a tubing packer or seal receptacle in this slice.');
      result.push({ ...meta, type: 'LandingNipple', tubingId, segmentId, segment, profileType: c.profileType as NormalizedLandingNipple['profileType'], profile, sealBoreDiameter, noGoDiameter });
    }
    if (segment?.innerDiameter === undefined || sealBoreDiameter === undefined || (c.profileType === 'no-go' && noGoDiameter === undefined)) issue('NIPPLE_BORE_UNRESOLVED', path, 'Nipple bore or no-go dimensions are incomplete; no restriction is inferred.', meta.id, 'warning');
    issue('NIPPLE_PROFILE_UNRESOLVED', path, 'Lock compatibility and installed insert state are unknown.', meta.id, 'warning');
  }
  return result.sort((a, b) => a.segment.top - b.segment.top || a.id.localeCompare(b.id));
}
