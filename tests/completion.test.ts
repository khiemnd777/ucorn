import { describe, expect, test } from 'bun:test';
import sample from '../sample-data/well-tubing-hanger.json';
import { prepareWell } from '../src/validation/completion';
import { InputValidationError } from '../src/domain/completion';
import { layoutCompletion } from '../src/geometry/completion-layout';
import { handleHole } from '../src/handlers/hole-handler';
import { hangerProfile } from '../src/geometry/hanger-profile';

const fixture = (): any => structuredClone(sample);
const tubing = (w: any) => w.components.find((c: any) => c.type === 'Tubing');
const hanger = (w: any) => w.components.find((c: any) => c.type === 'TubingHanger');
const head = (w: any) => w.components.find((c: any) => c.type === 'Wellhead');
const error = (w: any) => {
  try { prepareWell(w); } catch (e) { expect(e).toBeInstanceOf(InputValidationError); return (e as InputValidationError).diagnostics; }
  throw new Error('Expected validation failure');
};
const layout = (w: any) => layoutCompletion(prepareWell(w).completion!, { centerX: 112.5, depthToY: n => n * 900 / 5000, diameterToWidth: n => n * 5 / 25.4, headMouth: { left: 62.5, right: 162.5, top: -52 } });

describe('Completion physical contracts', () => {
  test('production taper and named hanger remain independent of casing kinds', () => {
    const w = fixture(), m = prepareWell(w).completion!;
    expect(m.tubing.top).toBe(0); expect(m.tubing.bottom).toBe(4000);
    expect(m.tubing.segments.map(s => [s.top, s.bottom])).toEqual([[0, 2800], [2800, 4000]]);
    expect(m.tubing.segments[0].od).toBeCloseTo(114.3); expect(m.tubing.segments[1].od).toBeCloseTo(88.9);
    expect(m.hanger?.seatId).toBe('SEAT-T01'); expect(m.hanger?.at).toBe(0);
    expect(m.diagnostics).toEqual([]);
  });
  test('injection purpose survives rendering without synthesizing flow', () => {
    const w = fixture(); tubing(w).purpose = 'injection';
    expect(handleHole(w)).toContain('injection | planned');
    expect(handleHole(w)).not.toContain('flow-arrow');
  });
  test('uniform tubing has continuous OD/ID walls with an open terminal', () => {
    const w = fixture(); tubing(w).segments = [{ ...tubing(w).segments[0], length: { value: 4000, unit: 'm' } }];
    const l = layout(w);
    expect(l.tubing).toHaveLength(4);
    expect(l.tubing.every(p => p.x1 === p.x2 && p.y1 === 0 && p.y2 === 720)).toBe(true);
  });
  test('a terminal may land exactly at host bottom but not beyond it', () => {
    const w = fixture(); tubing(w).segments[1].length.value = 1400; tubing(w).hostSpans[1].bottom.value = 4200;
    expect(prepareWell(w).completion!.tubing.bottom).toBe(4200);
    tubing(w).hostSpans[1].bottom.value += 0.01; tubing(w).segments[1].length.value += 0.01;
    expect(error(w).map(d => d.code)).toContain('HOST_INTERVAL');
  });
  test('equivalent mixed units preserve physical model and layout', () => {
    const w = fixture(), before = layout(w);
    w.unit = { depth: 'ft', diameter: 'mm' };
    for (const h of w.holes) { h.depth /= 0.3048; h.diameter *= 25.4; }
    for (const c of w.components) {
      if (c.startDepth !== undefined) c.startDepth /= 0.3048;
      if (c.type === 'Casing') for (const s of c.segments) { s.length /= 0.3048; s.diameter *= 25.4; }
    }
    for (const s of tubing(w).segments) { s.length = { value: s.length.value / 0.3048, unit: 'ft' }; s.od = { value: s.od.value * 25.4, unit: 'mm' }; }
    const after = layout(w);
    for (const [i, line] of before.tubing.entries()) {
      expect(after.tubing[i].x1).toBeCloseTo(line.x1, 8); expect(after.tubing[i].y2).toBeCloseTo(line.y2, 8);
    }
  });
  test('support and fit are explicitly unknown when omitted', () => {
    const w = fixture(); w.components = w.components.filter((c: any) => c.type !== 'TubingHanger');
    for (const c of w.components) if (c.type === 'Casing') for (const s of c.segments) delete s.boreDiameter;
    const m = prepareWell(w).completion!;
    expect(m.diagnostics.map(d => d.code)).toContain('FIT_UNRESOLVED');
    expect(m.diagnostics.map(d => d.code)).toContain('SUPPORT_UNKNOWN');
    expect(handleHole(w)).toContain('Support: unknown');
  });
  test('missing tubing ID does not invent a wall', () => {
    const w = fixture(); for (const s of tubing(w).segments) delete s.innerDiameter;
    expect(layout(w).tubing.every(line => line.role === 'od')).toBe(true);
    expect(handleHole(w)).toContain('ID unknown');
  });
  const invalid: [string, (w: any) => void, string][] = [
    ['missing version', w => delete w.schemaVersion, 'UNSUPPORTED_VERSION'],
    ['unsupported version', w => w.schemaVersion = 3, 'UNSUPPORTED_VERSION'],
    ['missing datum', w => delete w.depthContext.datumId, 'INVALID_STRING'],
    ['TVD unsupported', w => w.depthContext.basis = 'TVD', 'UNSUPPORTED_BASIS'],
    ['duplicate component ID', w => hanger(w).id = tubing(w).id, 'DUPLICATE_ID'],
    ['duplicate seat ID', w => head(w).seats.push(head(w).seats[0]), 'DUPLICATE_ID'],
    ['empty segments', w => tubing(w).segments = [], 'INVALID_ARRAY'],
    ['nonfinite OD', w => tubing(w).segments[0].od.value = Infinity, 'INVALID_NUMBER'],
    ['negative length', w => tubing(w).segments[0].length.value = -1, 'INVALID_NUMBER'],
    ['ID larger than OD', w => tubing(w).segments[0].innerDiameter.value = 10, 'INVALID_DIAMETER'],
    ['invalid unit', w => tubing(w).segments[0].od.unit = 'cm', 'INVALID_UNIT'],
    ['missing host', w => tubing(w).hostSpans[0].hostId = 'missing', 'DANGLING_REFERENCE'],
    ['gap between hosts', w => tubing(w).hostSpans[1].top.value = 2900, 'HOST_COVERAGE'],
    ['overlapping hosts', w => tubing(w).hostSpans[1].top.value = 2700, 'HOST_COVERAGE'],
    ['outside liner range', w => tubing(w).hostSpans[1].top.value = 2700, 'HOST_INTERVAL'],
    ['impossible host fit', w => tubing(w).segments[0].od.value = 9.2, 'IMPOSSIBLE_FIT'],
    ['missing tubing on hanger', w => hanger(w).tubingId = 'missing', 'DANGLING_REFERENCE'],
    ['missing head', w => hanger(w).headId = 'missing', 'DANGLING_REFERENCE'],
    ['missing seat', w => hanger(w).seatId = 'missing', 'DANGLING_REFERENCE'],
    ['seat occupied twice', w => w.components.push({ ...hanger(w), id: 'TH02' }), 'SEAT_OCCUPIED'],
    ['seat anchor differs', w => head(w).seats[0].at.value = 2, 'ANCHOR_MISMATCH'],
    ['dual tubing unsupported', w => w.components.push({ ...tubing(w), id: 'T02' }), 'UNSUPPORTED_CONFIGURATION'],
    ['invented installed evidence', w => { tubing(w).lifecycle = 'installed'; tubing(w).sources = []; }, 'EVIDENCE_REQUIRED'],
    ['incompatible lifecycle', w => hanger(w).lifecycle = 'installed', 'LIFECYCLE_CONFLICT'],
    ['removed equipment unsupported', w => tubing(w).lifecycle = 'removed', 'UNSUPPORTED_LIFECYCLE'],
    ['ports not silently ignored', w => hanger(w).ports = [], 'UNSUPPORTED_FIELD'],
    ['null segment', w => tubing(w).segments[0] = null, 'INVALID_OBJECT'],
    ['unknown kind', w => w.components.push({ type: 'ICV' }), 'UNSUPPORTED_KIND'],
    ['hole bottoms unordered', w => w.holes.reverse(), 'INVALID_INTERVAL'],
    ['missing wellbore', w => delete w.wellboreId, 'INVALID_STRING'],
    ['trajectory not silently ignored', w => w.trajectory = {}, 'UNSUPPORTED_FIELD'],
    ['normalization overflow', w => w.holes[0].diameter = 1e308, 'INVALID_NUMBER'],
    ['bounded arrays', w => tubing(w).segments = Array(129).fill(tubing(w).segments[0]), 'RESOURCE_LIMIT'],
  ];
  for (const [name, mutate, code] of invalid) test(name, () => {
    const w = fixture(); mutate(w);
    const diagnostics = error(w);
    expect(diagnostics.map(d => d.code)).toContain(code);
    expect(diagnostics.every(d => d.path && d.message && d.severity)).toBe(true);
  });
});

