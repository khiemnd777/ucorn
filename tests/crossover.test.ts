import { describe, expect, test } from 'bun:test';
import sample from '../sample-data/well-completion-crossover.json';
import oldSample from '../sample-data/well-completion-packers.json';
import { prepareWell } from '../src/validation/completion';
import { InputValidationError } from '../src/domain/completion';
import { layoutCompletion } from '../src/geometry/completion-layout';
import { handleHole } from '../src/handlers/hole-handler';

const fixture = (): any => structuredClone(sample);
const crossover = (w: any) => w.components.find((c: any) => c.type === 'Crossover');
const tubing = (w: any) => w.components.find((c: any) => c.type === 'Tubing');
const layout = (w: any) => layoutCompletion(prepareWell(w).completion!, {
  centerX: 112.5, depthToY: n => n * 900 / 5000, diameterToWidth: n => n * 5 / 25.4,
  headMouth: { left: 62.5, right: 162.5, top: -52 },
});
const diagnostics = (w: any) => {
  try { prepareWell(w); } catch (e) {
    expect(e).toBeInstanceOf(InputValidationError);
    return (e as InputValidationError).diagnostics;
  }
  throw new Error('Expected validation failure');
};

describe('Crossover attachments', () => {
  test('explicit endpoints connect the existing tubing joint without changing MD', () => {
    const m = prepareWell(fixture()).completion!;
    const c = m.crossovers[0];
    expect(c.at).toBe(2800);
    expect(c.from.id).toBe(c.fromSegmentId);
    expect(c.to.id).toBe(c.toSegmentId);
    expect(c.from.bottom).toBe(c.to.top);
    expect(c.from.od).toBeCloseTo(114.3);
    expect(c.to.od).toBeCloseTo(88.9);
    expect(m.tubing.bottom).toBe(4000);
    expect(m.diagnostics).toEqual([]);
    expect(prepareWell(oldSample).completion!.crossovers).toEqual([]);
  });
  test('ft anchor is normalized once and equivalent layouts remain identical', () => {
    const w = fixture(), before = layout(w);
    crossover(w).at = { value: 2800 / 0.3048, unit: 'ft' };
    expect(layout(w)).toEqual(before);
  });
  test('missing connection profiles and bore stay visibly unknown', () => {
    const w = fixture(); delete crossover(w).fromConnection;
    delete tubing(w).segments[0].innerDiameter;
    const m = prepareWell(w).completion!, l = layout(w);
    expect(m.diagnostics.map(d => d.code)).toContain('CONNECTION_UNRESOLVED');
    expect(l.crossovers[0].lines.filter(p => p.role === 'id')).toHaveLength(0);
    const svg = handleHole(w);
    expect(svg).toContain('Connections: unknown');
    expect(svg).toContain('ID unknown');
    expect(svg).toContain('compatibility unverified');
  });
  test('same size connections remain explicit, with an open bore', () => {
    const w = fixture(); tubing(w).segments[1].od = tubing(w).segments[0].od;
    tubing(w).segments[1].innerDiameter = tubing(w).segments[0].innerDiameter;
    const c = layout(w).crossovers[0];
    expect(c.lines.filter(p => p.role === 'od').every(p => p.x1 === p.x2)).toBe(true);
    expect(c.lines.filter(p => p.role === 'end-wall').every(p => (p.x1 < 112.5) === (p.x2 < 112.5))).toBe(true);
  });
  const invalid: [string, (w: any) => void, string][] = [
    ['missing version', w => delete w.schemaVersion, 'UNSUPPORTED_VERSION'],
    ['wrong owner', w => crossover(w).tubingId = 'missing', 'DANGLING_REFERENCE'],
    ['missing upper segment', w => crossover(w).fromSegmentId = 'missing', 'DANGLING_REFERENCE'],
    ['missing lower segment', w => crossover(w).toSegmentId = 'missing', 'DANGLING_REFERENCE'],
    ['self link', w => crossover(w).toSegmentId = crossover(w).fromSegmentId, 'INVALID_CROSSOVER_ATTACHMENT'],
    ['reversed link', w => [crossover(w).fromSegmentId, crossover(w).toSegmentId] = [crossover(w).toSegmentId, crossover(w).fromSegmentId], 'INVALID_CROSSOVER_ATTACHMENT'],
    ['wrong MD', w => crossover(w).at.value += 1, 'ANCHOR_MISMATCH'],
    ['negative MD', w => crossover(w).at.value = -1, 'ANCHOR_MISMATCH'],
    ['NaN MD', w => crossover(w).at.value = NaN, 'INVALID_NUMBER'],
    ['infinite MD', w => crossover(w).at.value = Infinity, 'INVALID_NUMBER'],
    ['wrong unit', w => crossover(w).at.unit = 'mm', 'INVALID_UNIT'],
    ['empty profile', w => crossover(w).fromConnection = '', 'INVALID_STRING'],
    ['duplicate ID', w => crossover(w).id = tubing(w).id, 'DUPLICATE_ID'],
    ['duplicate junction', w => w.components.push({ ...crossover(w), id: 'XO-02' }), 'CROSSOVER_OCCUPIED'],
    ['installed on planned tubing', w => crossover(w).lifecycle = 'installed', 'LIFECYCLE_CONFLICT'],
    ['installed without evidence', w => { crossover(w).lifecycle = 'installed'; crossover(w).sources = []; }, 'EVIDENCE_REQUIRED'],
    ['removed active equipment', w => crossover(w).lifecycle = 'removed', 'UNSUPPORTED_LIFECYCLE'],
    ['unsupported interval', w => crossover(w).length = { value: 1, unit: 'm' }, 'UNSUPPORTED_FIELD'],
  ];
  for (const [name, mutate, code] of invalid) test(name, () => {
    const w = fixture(); mutate(w);
    const found = diagnostics(w).find(d => d.code === code);
    expect(found).toBeDefined();
    expect(found!.path.length).toBeGreaterThan(0);
  });
});

