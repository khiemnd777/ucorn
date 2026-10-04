import { describe, expect, test } from 'bun:test';
import sample from '../sample-data/well-completion-joints.json';
import oldSample from '../sample-data/well-completion-crossover.json';
import { prepareWell } from '../src/validation/completion';
import { InputValidationError } from '../src/domain/completion';
import { layoutCompletion } from '../src/geometry/completion-layout';
import { handleHole } from '../src/handlers/hole-handler';

const fixture = (): any => structuredClone(sample);
const coupling = (w: any) => w.components.find((c: any) => c.type === 'Coupling');
const pup = (w: any) => w.components.find((c: any) => c.type === 'PupJoint');
const tube = (w: any) => w.components.find((c: any) => c.type === 'Tubing');
const layout = (w: any) => layoutCompletion(prepareWell(w).completion!, {
  centerX: 112.5, depthToY: n => n * 900 / 5000, diameterToWidth: n => n * 5 / 25.4,
  headMouth: { left: 62.5, right: 162.5, top: -52 },
});
const diagnostics = (w: any) => {
  try { prepareWell(w); } catch (e) {
    expect(e).toBeInstanceOf(InputValidationError); return (e as InputValidationError).diagnostics;
  }
  throw new Error('Expected validation failure');
};

describe('Coupling contract', () => {
  test('declared body joins same-size endpoints with explicit host clearance', () => {
    const m = prepareWell(fixture()).completion!, c = m.couplings[0];
    expect(c.at).toBe(2000); expect(c.od).toBeCloseTo(133.35);
    expect(c.from.bottom).toBe(c.to.top); expect(c.from.od).toBe(c.to.od);
    expect(c.fit).toBe('clearance-checked'); expect(m.tubing.bottom).toBe(4000);
    expect(m.diagnostics).toEqual([]);
    expect(prepareWell(oldSample).completion!.couplings).toEqual([]);
  });
  test('mixed body diameter/depth units produce equivalent geometry', () => {
    const w = fixture(), before = layout(w), c = coupling(w);
    c.at = { value: 2000 / 0.3048, unit: 'ft' };
    c.od = { value: 5.25 * 25.4, unit: 'mm' }; c.innerDiameter = { value: 4 * 25.4, unit: 'mm' };
    expect(layout(w)).toEqual(before);
  });
  test('unknown bore/body ID/profile are visible without fabricated walls', () => {
    const w = fixture(); delete coupling(w).innerDiameter; delete coupling(w).fromConnection;
    delete w.components.find((c: any) => c.casingID === 'C04-PRODUCTION').segments[0].boreDiameter;
    const m = prepareWell(w).completion!, l = layout(w);
    expect(m.couplings[0].fit).toBe('unresolved');
    expect(m.diagnostics.map(d => d.code)).toContain('COUPLING_FIT_UNRESOLVED');
    expect(m.diagnostics.map(d => d.code)).toContain('CONNECTION_UNRESOLVED');
    expect(l.couplings[0].lines.some(p => p.role === 'id' || p.role === 'bore-step')).toBe(false);
    expect(handleHole(w)).toContain('ID unknown');
  });
  const invalid: [string, (w: any) => void, string][] = [
    ['no version', w => delete w.schemaVersion, 'UNSUPPORTED_VERSION'],
    ['wrong owner', w => coupling(w).tubingId = 'missing', 'DANGLING_REFERENCE'],
    ['missing upper', w => coupling(w).fromSegmentId = 'missing', 'DANGLING_REFERENCE'],
    ['missing lower', w => coupling(w).toSegmentId = 'missing', 'DANGLING_REFERENCE'],
    ['self link', w => coupling(w).toSegmentId = coupling(w).fromSegmentId, 'INVALID_COUPLING_ATTACHMENT'],
    ['reversed link', w => [coupling(w).fromSegmentId, coupling(w).toSegmentId] = [coupling(w).toSegmentId, coupling(w).fromSegmentId], 'INVALID_COUPLING_ATTACHMENT'],
    ['nonadjacent link', w => coupling(w).toSegmentId = 'T01-S01B', 'INVALID_COUPLING_ATTACHMENT'],
    ['wrong anchor', w => coupling(w).at.value++, 'ANCHOR_MISMATCH'],
    ['negative anchor', w => coupling(w).at.value = -1, 'ANCHOR_MISMATCH'],
    ['NaN anchor', w => coupling(w).at.value = NaN, 'INVALID_NUMBER'],
    ['wrong unit', w => coupling(w).od.unit = 'm', 'INVALID_UNIT'],
    ['zero body', w => coupling(w).od.value = 0, 'INVALID_NUMBER'],
    ['infinite body', w => coupling(w).od.value = Infinity, 'INVALID_NUMBER'],
    ['body below tubing OD', w => coupling(w).od.value = 4, 'INVALID_COUPLING_GEOMETRY'],
    ['ID at OD', w => coupling(w).innerDiameter.value = 5.25, 'INVALID_DIAMETER'],
    ['body cannot pass host bore', w => coupling(w).od.value = 9.125, 'IMPOSSIBLE_FIT'],
    ['duplicate component ID', w => coupling(w).id = pup(w).id, 'DUPLICATE_ID'],
    ['duplicate junction', w => w.components.push({ ...coupling(w), id: 'CPL-02' }), 'JUNCTION_OCCUPIED'],
    ['different endpoint OD', w => tube(w).segments[1].od.value = 4.25, 'UNSUPPORTED_CONFIGURATION'],
    ['empty connection', w => coupling(w).toConnection = '', 'INVALID_STRING'],
    ['installed on planned tubing', w => coupling(w).lifecycle = 'installed', 'LIFECYCLE_CONFLICT'],
    ['missing evidence', w => { coupling(w).verification = 'verified'; coupling(w).sources = []; }, 'EVIDENCE_REQUIRED'],
    ['unsupported physical length', w => coupling(w).length = { value: 1, unit: 'm' }, 'UNSUPPORTED_FIELD'],
    ['conflicting crossover', w => {
      const c = coupling(w); w.components.push({ type: 'Crossover', id: 'XO-CPL', lifecycle: c.lifecycle, verification: c.verification, sources: c.sources, tubingId: c.tubingId, fromSegmentId: c.fromSegmentId, toSegmentId: c.toSegmentId, at: c.at });
    }, 'JUNCTION_OCCUPIED'],
    ['coupling at tubing packer', w => {
      tube(w).segments[0].length.value = 2400; tube(w).segments[2].length.value = 394; coupling(w).at.value = 2400;
    }, 'UNSUPPORTED_TOOL_OVERLAP'],
  ];
  for (const [name, mutate, code] of invalid) test(name, () => {
    const w = fixture(); mutate(w); const d = diagnostics(w).find(d => d.code === code);
    expect(d).toBeDefined(); expect(d!.path.length).toBeGreaterThan(0);
  });
  test('host changes check both explicit bores at an exact junction', () => {
    const w = fixture(); w.components = w.components.filter((c: any) => c.type !== 'Crossover');
    const c = coupling(w); c.fromSegmentId = 'T01-S01B'; c.toSegmentId = 'T01-S02'; c.at.value = 2800;
    tube(w).segments[3].od.value = 4.5; c.od.value = 6.6;
    expect(diagnostics(w).map(d => d.code)).toContain('IMPOSSIBLE_FIT');
  });
});

