import { describe, expect, test } from 'bun:test';
import sample from '../sample-data/well-completion-seals.json';
import oldSample from '../sample-data/well-completion-joints.json';
import { prepareWell } from '../src/validation/completion';
import { InputValidationError } from '../src/domain/completion';
import { layoutCompletion } from '../src/geometry/completion-layout';
import { handleHole } from '../src/handlers/hole-handler';

const fixture = (): any => structuredClone(sample);
const item = (w: any, type: string) => w.components.find((c: any) => c.type === type);
const model = (w: any): any => prepareWell(w).completion!;
const layout = (w: any): any => layoutCompletion(model(w), {
  centerX: 112.5, depthToY: n => n * 900 / 5000, diameterToWidth: n => n * 5 / 25.4,
  headMouth: { left: 62.5, right: 162.5, top: -52 },
});
const diagnostics = (w: any) => {
  try { prepareWell(w); } catch (e) {
    expect(e).toBeInstanceOf(InputValidationError); return (e as InputValidationError).diagnostics;
  }
  throw new Error('Expected validation failure');
};

describe('Seal interfaces', () => {
  test('explicit liner/receptacle/assembly graph preserves physical length and geometric overlap', () => {
    const m = model(fixture());
    expect(m.sealBores[0].ownerId).toBe('L01-PRODUCTION');
    expect(m.sealBores[0].fit).toBe('clearance-checked');
    expect(m.sealAssemblies[0].receptacleId).toBe('PBR-01');
    expect(m.sealAssemblies[0].overlapLength).toBe(10);
    expect(m.tubing.bottom).toBe(4000);
    expect(m.diagnostics.every((d: any) => d.severity === 'warning')).toBe(true);
    expect(model(oldSample).sealBores).toEqual([]);
  });
  test('partial, disengaged and unknown are distinct declared states', () => {
    for (const [state, top, bottom, overlap] of [['partial', 2802, 2810, 5], ['disengaged', 2815, 2818, 0], ['unknown', 2802, 2818, 10]] as const) {
      const w = fixture(), a = item(w, 'SealAssembly');
      a.top.value = top; a.bottom.value = bottom; a.engagement = state;
      expect(model(w).sealAssemblies[0].overlapLength).toBe(overlap);
      expect(handleHole(w)).toContain(`Engagement: ${state}`);
    }
  });
  test('a tubing packer can explicitly own a bounded seal bore', () => {
    const w = fixture(), b = item(w, 'SealBore'), a = item(w, 'SealAssembly'), t = item(w, 'Tubing');
    b.ownerId = 'PK-P01'; b.top.value = 2405; b.bottom.value = 2415; b.innerDiameter.value = 5;
    a.segmentId = 'T01-MID'; a.top.value = 2402; a.bottom.value = 2418;
    expect(model(w).sealBores[0].hostId).toBe('C04-PRODUCTION');
    expect(model(w).tubing.bottom).toBe(4000);
    t.lifecycle = 'installed'; item(w, 'CompletionPacker').lifecycle = 'installed';
    b.lifecycle = 'installed'; a.lifecycle = 'installed';
    expect(model(w).sealAssemblies[0].lifecycle).toBe('installed');
  });
  test('missing bore/profiles remain unresolved without invented seal contact', () => {
    const w = fixture(); delete item(w, 'SealBore').innerDiameter;
    delete item(w, 'SealAssembly').profile;
    const m = model(w), svg = handleHole(w);
    expect(m.sealAssemblies[0].fit).toBe('unresolved');
    expect(m.diagnostics.some((d: any) => d.code === 'SEAL_FIT_UNRESOLVED')).toBe(true);
    expect(svg).toContain('ID unknown'); expect(svg).toContain('compatibility unverified');
    expect(layout(w).sealBores[0].lines.some((p: any) => p.role === 'id')).toBe(false);
  });
});

describe('Landing nipple', () => {
  test('owns a four-metre physical segment and leaves insert state unknown', () => {
    const m = model(fixture()), n = m.landingNipples[0];
    expect([n.segment.top, n.segment.bottom]).toEqual([1800, 1804]);
    expect(n.sealBoreDiameter).toBeCloseTo(88.9); expect(n.noGoDiameter).toBeCloseTo(82.55);
    expect(handleHole(fixture())).toContain('Insert: unknown');
    expect(model(oldSample).landingNipples).toEqual([]);
  });
  test('selective and unknown profiles do not invent a no-go restriction', () => {
    for (const profile of ['selective', 'unknown']) {
      const w = fixture(), n = item(w, 'LandingNipple');
      n.profileType = profile; delete n.noGoDiameter; delete n.sealBoreDiameter;
      expect(model(w).landingNipples[0].noGoDiameter).toBeUndefined();
      expect(layout(w).landingNipples[0].lines.some((p: any) => p.role === 'no-go')).toBe(false);
      expect(handleHole(w)).toContain('Seal bore unknown');
    }
  });
});

