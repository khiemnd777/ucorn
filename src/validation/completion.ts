import type { WellData } from '../types/well-data';
import type { CompletionMetadata, CompletionModel, Diagnostic, TubingHanger } from '../domain/completion';
import { InputValidationError } from '../domain/completion';
import { validatePackers, type PackerHost } from './packers';
import { validateCrossovers } from './crossovers';
import { validateCouplings } from './couplings';
import { validatePupJoints } from './pup-joints';
import { validateSealBores, validateSealAssemblies } from './seal-bores';
import { validateLandingNipples } from './landing-nipples';

type ObjectValue = Record<string, unknown>;
const isObject = (v: unknown): v is ObjectValue => !!v && typeof v === 'object' && !Array.isArray(v);
const tolerance = 1e-7;
const same = (a: number, b: number) => Math.abs(a - b) <= tolerance;

/** Versioned completion adapter; legacy payloads preserve their separate semantics. */
export function prepareWell(input: unknown): { well: WellData; completion?: CompletionModel } {
  const candidate = isObject(input) ? input : {};
  const components = Array.isArray(candidate.components) ? candidate.components : [];
  const completionKinds = ['Tubing', 'TubingHanger', 'CompletionPacker', 'Crossover', 'Coupling', 'PupJoint', 'SealBore', 'SealAssembly', 'LandingNipple'];
  const hasCompletion = components.some(c => isObject(c) && completionKinds.includes(String(c.type)));
  if (candidate.schemaVersion === undefined && !hasCompletion) return { well: input as WellData };
  const diagnostics: Diagnostic[] = [];
  const issue = (code: string, path: string, message: string, componentId?: string, severity: 'error' | 'warning' = 'error') => {
    diagnostics.push({ code, path, message, componentId, severity });
  };
  const fail = () => { if (diagnostics.some(d => d.severity === 'error')) throw new InputValidationError(diagnostics); };
  const object = (value: unknown, path: string): ObjectValue => {
    if (!isObject(value)) issue('INVALID_OBJECT', path, 'Expected an object.');
    return isObject(value) ? value : {};
  };
  const array = (value: unknown, path: string, nonempty = true): unknown[] => {
    if (!Array.isArray(value) || (nonempty && !value.length)) issue('INVALID_ARRAY', path, 'Expected a nonempty array.');
    if (Array.isArray(value) && value.length > 128) issue('RESOURCE_LIMIT', path, 'At most 128 entries are supported per array.');
    return Array.isArray(value) ? value.slice(0, 128) : [];
  };
  const string = (value: unknown, path: string): string => {
    if (typeof value !== 'string' || !value.trim() || value.length > 256) issue('INVALID_STRING', path, 'Expected a nonempty string of at most 256 characters.');
    return typeof value === 'string' ? value : '';
  };
  const number = (value: unknown, path: string, positive = false): number => {
    if (typeof value !== 'number' || !Number.isFinite(value) || (positive && value <= 0)) {
      issue('INVALID_NUMBER', path, positive ? 'Expected a positive finite number.' : 'Expected a finite number.');
      return 0;
    }
    return value;
  };
  const quantity = (value: unknown, path: string, dimension: 'length' | 'diameter', positive = false): number => {
    const q = object(value, path);
    const units: Record<string, number> = dimension === 'length' ? { m: 1, ft: 0.3048 } : { mm: 1, in: 25.4 };
    if (typeof q.unit !== 'string' || !Object.prototype.hasOwnProperty.call(units, q.unit)) issue('INVALID_UNIT', `${path}.unit`, `Expected ${Object.keys(units).join(' or ')}.`);
    const n = number(q.value, `${path}.value`, positive) * (units[String(q.unit)] ?? 1);
    if (!Number.isFinite(n)) issue('INVALID_NUMBER', path, 'Normalized quantity exceeds finite range.');
    return n;
  };
  const ids = new Set<string>();
  const id = (value: unknown, path: string) => {
    const key = string(value, path);
    if (ids.has(key)) issue('DUPLICATE_ID', path, `Duplicate ID: ${key}.`, key);
    ids.add(key);
    return key;
  };
  const metadata = (c: ObjectValue, path: string): CompletionMetadata => {
    const componentId = id(c.id, `${path}.id`);
    const lifecycle = c.lifecycle;
    const verification = c.verification;
    if (!['planned', 'installed', 'removed', 'unknown'].includes(String(lifecycle))) issue('INVALID_LIFECYCLE', `${path}.lifecycle`, 'Declare planned, installed, removed or unknown.', componentId);
    if (!['verified', 'unverified', 'conflicting'].includes(String(verification))) issue('INVALID_VERIFICATION', `${path}.verification`, 'Declare verified, unverified or conflicting.', componentId);
    const sources = array(c.sources, `${path}.sources`, false).map((v, i) => string(v, `${path}.sources[${i}]`));
    if ((lifecycle === 'installed' || verification === 'verified') && !sources.length) issue('EVIDENCE_REQUIRED', `${path}.sources`, 'Installed or verified metadata needs source references.', componentId);
    if (lifecycle === 'removed') issue('UNSUPPORTED_LIFECYCLE', `${path}.lifecycle`, 'Removed equipment is outside the active snapshot capability.', componentId);
    return { id: componentId, label: c.label === undefined ? undefined : string(c.label, `${path}.label`), lifecycle: lifecycle as CompletionMetadata['lifecycle'], sources, verification: verification as CompletionMetadata['verification'] };
  };
  const allowedKeys = (c: ObjectValue, keys: string[], path: string) => {
    for (const key of Object.keys(c)) if (!keys.includes(key)) issue('UNSUPPORTED_FIELD', `${path}.${key}`, 'Field is outside the supported Completion v2 contract.');
  };
  allowedKeys(candidate, ['schemaVersion', 'wellName', 'wellID', 'wellboreId', 'depthContext', 'snapshotAt', 'unit', 'holes', 'components'], 'well');
  if (candidate.schemaVersion !== 2) issue('UNSUPPORTED_VERSION', 'schemaVersion', 'Completion components require schemaVersion: 2.');
  const wellboreId = string(candidate.wellboreId, 'wellboreId');
  const context = object(candidate.depthContext, 'depthContext');
  allowedKeys(context, ['basis', 'datumId'], 'depthContext');
  if (context.basis !== 'MD') issue('UNSUPPORTED_BASIS', 'depthContext.basis', 'Phase 1 supports MD only; no TVD conversion is inferred.');
  const datumId = string(context.datumId, 'depthContext.datumId');
  const snapshotAt = string(candidate.snapshotAt, 'snapshotAt');
  if (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(snapshotAt) || !Number.isFinite(Date.parse(snapshotAt))) issue('INVALID_SNAPSHOT', 'snapshotAt', 'Expected an ISO timestamp with timezone.');
  const unit = object(candidate.unit, 'unit');
  const depthFactor = unit.depth === 'm' ? 1 : unit.depth === 'ft' ? 0.3048 : 0;
  const diameterFactor = unit.diameter === 'in' || unit.diameter === 'inch' ? 1 : unit.diameter === 'mm' ? 1 / 25.4 : 0;
  if (!depthFactor || !diameterFactor) issue('INVALID_UNIT', 'unit', 'Legacy context units must declare m/ft and inch/in/mm.');
  array(candidate.components, 'components');
  fail();
  // Clone before normalization: legacy underream helpers sort their input.
  const well = structuredClone(input) as WellData;
  const raw = well as unknown as ObjectValue;
  const hosts = new Map<string, PackerHost>();
  let previousBottom = 0;
  const holes = array(raw.holes, 'holes').map((v, i) => {
    const path = `holes[${i}]`, h = object(v, path);
    const key = id(h.holeID, `${path}.holeID`);
    const bottom = number(h.depth, `${path}.depth`, true) * depthFactor;
    const diameter = number(h.diameter, `${path}.diameter`, true) * diameterFactor;
    if (!Number.isFinite(diameter * 25.4)) issue('INVALID_NUMBER', `${path}.diameter`, 'Normalized diameter exceeds finite range.');
    if (bottom <= previousBottom) issue('INVALID_INTERVAL', `${path}.depth`, 'Hole cumulative bottoms must strictly increase.');
    if (h.underreamed !== undefined) issue('UNSUPPORTED_CONTEXT', `${path}.underreamed`, 'Completion v2 underream context is not supported yet.');
    hosts.set(key, { kind: 'hole', top: previousBottom, bottom, bores: [{ top: previousBottom, bottom, diameter: diameter * 25.4 }] });
    previousBottom = bottom;
    return { ...h, holeID: key, depth: bottom, diameter };
  });
  const legacyComponents: ObjectValue[] = [];
  const legacyPaths: string[] = [];
  const heads = new Map<string, { diameter: number; seats: Map<string, number> }>();
  const rawComponents = array(raw.components, 'components');
  for (const [i, v] of rawComponents.entries()) {
    const path = `components[${i}]`, c = object(v, path);
    if (completionKinds.includes(String(c.type))) continue;
    legacyPaths.push(path);
    if (!['Casing', 'Cement', 'Packer', 'Wellhead', 'CasingHanger'].includes(String(c.type))) issue('UNSUPPORTED_KIND', `${path}.type`, 'Unsupported component kind.');
    if (c.type === 'Casing') {
      const key = id(c.casingID, `${path}.casingID`);
      const top = number(c.startDepth, `${path}.startDepth`) * depthFactor;
      let at = top;
      const bores: PackerHost['bores'] = [];
      const segments = array(c.segments, `${path}.segments`).map((value, j) => {
        const p = `${path}.segments[${j}]`, s = object(value, p);
        if (s.segmentID !== undefined) id(s.segmentID, `${p}.segmentID`);
        const diameter = number(s.diameter, `${p}.diameter`, true) * diameterFactor;
        const length = number(s.length, `${p}.length`, true) * depthFactor;
        if (!Number.isFinite(diameter * 25.4)) issue('INVALID_NUMBER', `${p}.diameter`, 'Normalized diameter exceeds finite range.');
        const bore = s.boreDiameter === undefined ? undefined : quantity(s.boreDiameter, `${p}.boreDiameter`, 'diameter', true);
        if (bore !== undefined && bore >= diameter * 25.4) issue('INVALID_DIAMETER', `${p}.boreDiameter`, 'Explicit bore must be smaller than the displayed casing envelope.');
        bores.push({ top: at, bottom: at + length, diameter: bore, od: diameter * 25.4 });
        at += length;
        return { ...s, diameter, length };
      });
      if (top < 0 || at > previousBottom + tolerance || !Number.isFinite(at)) issue('INVALID_INTERVAL', path, 'Casing must lie within the supplied well depth.');
      if (c.tieback !== undefined) issue('UNSUPPORTED_CONTEXT', `${path}.tieback`, 'Tieback context requires a separate adapter.');
      hosts.set(key, { kind: 'casing', pipeType: typeof c.pipeType === 'string' ? c.pipeType : undefined, top, bottom: at, bores });
      legacyComponents.push({ ...c, startDepth: top, segments });
    } else {
      legacyComponents.push({ ...c, ...(c.startDepth === undefined ? {} : { startDepth: number(c.startDepth, `${path}.startDepth`) * depthFactor }) });
    }
  }
  if (legacyComponents.filter(c => c.type === 'Wellhead').length > 1) issue('UNSUPPORTED_CONFIGURATION', 'components', 'Phase 1 supports one head.');
  for (const [i, c] of legacyComponents.entries()) {
    const path = legacyPaths[i];
    if (c.type === 'Wellhead') {
      const key = id(c.wellheadID, `${path}.wellheadID`);
      if (c.wellheadType !== 'Onshore') issue('UNSUPPORTED_CONFIGURATION', `${path}.wellheadType`, 'Phase 1 hanger supports an Onshore head.');
      const surface = legacyComponents.find(s => s.type === 'Casing' && s.casingID === c.surfaceCasingID);
      if (!surface) issue('DANGLING_REFERENCE', `${path}.surfaceCasingID`, 'Head surface casing is missing.');
      const surfaceSegments = surface?.segments as { diameter: number }[] | undefined;
      const seats = new Map<string, number>();
      for (const [j, value] of array(c.seats, `${path}.seats`, false).entries()) {
        const p = `${path}.seats[${j}]`, s = object(value, p);
        const seatId = id(s.id, `${p}.id`), at = quantity(s.at, `${p}.at`, 'length');
        if (at < 0 || at > previousBottom) issue('INVALID_INTERVAL', `${p}.at`, 'Seat depth must lie within the MD snapshot.');
        seats.set(seatId, at);
      }
      heads.set(key, { diameter: (surfaceSegments?.[0]?.diameter ?? 0) * 25.4, seats });
    }
    if (['Cement', 'Packer', 'CasingHanger'].includes(String(c.type))) {
      const host = hosts.get(String(c.refCasingID));
      if (!host || !legacyComponents.some(s => s.type === 'Casing' && s.casingID === c.refCasingID)) issue('DANGLING_REFERENCE', `${path}.refCasingID`, 'Referenced casing is missing.');
      if (c.startDepth !== undefined && host && (Number(c.startDepth) < host.top || Number(c.startDepth) > host.bottom)) issue('INVALID_INTERVAL', `${path}.startDepth`, 'Tool/cement depth is outside its host.');
    }
    if (c.seatingCasingID !== undefined && !legacyComponents.some(s => s.type === 'Casing' && s.casingID === c.seatingCasingID)) issue('DANGLING_REFERENCE', `${path}.seatingCasingID`, 'Seating casing is missing.');
  }
  fail();
  const tubingItems = rawComponents.map((v, i) => ({ c: object(v, `components[${i}]`), path: `components[${i}]` })).filter(v => v.c.type === 'Tubing');
  const hangerItems = rawComponents.map((v, i) => ({ c: object(v, `components[${i}]`), path: `components[${i}]` })).filter(v => v.c.type === 'TubingHanger');
  if (tubingItems.length !== 1) issue('UNSUPPORTED_CONFIGURATION', 'components', 'Completion v2 requires exactly one concentric tubing string.');
  fail();
  const { c: tubingInput, path: tubingPath } = tubingItems[0];
  const metaKeys = ['id', 'label', 'lifecycle', 'sources', 'verification'];
  allowedKeys(tubingInput, ['type', ...metaKeys, 'purpose', 'top', 'segments', 'hostSpans'], tubingPath);
  const tubingMeta = metadata(tubingInput, tubingPath);
  if (!['production', 'injection'].includes(String(tubingInput.purpose))) issue('INVALID_PURPOSE', `${tubingPath}.purpose`, 'Declare production or injection.', tubingMeta.id);
  const top = quantity(tubingInput.top, `${tubingPath}.top`, 'length');
  let bottom = top;
  const segments = array(tubingInput.segments, `${tubingPath}.segments`).map((value, i) => {
    const path = `${tubingPath}.segments[${i}]`, s = object(value, path);
    allowedKeys(s, ['id', 'od', 'innerDiameter', 'length'], path);
    const key = id(s.id, `${path}.id`);
    const od = quantity(s.od, `${path}.od`, 'diameter', true);
    const innerDiameter = s.innerDiameter === undefined ? undefined : quantity(s.innerDiameter, `${path}.innerDiameter`, 'diameter', true);
    const length = quantity(s.length, `${path}.length`, 'length', true);
    if (innerDiameter !== undefined && innerDiameter >= od) issue('INVALID_DIAMETER', `${path}.innerDiameter`, 'Tubing ID must be smaller than OD.', tubingMeta.id);
    const result = { id: key, top: bottom, bottom: bottom + length, od, innerDiameter };
    bottom += length;
    return result;
  });
  if (top < 0 || bottom > previousBottom + tolerance || !Number.isFinite(bottom)) issue('INVALID_INTERVAL', `${tubingPath}.top`, 'Tubing must lie within the supplied well depth.', tubingMeta.id);
  const hostSpans = array(tubingInput.hostSpans, `${tubingPath}.hostSpans`).map((value, i) => {
    const p = `${tubingPath}.hostSpans[${i}]`, s = object(value, p);
    allowedKeys(s, ['hostId', 'top', 'bottom'], p);
    return { hostId: string(s.hostId, `${p}.hostId`), top: quantity(s.top, `${p}.top`, 'length'), bottom: quantity(s.bottom, `${p}.bottom`, 'length'), path: p };
  }).sort((a, b) => a.top - b.top);
  let next = top;
  const unresolvedSpans = new Set<string>();
  for (const span of hostSpans) {
    if (!same(span.top, next) || span.bottom <= span.top) issue('HOST_COVERAGE', span.path, 'Host spans must cover tubing continuously without gaps or overlap.', tubingMeta.id);
    const host = hosts.get(span.hostId);
    if (!host) issue('DANGLING_REFERENCE', `${span.path}.hostId`, 'Tubing host is missing.', tubingMeta.id);
    else {
      if (span.top < host.top - tolerance || span.bottom > host.bottom + tolerance) issue('HOST_INTERVAL', span.path, 'Host does not cover the declared tubing span.', tubingMeta.id);
      for (const bore of host.bores) for (const segment of segments) {
        if (Math.max(span.top, bore.top, segment.top) >= Math.min(span.bottom, bore.bottom, segment.bottom) - tolerance) continue;
        if (bore.diameter === undefined && !unresolvedSpans.has(span.path)) {
          issue('FIT_UNRESOLVED', span.path, `Host ${span.hostId} ID is unknown; fit is unverified.`, tubingMeta.id, 'warning');
          unresolvedSpans.add(span.path);
        }
        else if (bore.diameter !== undefined && segment.od >= bore.diameter) issue('IMPOSSIBLE_FIT', span.path, `Tubing OD does not fit host ${span.hostId}.`, tubingMeta.id);
      }
    }
    next = span.bottom;
  }
  if (!same(next, bottom)) issue('HOST_COVERAGE', `${tubingPath}.hostSpans`, 'Host spans must end at tubing bottom.', tubingMeta.id);
  let hanger: CompletionModel['hanger'];
  const occupiedSeats = new Set<string>();
  for (const { c, path } of hangerItems) {
    allowedKeys(c, ['type', ...metaKeys, 'tubingId', 'headId', 'seatId'], path);
    const meta = metadata(c, path);
    const tubingId = string(c.tubingId, `${path}.tubingId`), headId = string(c.headId, `${path}.headId`), seatId = string(c.seatId, `${path}.seatId`);
    if (tubingId !== tubingMeta.id) issue('DANGLING_REFERENCE', `${path}.tubingId`, 'Hanger must reference the supplied tubing.', meta.id);
    const head = heads.get(headId), at = head?.seats.get(seatId);
    if (!head || at === undefined) issue('DANGLING_REFERENCE', `${path}.seatId`, 'Named head/seat is missing.', meta.id);
    if (occupiedSeats.has(`${headId}\0${seatId}`)) issue('SEAT_OCCUPIED', `${path}.seatId`, 'Seat already has a hanger in this snapshot.', meta.id);
    occupiedSeats.add(`${headId}\0${seatId}`);
    if (at !== undefined && !same(at, top)) issue('ANCHOR_MISMATCH', `${path}.seatId`, 'Tubing top must match the declared seat MD anchor.', meta.id);
    if (head && segments[0] && head.diameter <= segments[0].od) issue('INVALID_SUPPORT_GEOMETRY', `${path}.headId`, 'Displayed head envelope must enclose the tubing; no head bore fit is inferred.', meta.id);
    if (meta.lifecycle === 'installed' && tubingMeta.lifecycle !== 'installed') issue('LIFECYCLE_CONFLICT', `${path}.lifecycle`, 'Installed support cannot reference tubing that is not installed.', meta.id);
    hanger = { ...meta, type: 'TubingHanger', tubingId, headId, seatId, at: at ?? top, headDiameter: head?.diameter ?? 0 } satisfies TubingHanger & { at: number; headDiameter: number };
  }
  if (hangerItems.length > 1) issue('UNSUPPORTED_CONFIGURATION', 'components', 'Phase 1 supports one tubing hanger.');
  if (!hanger) issue('SUPPORT_UNKNOWN', tubingPath, 'Tubing support is unknown; no hanger was supplied.', tubingMeta.id, 'warning');
  const tubing: CompletionModel['tubing'] = { ...tubingMeta, type: 'Tubing', purpose: tubingInput.purpose as 'production' | 'injection', top, bottom, segments, hostSpans: hostSpans.map(({ path, ...span }) => span) };
  const packerItems = rawComponents.map((v, i) => ({ c: object(v, `components[${i}]`), path: `components[${i}]` })).filter(v => v.c.type === 'CompletionPacker');
  if (packerItems.length && legacyComponents.some(c => c.type === 'Packer')) issue('AMBIGUOUS_PACKER_FORMAT', 'components', 'Use explicit CompletionPacker entries for this snapshot; do not mix them with legacy Packer entries.');
  const packers = validatePackers(packerItems, hosts, tubing, { object, string, quantity, metadata, allowedKeys, issue });
  const crossoverItems = rawComponents.map((v, i) => ({ c: object(v, `components[${i}]`), path: `components[${i}]` })).filter(v => v.c.type === 'Crossover');
  const crossovers = validateCrossovers(crossoverItems, tubing, { object, string, quantity, metadata, allowedKeys, issue });
  const couplingItems = rawComponents.map((v, i) => ({ c: object(v, `components[${i}]`), path: `components[${i}]` })).filter(v => v.c.type === 'Coupling');
  const couplings = validateCouplings(couplingItems, hosts, { tubing, crossovers, packers }, { object, string, quantity, metadata, allowedKeys, issue });
  const pupItems = rawComponents.map((v, i) => ({ c: object(v, `components[${i}]`), path: `components[${i}]` })).filter(v => v.c.type === 'PupJoint');
  const pupJoints = validatePupJoints(pupItems, tubing, { object, string, quantity, metadata, allowedKeys, issue });
  const model: CompletionModel = { wellboreId, datumId, snapshotAt, tubing, hanger, packers, crossovers, couplings, pupJoints, sealBores: [], sealAssemblies: [], landingNipples: [], diagnostics };
  const readers = { object, string, quantity, metadata, allowedKeys, issue };
  const itemsOf = (type: string) => rawComponents.map((v, i) => ({ c: object(v, `components[${i}]`), path: `components[${i}]` })).filter(v => v.c.type === type);
  const occupied = new Set(pupJoints.map(p => p.segmentId));
  model.sealBores = validateSealBores(itemsOf('SealBore'), hosts, model, readers);
  model.sealAssemblies = validateSealAssemblies(itemsOf('SealAssembly'), model, occupied, readers);
  model.landingNipples = validateLandingNipples(itemsOf('LandingNipple'), model, occupied, readers);
  fail();
  well.holes = holes as WellData['holes'];
  well.components = legacyComponents as unknown as WellData['components'];
  well.unit = { diameter: 'inch', depth: 'm' };
  return { well, completion: model };
}