describe('Completion geometry and export', () => {
  test('taper joint stays at 2800 m; open lumen and no shoe', () => {
    const l = layout(fixture());
    const steps = l.tubing.filter(p => p.x1 !== p.x2);
    expect(steps).toHaveLength(4); expect(steps.every(p => p.y1 === 504 && p.y2 === 504)).toBe(true);
    const bottomLines = l.tubing.filter(p => p.y2 === 720);
    expect(bottomLines).toHaveLength(4); expect(bottomLines.every(p => p.x1 === p.x2)).toBe(true);
    expect(Math.max(...l.hanger[0].points.map(p => p.x))).toBe(101.25);
    expect(Math.min(...l.hanger[1].points.map(p => p.x))).toBe(123.75);
    expect(l.hanger.every(p => Math.min(...p.points.map(v => v.y)) === -52)).toBe(true);
  });
  test('hanger stacks at the mouth with a flat upper face and 45 degree lower ramps', () => {
    const l = layout(fixture());
    const [left, right] = l.hanger;
    expect(left.points).toHaveLength(6);
    expect(left.points[0]).toEqual({ x: 63.5, y: -52 });
    expect(right.points[0]).toEqual({ x: 161.5, y: -52 });
    for (const [i, p] of left.points.entries()) {
      expect(right.points[i].x).toBeCloseTo(225 - p.x, 10);
      expect(right.points[i].y).toBeCloseTo(p.y, 10);
    }
    expect(left.points[3].x).toBeGreaterThan(left.points[0].x);
    expect(right.points[3].x).toBeLessThan(right.points[0].x);
    // Lower face keeps the accepted incline; upper face spans the full width horizontally.
    for (const { points: p } of [left, right]) {
      expect(p[1].y - p[0].y).toBe(10);
      expect(p[5].y).toBe(p[0].y);
      expect(p[5].x).toBe(p[4].x);
      expect(p[3].y - p[2].y).toBeCloseTo(Math.abs(p[3].x - p[2].x), 10);
      expect(p[4].y).toBeGreaterThan(-40);
    }
    expect(l.tubingRiser).toHaveLength(4);
    expect(l.tubingRiser.every(p => p.x1 === p.x2 && p.y1 === -52 && p.y2 === 0)).toBe(true);
    expect(l.tubingRiser.every(p => p.x1 >= 101.25 && p.x1 <= 123.75)).toBe(true);
    expect(prepareWell(fixture()).completion!.tubing.bottom).toBe(4000);
  });
  test('the referenced mouth drives the glyph, including non-default interface position', () => {
    const model = prepareWell(fixture()).completion!;
    const l = layoutCompletion(model, { centerX: 200, depthToY: n => n / 5, diameterToWidth: n => n / 25.4 * 5, headMouth: { left: 140, right: 260, top: -70 } });
    expect(l.hanger.map(p => p.points[0])).toEqual([{ x: 141, y: -70 }, { x: 259, y: -70 }]);
    expect(l.tubingRiser.every(p => p.y1 === -70 && p.y2 === 0)).toBe(true);
  });
  test('SVG hangers stack with matching outer bores and lower ramps, tubing alone has a flat top', () => {
    const svg = handleHole(fixture());
    const casingPaths = [...svg.matchAll(/<path data-kind="CasingHanger"[^>]*d="([^"]+)"/g)].map(m => m[1]);
    const tubingGroup = svg.slice(svg.indexOf('<g data-component-id="TH01"'));
    const tubingPaths = [...tubingGroup.matchAll(/<path d="([^"]+)"/g)].map(m => m[1]);
    expect(casingPaths).toHaveLength(4);
    expect(tubingPaths).toHaveLength(2);
    const points = (path: string) => [...path.split(' Z')[0].matchAll(/[ML]([\d.-]+),([\d.-]+)/g)].map(m => ({ x: Number(m[1]), y: Number(m[2]) }));
    for (const path of casingPaths) {
      const p = points(path);
      expect(p).toHaveLength(8);
      expect(p[1].y - p[0].y).toBe(10);
      expect(p[4].y - p[5].y).toBe(10);
      expect(p[3].y - p[2].y).toBeCloseTo(Math.abs(p[3].x - p[2].x), 10);
      expect(p[6].y - p[7].y).toBeCloseTo(Math.abs(p[6].x - p[7].x), 10);
    }
    for (const path of tubingPaths) {
      const p = points(path);
      expect(p).toHaveLength(6);
      expect(p[1].y - p[0].y).toBe(10);
      expect(p[5].y).toBe(p[0].y);
      expect(p[5].x).toBe(p[4].x);
      expect(p[3].y - p[2].y).toBeCloseTo(Math.abs(p[3].x - p[2].x), 10);
      // Bottom geometry is exactly the previously accepted shared profile.
      expect(p.slice(0, 5)).toEqual(hangerProfile(p[0].x, p[4].x, p[0].y).slice(0, 5));
    }
    const top = points(tubingPaths[0])[0];
    const next = points(casingPaths[0])[0];
    expect(next.x).toBe(top.x);
    expect(next.y - top.y).toBe(12);
    expect(svg.indexOf('data-kind="TubingHanger"')).toBeGreaterThan(svg.lastIndexOf('data-kind="CasingHanger"'));
  });
  test('45 degree profiles retain bore height for narrow and wide spans on both sides', () => {
    for (const width of [0.5, 4, 80, 200]) for (const direction of [-1, 1]) {
      const p = hangerProfile(100, 100 + direction * width, -52);
      expect(p[1].y - p[0].y).toBe(10);
      expect(p[4].y - p[5].y).toBe(10);
      expect(p[3].y - p[2].y).toBeCloseTo(Math.abs(p[3].x - p[2].x), 10);
      expect(p[6].y - p[7].y).toBeCloseTo(Math.abs(p[6].x - p[7].x), 10);
    }
  });
  test('reorder components and host spans without changing the new layout', () => {
    const w = fixture(), before = layout(w);
    w.components.reverse(); tubing(w).hostSpans.reverse();
    expect(layout(w)).toEqual(before);
  });
  test('rendering is immutable and completion primitives are deterministic', () => {
    const w = fixture(), before = structuredClone(w);
    const first = handleHole(w), second = handleHole(w);
    expect(w).toEqual(before);
    const block = (s: string) => s.slice(s.indexOf('<g data-component-id="T01"'));
    expect(block(first)).toBe(block(second));
    expect(first).not.toMatch(/NaN|Infinity/);
    expect(first).toContain('viewBox="0 0 950 1000"');
  });
  test('long special-character labels are escaped and stay inside the SVG', () => {
    const w = fixture(); tubing(w).label = '<script>&"'.repeat(20);
    const svg = handleHole(w);
    expect(svg).not.toContain('<script>'); expect(svg).toContain('&lt;script&gt;');
    const l = layout(w);
    expect([...l.tubingLabels, ...l.hangerLabels, ...l.notes].every(p => p.x + p.text.length * 7 < 850 && p.y + 100 < l.height)).toBe(true);
  });
});
