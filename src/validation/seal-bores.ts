import type { CompletionModel } from '../domain/completion';
import type { NormalizedSealBore, NormalizedSealAssembly } from '../domain/seal-bore';
import type { PackerHost } from './packers';
import type { CompletionReaders, ObjectValue } from './completion-readers';
import { claimToolSegment } from './completion-tool-segments';

const epsilon = 1e-7;
const overlaps = (top: number, bottom: number, other: { top: number; bottom: number }) => Math.max(top, other.top) < Math.min(bottom, other.bottom) - epsilon;
const metaKeys = ['type', 'id', 'label', 'lifecycle', 'verification', 'sources'];

export function validateSealBores(items: { c: ObjectValue; path: string }[], hosts: Map<string, PackerHost>, model: CompletionModel, read: CompletionReaders): NormalizedSealBore[] {
  const { string, quantity, metadata, allowedKeys, issue } = read;
  const result: NormalizedSealBore[] = [];
  for (const { c, path } of items) {
    allowedKeys(c, [...metaKeys, 'variant', 'ownerId', 'top', 'bottom', 'od', 'innerDiameter', 'profile'], path);
    const meta = metadata(c, path), ownerId = string(c.ownerId, `${path}.ownerId`);
    const top = quantity(c.top, `${path}.top`, 'length'), bottom = quantity(c.bottom, `${path}.bottom`, 'length');
    const od = quantity(c.od, `${path}.od`, 'diameter', true);
    const innerDiameter = c.innerDiameter === undefined ? undefined : quantity(c.innerDiameter, `${path}.innerDiameter`, 'diameter', true);
    const profile = c.profile === undefined ? undefined : string(c.profile, `${path}.profile`);
    const problem = (code: string, field: string, message: string) => issue(code, `${path}.${field}`, message, meta.id);
    if (!['seal-bore', 'pbr'].includes(String(c.variant))) problem('INVALID_RECEPTACLE_VARIANT', 'variant', 'Declare seal-bore or pbr.');
    if (top < 0 || bottom <= top) problem('INVALID_INTERVAL', 'bottom', 'Receptacle requires a positive interval with nonnegative top.');
    if (innerDiameter !== undefined && innerDiameter >= od) problem('INVALID_DIAMETER', 'innerDiameter', 'Receptacle ID must be smaller than body OD.');
    const packer = model.packers.find(p => p.id === ownerId), liner = hosts.get(ownerId);
    const hostId = packer?.outerHostId ?? ownerId, host = hosts.get(hostId);
    if (!packer && !liner) problem('DANGLING_REFERENCE', 'ownerId', 'Receptacle owner is missing.');
    else if (packer ? packer.innerConduitId !== model.tubing.id : !['Production Liner', 'Drilling Liner'].includes(liner?.pipeType ?? '')) problem('UNSUPPORTED_CONFIGURATION', 'ownerId', 'This slice requires a liner or tubing-packer owner.');
    const owner = packer ?? liner;
    if (owner && (top < owner.top - epsilon || bottom > owner.bottom + epsilon)) problem('HOST_INTERVAL', 'top', 'Owner must contain the entire receptacle interval.');
    if (packer && meta.lifecycle === 'installed' && packer.lifecycle !== 'installed') problem('LIFECYCLE_CONFLICT', 'lifecycle', 'Installed receptacle requires installed packer owner.');
    const bores = host?.bores.filter(b => overlaps(top, bottom, b)) ?? [];
    const unresolved = !bores.length || bores.some(b => b.diameter === undefined);
    for (const bore of bores) {
      if (bore.diameter !== undefined && od >= bore.diameter) problem('IMPOSSIBLE_FIT', 'od', 'Receptacle body must fit the declared host bore.');
      if (bore.od !== undefined && od >= bore.od) problem('INVALID_RECEPTACLE_GEOMETRY', 'od', 'Body exceeds the displayed host envelope.');
    }
    for (const span of model.tubing.hostSpans.filter(s => overlaps(top, bottom, s))) {
      if (span.hostId !== hostId) problem('INVALID_RECEPTACLE_ATTACHMENT', 'ownerId', 'Receptacle host must match the tubing host where their intervals overlap.');
    }
    for (const segment of model.tubing.segments.filter(s => overlaps(top, bottom, s))) {
      if (innerDiameter !== undefined && segment.od >= innerDiameter) problem('IMPOSSIBLE_FIT', 'innerDiameter', 'Tubing body cannot enter the receptacle bore.');
      if (segment.od >= od) problem('INVALID_RECEPTACLE_GEOMETRY', 'od', 'Receptacle envelope must surround the supplied tubing body.');
    }
    if (result.some(b => b.hostId === hostId && overlaps(top, bottom, b))) problem('RECEPTACLE_OVERLAP', 'top', 'Receptacles in the same host must not overlap.');
    if (model.packers.some(p => p.id !== ownerId && p.innerConduitId === model.tubing.id && p.outerHostId === hostId && overlaps(top, bottom, p))) problem('UNSUPPORTED_TOOL_OVERLAP', 'top', 'Overlapping packer requires an explicit packer-owned receptacle.');
    if (model.couplings.some(p => p.at >= top - epsilon && p.at <= bottom + epsilon) || model.crossovers.some(p => p.at >= top - epsilon && p.at <= bottom + epsilon)) problem('UNSUPPORTED_TOOL_OVERLAP', 'top', 'Receptacle cannot cross a tubing junction tool in this slice.');
    if (unresolved || innerDiameter === undefined) issue('SEAL_FIT_UNRESOLVED', path, 'Host or receptacle ID is unknown; clearance is unresolved.', meta.id, 'warning');
    issue('SEAL_PROFILE_UNRESOLVED', path, 'Seal profile compatibility and hydraulic sealing are unverified.', meta.id, 'warning');
    result.push({ ...meta, type: 'SealBore', variant: c.variant as NormalizedSealBore['variant'], ownerId, hostId, top, bottom, od, innerDiameter, profile, fit: unresolved ? 'unresolved' : 'clearance-checked' });
  }
  return result.sort((a, b) => a.top - b.top || a.id.localeCompare(b.id));
}