const invalid: [string, (w: any) => void, string][] = [
  ['missing version', w => delete w.schemaVersion, 'UNSUPPORTED_VERSION'],
  ['missing receptacle owner', w => item(w, 'SealBore').ownerId = 'missing', 'DANGLING_REFERENCE'],
  ['unsupported casing owner', w => item(w, 'SealBore').ownerId = 'C04-PRODUCTION', 'UNSUPPORTED_CONFIGURATION'],
  ['receipt outside owner', w => item(w, 'SealBore').top.value = 2799, 'HOST_INTERVAL'],
  ['zero interval', w => item(w, 'SealBore').bottom.value = 2805, 'INVALID_INTERVAL'],
  ['body outside bore', w => item(w, 'SealBore').od.value = 6.5, 'IMPOSSIBLE_FIT'],
  ['bore at body OD', w => item(w, 'SealBore').innerDiameter.value = 5.5, 'INVALID_DIAMETER'],
  ['NaN depth', w => item(w, 'SealAssembly').top.value = NaN, 'INVALID_NUMBER'],
  ['infinite diameter', w => item(w, 'SealBore').od.value = Infinity, 'INVALID_NUMBER'],
  ['unsupported unit', w => item(w, 'SealBore').od.unit = 'm', 'INVALID_UNIT'],
  ['missing receipt', w => item(w, 'SealAssembly').receptacleId = 'missing', 'DANGLING_REFERENCE'],
  ['wrong tubing', w => item(w, 'SealAssembly').tubingId = 'missing', 'DANGLING_REFERENCE'],
  ['missing segment', w => item(w, 'LandingNipple').segmentId = 'missing', 'DANGLING_REFERENCE'],
  ['seal outside segment', w => item(w, 'SealAssembly').bottom.value = 2821, 'HOST_INTERVAL'],
  ['engaged with no overlap', w => item(w, 'SealAssembly').top.value = 2815, 'ENGAGEMENT_CONFLICT'],
  ['disengaged with overlap', w => item(w, 'SealAssembly').engagement = 'disengaged', 'ENGAGEMENT_CONFLICT'],
  ['partial with complete overlap', w => item(w, 'SealAssembly').engagement = 'partial', 'ENGAGEMENT_CONFLICT'],
  ['invalid engagement state', w => item(w, 'SealAssembly').engagement = 'set', 'INVALID_ENGAGEMENT'],
  ['body cannot enter receipt', w => item(w, 'SealBore').innerDiameter.value = 3.5, 'IMPOSSIBLE_FIT'],
  ['duplicate receipt occupancy', w => w.components.push({ ...item(w, 'SealAssembly'), id: 'SA-02' }), 'RECEPTACLE_OCCUPIED'],
  ['duplicate segment', w => w.components.push({ ...item(w, 'LandingNipple'), id: 'LN-02' }), 'SEGMENT_OCCUPIED'],
  ['duplicate ID', w => item(w, 'SealAssembly').id = 'PBR-01', 'DUPLICATE_ID'],
  ['installed on planned tubing', w => item(w, 'LandingNipple').lifecycle = 'installed', 'LIFECYCLE_CONFLICT'],
  ['installed on planned receipt', w => { item(w, 'Tubing').lifecycle = 'installed'; item(w, 'SealAssembly').lifecycle = 'installed'; }, 'LIFECYCLE_CONFLICT'],
  ['no evidence', w => { item(w, 'SealBore').verification = 'verified'; item(w, 'SealBore').sources = []; }, 'EVIDENCE_REQUIRED'],
  ['unsupported profile', w => item(w, 'LandingNipple').profileType = 'guessed', 'INVALID_PROFILE_TYPE'],
  ['no-go exceeds seal bore', w => item(w, 'LandingNipple').noGoDiameter.value = 3.6, 'INVALID_DIAMETER'],
  ['nipple bore exceeds segment ID', w => item(w, 'LandingNipple').sealBoreDiameter.value = 4, 'INVALID_DIAMETER'],
  ['no-go on selective', w => item(w, 'LandingNipple').profileType = 'selective', 'INVALID_PROFILE_TYPE'],
  ['automatic insert rejected', w => item(w, 'LandingNipple').insert = 'plug', 'UNSUPPORTED_FIELD'],
  ['extra length rejected', w => item(w, 'LandingNipple').length = { value: 4, unit: 'm' }, 'UNSUPPORTED_FIELD'],
  ['nipple over packer', w => item(w, 'LandingNipple').segmentId = 'T01-MID', 'UNSUPPORTED_TOOL_OVERLAP'],
  ['Pup double ownership', w => w.components.push({ type: 'PupJoint', id: 'PJ-NEW', tubingId: 'T01', segmentId: 'NP-S01', lifecycle: 'planned', verification: 'unverified', sources: [] }), 'SEGMENT_OCCUPIED'],
];
for (const [name, mutate, code] of invalid) test(name, () => {
  const w = fixture(); mutate(w);
  const d = diagnostics(w).find(d => d.code === code);
  expect(d).toBeDefined(); expect(d!.path).toMatch(/^components\[|schemaVersion/);
});

test('units, component reordering, immutable inputs and escaped labels preserve geometry', () => {
  const w = fixture(), before = layout(w), copy = structuredClone(w);
  handleHole(w); expect(w).toEqual(copy);
  w.components.reverse(); expect(layout(w)).toEqual(before);
  for (const type of ['SealBore', 'SealAssembly', 'LandingNipple']) {
    const c = item(w, type);
    for (const key of ['top', 'bottom']) if (c[key]) c[key] = { value: c[key].value / 0.3048, unit: 'ft' };
    for (const key of ['od', 'innerDiameter', 'sealBoreDiameter', 'noGoDiameter']) if (c[key]) c[key] = { value: c[key].value * 25.4, unit: 'mm' };
  }
  // Unit conversion can differ by machine epsilon; compare below a nanometre/pixel.
  const comparable = (value: unknown) => JSON.parse(JSON.stringify(value, (_, v) => typeof v === 'number' ? Number(v.toFixed(9)) : v));
  expect(comparable(layout(w))).toEqual(comparable(before));
  for (const type of ['SealBore', 'SealAssembly', 'LandingNipple']) item(w, type).label = '<script>&'.repeat(20);
  const svg = handleHole(w), l = layout(w);
  expect(svg).toContain('&lt;script&gt;&amp;'); expect(svg).not.toContain('<script>');
  expect(svg).not.toMatch(/NaN|Infinity/);
  for (const p of [...l.sealBores, ...l.sealAssemblies, ...l.landingNipples]) {
    expect(p.lines.every((line: any) => (line.x1 - 112.5) * (line.x2 - 112.5) > 0)).toBe(true);
    expect(p.labels.every((label: any) => label.x + label.text.length * 7 + 100 < l.width && label.y + 110 < l.height)).toBe(true);
    expect(p.detailLabels[0].text).toContain('not MD scale');
  }
  expect(l.landingNipples[0].bottomY - l.landingNipples[0].topY).toBeCloseTo(0.72);
  expect(l.tubing.some((line: any) => line.segmentId === 'NP-S01')).toBe(false);
});

test('nipple profile remains visible between couplings at both segment endpoints', () => {
  const w = fixture();
  for (const [id, from, to, at] of [['CPL-A', 'T01-UPPER', 'NP-S01', 1800], ['CPL-B', 'NP-S01', 'T01-MID', 1804]] as const) {
    w.components.push({ type: 'Coupling', id, tubingId: 'T01', fromSegmentId: from, toSegmentId: to,
      at: { value: at, unit: 'm' }, od: { value: 5.25, unit: 'in' }, lifecycle: 'planned', verification: 'unverified', sources: [] });
  }
  const l = layout(w), n = l.landingNipples[0];
  const profile = n.lines.filter((line: any) => ['profile-shoulder', 'no-go'].includes(line.role));
  expect(l.couplings[0].bottomY).toBeLessThanOrEqual(Math.min(...profile.map((p: any) => p.y1)));
  expect(l.couplings[1].topY).toBeGreaterThanOrEqual(Math.max(...profile.map((p: any) => p.y1)));
});

test('known no-go diameter remains represented when both surrounding bore IDs are unknown', () => {
  const w = fixture(); delete item(w, 'LandingNipple').sealBoreDiameter;
  delete item(w, 'Tubing').segments.find((s: any) => s.id === 'NP-S01').innerDiameter;
  expect(layout(w).landingNipples[0].lines.some((p: any) => p.role === 'no-go')).toBe(true);
  expect(model(w).diagnostics.some((d: any) => d.code === 'NIPPLE_BORE_UNRESOLVED')).toBe(true);
});

test('repeated nipples on distinct physical segments are not merged', () => {
  const w = fixture(), t = item(w, 'Tubing'), n = item(w, 'LandingNipple');
  t.segments.splice(2, 0, { ...structuredClone(t.segments[1]), id: 'NP-S02' });
  t.segments[3].length.value -= 4;
  w.components.push({ ...structuredClone(n), id: 'LN-02', segmentId: 'NP-S02' });
  expect(model(w).landingNipples.map((n: any) => n.id)).toEqual(['LN-01', 'LN-02']);
  expect(model(w).tubing.bottom).toBe(4000);
});

test('seal bore remains renderable without a seal assembly', () => {
  const w = fixture(); w.components = w.components.filter((c: any) => c.type !== 'SealAssembly');
  expect(model(w).sealAssemblies).toEqual([]);
  expect(handleHole(w).includes('data-kind="SealBore"')).toBe(true);
  expect(handleHole(w).includes('data-kind="SealAssembly"')).toBe(false);
});