describe('Pup Joint physical ownership', () => {
  test('six-metre segment is included once, with stable top/bottom and IDs', () => {
    const m = prepareWell(fixture()).completion!, p = m.pupJoints[0];
    expect(p.segment.id).toBe(p.segmentId);
    expect([p.segment.top, p.segment.bottom]).toEqual([2000, 2006]);
    expect(m.tubing.bottom).toBe(4000);
    expect(m.tubing.segments.reduce((sum, s) => sum + s.bottom - s.top, 0)).toBe(4000);
    expect(prepareWell(oldSample).completion!.pupJoints).toEqual([]);
  });
  test('changing pup length changes tubing length exactly once', () => {
    const w = fixture(); tube(w).segments[1].length.value++;
    tube(w).hostSpans[1].bottom.value++;
    w.components.find((c: any) => c.type === 'Crossover').at.value++;
    const m = prepareWell(w).completion!;
    expect(m.pupJoints[0].segment.bottom - m.pupJoints[0].segment.top).toBe(7);
    expect(m.tubing.bottom).toBe(4001);
  });
  test('segment quantity conversions retain both physical and detail geometry', () => {
    const w = fixture(), before = layout(w), s = tube(w).segments[1];
    s.length = { value: 6 / 0.3048, unit: 'ft' }; s.od = { value: 114.3, unit: 'mm' };
    s.innerDiameter = { value: 101.6, unit: 'mm' };
    expect(layout(w)).toEqual(before);
  });
  test('unknown bore/profile does not synthesize detail lumen', () => {
    const w = fixture(); delete tube(w).segments[1].innerDiameter; delete pup(w).fromConnection;
    const p = layout(w).pupJoints[0];
    expect(p.detailLines).toHaveLength(2);
    expect(handleHole(w)).toContain('Connections: unknown');
    expect(prepareWell(w).completion!.diagnostics.some(d => d.componentId === 'PJ-01' && d.code === 'CONNECTION_UNRESOLVED')).toBe(true);
  });
  const invalid: [string, (w: any) => void, string][] = [
    ['missing version', w => delete w.schemaVersion, 'UNSUPPORTED_VERSION'],
    ['wrong tubing', w => pup(w).tubingId = 'missing', 'DANGLING_REFERENCE'],
    ['missing segment', w => pup(w).segmentId = 'missing', 'DANGLING_REFERENCE'],
    ['duplicate segment ownership', w => w.components.push({ ...pup(w), id: 'PJ-02' }), 'SEGMENT_OCCUPIED'],
    ['duplicate ID', w => pup(w).id = tube(w).id, 'DUPLICATE_ID'],
    ['zero physical length', w => tube(w).segments[1].length.value = 0, 'INVALID_NUMBER'],
    ['infinite physical length', w => tube(w).segments[1].length.value = Infinity, 'INVALID_NUMBER'],
    ['empty profile', w => pup(w).fromConnection = '', 'INVALID_STRING'],
    ['installed on planned tubing', w => pup(w).lifecycle = 'installed', 'LIFECYCLE_CONFLICT'],
    ['missing source evidence', w => { pup(w).verification = 'verified'; pup(w).sources = []; }, 'EVIDENCE_REQUIRED'],
    ['removed active equipment', w => pup(w).lifecycle = 'removed', 'UNSUPPORTED_LIFECYCLE'],
    ['duplicate length field', w => pup(w).length = { value: 6, unit: 'm' }, 'UNSUPPORTED_FIELD'],
    ['duplicate diameter field', w => pup(w).od = { value: 4.5, unit: 'in' }, 'UNSUPPORTED_FIELD'],
    ['duplicate depth field', w => pup(w).top = { value: 2000, unit: 'm' }, 'UNSUPPORTED_FIELD'],
  ];
  for (const [name, mutate, code] of invalid) test(name, () => {
    const w = fixture(); mutate(w); expect(diagnostics(w).map(d => d.code)).toContain(code);
  });
  test('an entire short tubing string may be one Pup Joint without empty-body renderer failure', () => {
    const w = fixture(); w.components = w.components.filter((c: any) => !['TubingHanger', 'CompletionPacker', 'Crossover', 'Coupling'].includes(c.type));
    const t = tube(w); t.top.value = 2000; t.segments = [t.segments[1]];
    t.hostSpans = [{ hostId: 'C04-PRODUCTION', top: { value: 2000, unit: 'm' }, bottom: { value: 2006, unit: 'm' } }];
    const l = layout(w); expect(l.tubing).toHaveLength(0); expect(l.pupJoints[0].lines.length).toBeGreaterThan(0);
    expect(handleHole(w)).toContain('data-length-m="6"');
  });
});