export function validateSealAssemblies(items: { c: ObjectValue; path: string }[], model: CompletionModel, occupied: Set<string>, read: CompletionReaders): NormalizedSealAssembly[] {
  const { string, quantity, metadata, allowedKeys, issue } = read;
  const result: NormalizedSealAssembly[] = [], receipts = new Set<string>();
  for (const { c, path } of items) {
    allowedKeys(c, [...metaKeys, 'tubingId', 'segmentId', 'receptacleId', 'top', 'bottom', 'engagement', 'profile'], path);
    const meta = metadata(c, path), tubingId = string(c.tubingId, `${path}.tubingId`), segmentId = string(c.segmentId, `${path}.segmentId`);
    const receptacleId = string(c.receptacleId, `${path}.receptacleId`);
    const top = quantity(c.top, `${path}.top`, 'length'), bottom = quantity(c.bottom, `${path}.bottom`, 'length');
    const profile = c.profile === undefined ? undefined : string(c.profile, `${path}.profile`);
    const segment = claimToolSegment(tubingId, segmentId, meta, path, model, occupied, read);
    const receipt = model.sealBores.find(b => b.id === receptacleId);
    const problem = (code: string, field: string, message: string) => issue(code, `${path}.${field}`, message, meta.id);
    if (!receipt) problem('DANGLING_REFERENCE', 'receptacleId', 'Named seal receptacle is missing.');
    if (receipts.has(receptacleId)) problem('RECEPTACLE_OCCUPIED', 'receptacleId', 'Only one seal assembly may reference this receptacle in a snapshot.');
    receipts.add(receptacleId);
    if (!['engaged', 'partial', 'disengaged', 'unknown'].includes(String(c.engagement))) problem('INVALID_ENGAGEMENT', 'engagement', 'Declare engaged, partial, disengaged or unknown.');
    if (top < 0 || bottom <= top) problem('INVALID_INTERVAL', 'bottom', 'Seal interval must be positive.');
    if (segment && (top < segment.top - epsilon || bottom > segment.bottom + epsilon)) problem('HOST_INTERVAL', 'top', 'Seal interval must remain within the owned tubing segment.');
    if (receipt && meta.lifecycle === 'installed' && receipt.lifecycle !== 'installed') problem('LIFECYCLE_CONFLICT', 'lifecycle', 'Installed seal assembly requires installed receptacle.');
    const overlapLength = receipt ? Math.max(0, Math.min(bottom, receipt.bottom) - Math.max(top, receipt.top)) : 0;
    if (receipt && ((c.engagement === 'engaged' && overlapLength <= epsilon) || (c.engagement === 'disengaged' && overlapLength > epsilon) || (c.engagement === 'partial' && (overlapLength <= epsilon || overlapLength >= Math.min(bottom - top, receipt.bottom - receipt.top) - epsilon)))) problem('ENGAGEMENT_CONFLICT', 'engagement', 'Declared engagement conflicts with geometric overlap.');
    if (segment && receipt && receipt.innerDiameter !== undefined && segment.od >= receipt.innerDiameter) problem('IMPOSSIBLE_FIT', 'receptacleId', 'Seal mandrel body cannot enter the supplied receptacle bore.');
    if (segment && model.packers.some(p => p.innerConduitId === tubingId && p.id !== receipt?.ownerId && overlaps(segment.top, segment.bottom, p))) problem('UNSUPPORTED_TOOL_OVERLAP', 'segmentId', 'Seal segment overlaps an unrelated tubing packer.');
    const fit = receipt?.innerDiameter === undefined ? 'unresolved' : 'clearance-checked';
    if (fit === 'unresolved') issue('SEAL_FIT_UNRESOLVED', path, 'Receptacle ID is unknown; mandrel clearance is unresolved.', meta.id, 'warning');
    issue('SEAL_PROFILE_UNRESOLVED', path, 'Seal profile compatibility and hydraulic sealing are unverified.', meta.id, 'warning');
    if (segment) result.push({ ...meta, type: 'SealAssembly', tubingId, segmentId, receptacleId, top, bottom, segment, overlapLength, engagement: c.engagement as NormalizedSealAssembly['engagement'], profile, fit });
  }
  return result.sort((a, b) => a.top - b.top || a.id.localeCompare(b.id));
}