describe('Crossover layout and SVG', () => {
  test('solid OD/ID lines meet the trimmed tubing; walls never cap the lumen', () => {
    const l = layout(fixture()), c = l.crossovers[0];
    expect(c.atY).toBe(504);
    expect(c.topY).toBe(500); expect(c.bottomY).toBe(508);
    for (const line of c.lines.filter(p => p.role !== 'end-wall')) {
      expect(l.tubing.some(p => p.x2 === line.x1 && p.y2 === line.y1)).toBe(true);
      expect(l.tubing.some(p => p.x1 === line.x2 && p.y1 === line.y2)).toBe(true);
    }
    expect(l.tubing.some(p => p.y1 === c.atY && p.y2 === c.atY)).toBe(false);
    expect(c.lines.filter(p => p.role === 'end-wall').every(p => (p.x1 - 112.5) * (p.x2 - 112.5) > 0)).toBe(true);
    const svg = handleHole(fixture()), group = svg.match(/<g data-component-id="XO-01"[\s\S]*?<\/g>/)![0];
    expect(group).toContain('data-kind="Crossover"');
    expect(group).toContain('data-at-md="2800"');
    expect(group).not.toContain('stroke-dasharray');
    expect(group).not.toContain('<rect');
    expect(group).toContain('length unknown');
  });
  test('nearby junctions constrain enlargement without moving their MD', () => {
    const w = fixture(); w.components = w.components.filter((c: any) => c.type !== 'CompletionPacker');
    const tube = tubing(w), first = tube.segments[0], second = tube.segments[1];
    first.length.value = 2800;
    second.length.value = 0.001;
    tube.segments.push({ ...second, id: 'TS-03', length: { value: 1199.999, unit: 'm' } });
    w.components.push({ ...crossover(w), id: 'XO-02', fromSegmentId: second.id, toSegmentId: 'TS-03', at: { value: 2800.001, unit: 'm' } });
    const l = layout(w), m = prepareWell(w).completion!;
    expect(l.crossovers[0].bottomY).toBeLessThanOrEqual(l.crossovers[1].topY + 1e-9);
    expect(l.crossovers.map(c => c.atY)).toEqual(m.crossovers.map(c => c.at * 900 / 5000));
    expect(m.tubing.bottom).toBeCloseTo(4000);
    const bad = structuredClone(w); crossover(bad).toSegmentId = 'TS-03';
    expect(diagnostics(bad).map(d => d.code)).toContain('INVALID_CROSSOVER_ATTACHMENT');
  });
  test('component reordering and escaped long labels preserve input and bounds', () => {
    const w = fixture(); crossover(w).label = '<script>&'.repeat(20);
    const original = structuredClone(w), first = layout(w), svg = handleHole(w);
    expect(w).toEqual(original);
    w.components.reverse(); expect(layout(w)).toEqual(first);
    expect(svg).toContain('&lt;script&gt;&amp;'); expect(svg).not.toContain('<script>');
    expect([...first.crossovers.flatMap(c => c.labels), ...first.notes].every(p => p.x + p.text.length * 7 < first.width && p.y + 110 < first.height)).toBe(true);
  });
});