describe('Joint layout and SVG', () => {
  test('couplings on both pup endpoints leave physical pipe visible between their glyphs', () => {
    const w = fixture(); w.components.push({ ...coupling(w), id: 'CPL-02', fromSegmentId: 'PUP-S01', toSegmentId: 'T01-S01B', at: { value: 2006, unit: 'm' } });
    const l = layout(w), p = l.pupJoints[0];
    expect(l.couplings[0].bottomY).toBeLessThan(l.couplings[1].topY);
    expect(p.lines.filter(line => line.role === 'od')).toHaveLength(2);
    expect(p.lines.filter(line => line.role === 'od').every(line => line.y2 > line.y1)).toBe(true);
    expect(prepareWell(w).completion!.tubing.bottom).toBe(4000);
  });
  test('nearby packer glyphs shrink without shifting MD or covering coupling body', () => {
    const w = fixture(), t = tube(w); t.segments[0].length.value = 2399.99; t.segments[2].length.value = 394.01;
    coupling(w).at.value = 2399.99;
    const l = layout(w), c = l.couplings[0], p = l.packers.find(p => p.id === 'PK-P01')!;
    expect(c.atY).toBeCloseTo(2399.99 * 900 / 5000);
    expect(c.bottomY).toBeLessThanOrEqual(p.blocks[0].y);
    expect(p.physicalTopY).toBe(432);
    expect(p.blocks[0].height).toBeCloseTo(p.physicalBottomY - p.physicalTopY);
  });
  test('coupling shoulders/body never cap lumen; bounds stay inside adjacent segments', () => {
    const w = fixture(), m = prepareWell(w).completion!, l = layout(w), c = l.couplings[0];
    expect(c.atY).toBe(360); expect(c.topY).toBeLessThan(c.atY); expect(c.bottomY).toBeGreaterThan(c.atY);
    expect(c.bottomY).toBeLessThan(2006 * 900 / 5000);
    expect(c.lines.every(p => (p.x1 - 112.5) * (p.x2 - 112.5) > 0)).toBe(true);
    expect(c.detailLines.every(line => Math.max(line.x1, line.x2) + 100 < l.width)).toBe(true);
    expect(c.detailLabels.every(label => label.x + label.text.length * 7 + 100 < l.width)).toBe(true);
    expect(c.detailLines.every(line => (line.x1 - (l.labelX + 520)) * (line.x2 - (l.labelX + 520)) > 0)).toBe(true);
    expect(c.lines.filter(p => p.role === 'od').map(p => Math.abs(p.x1 - 112.5))).toEqual([m.couplings[0].od * 5 / 25.4 / 2, m.couplings[0].od * 5 / 25.4 / 2]);
    const tubeLines = [...l.tubing, ...l.pupJoints.flatMap(p => p.lines)];
    expect(tubeLines.filter(p => p.y1 !== p.y2).every(p => p.y2 <= c.topY || p.y1 >= c.bottomY)).toBe(true);
  });
  test('short Pup Joint main interval stays to scale and detail does not move its MD', () => {
    const l = layout(fixture()), p = l.pupJoints[0];
    expect(p.topY).toBe(360); expect(p.bottomY).toBeCloseTo(361.08);
    expect(p.bottomY - p.topY).toBeCloseTo(6 * 900 / 5000);
    expect(p.detailLabels[0].text).toContain('not MD scale');
    expect(p.detailLines.every(line => line.x1 > l.labelX + 450 && line.x2 < l.width)).toBe(true);
    expect(p.detailLines.every(line => Math.max(line.x1, line.x2) + 100 < l.width)).toBe(true);
    expect(p.detailLabels.every(label => label.x + label.text.length * 7 + 100 < l.width)).toBe(true);
    expect(p.detailLines.filter(line => line.role === 'end-wall').every(line => (line.x1 - (l.labelX + 520)) * (line.x2 - (l.labelX + 520)) > 0)).toBe(true);
    expect(l.tubing.some(line => line.segmentId === 'PUP-S01')).toBe(false);
    const svg = handleHole(fixture());
    const pupGroup = svg.match(/<g data-component-id="PJ-01"[\s\S]*?<\/g>/)![0];
    expect(pupGroup).toContain('data-length-m="6"'); expect(pupGroup).toContain('data-top-md="2000"');
    expect(pupGroup).toContain('data-region="detail"'); expect(pupGroup).not.toContain('stroke-dasharray');
    expect(svg).toContain('data-kind="Coupling"'); expect(svg).not.toContain('NaN');
  });
  test('inputs/reordering remain stable; long special-character labels fit without injection', () => {
    const w = fixture(); coupling(w).label = '<script>&'.repeat(20); pup(w).label = '<script>&'.repeat(20);
    const copy = structuredClone(w), first = layout(w), svg = handleHole(w);
    expect(w).toEqual(copy); w.components.reverse(); expect(layout(w)).toEqual(first);
    expect(svg).toContain('&lt;script&gt;&amp;'); expect(svg).not.toContain('<script>');
    const labels = [...first.couplings.flatMap(c => c.labels), ...first.pupJoints.flatMap(p => [...p.labels, ...p.detailLabels]), ...first.notes];
    expect(labels.every(p => p.x + p.text.length * 7 < first.width && p.y + 110 < first.height)).toBe(true);
  });
});
