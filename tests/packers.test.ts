import { describe, expect, test } from 'bun:test';
import sample from '../sample-data/well-completion-packers.json';
import { prepareWell } from '../src/validation/completion';
import { InputValidationError } from '../src/domain/completion';
import { layoutCompletion } from '../src/geometry/completion-layout';
import { handleHole } from '../src/handlers/hole-handler';

const fixture = (): any => structuredClone(sample);
const packers = (w: any) => w.components.filter((c: any) => c.type === 'CompletionPacker');
const tube = (w: any) => w.components.find((c: any) => c.type === 'Tubing');
const casing = (w: any, id: string) => w.components.find((c: any) => c.casingID === id);
const layout = (w: any) => layoutCompletion(prepareWell(w).completion!, { centerX: 112.5, depthToY: n => n * 0.18, diameterToWidth: n => n * 5 / 25.4, headMouth: { left: 62.5, right: 162.5, top: -52 } });
const diagnostics = (w: any) => {
  try { prepareWell(w); } catch (e) { expect(e).toBeInstanceOf(InputValidationError); return (e as InputValidationError).diagnostics; }
  throw new Error('Expected invalid packer');
};

describe('Completion packers contracts', () => {
  test('four roles retain explicit annular endpoints and set states', () => {
    const m = prepareWell(fixture()).completion!;
    expect(m.packers.map(p => p.role)).toEqual(['production', 'liner-top', 'isolation', 'test']);
    expect(m.packers.map(p => p.setState)).toEqual(['set', 'set', 'unknown', 'unset']);
    expect(m.packers[1].innerConduitId).toBe('L01-PRODUCTION');
    expect(m.packers[1].innerOD).toBeCloseTo(177.8);
    expect(m.packers[1].outerDiameter).toBeCloseTo(231.775);
    expect(m.packers.every(p => p.fit === 'clearance-checked')).toBe(true);
    expect(m.packers[1].retrievable).toBeUndefined();
  });
  test('unknown host ID produces unresolved outline geometry without inventing wall thickness', () => {
    const w = fixture(); delete casing(w, 'C04-PRODUCTION').segments[0].boreDiameter;
    const m = prepareWell(w).completion!;
    expect(m.diagnostics.filter(d => d.code === 'PACKER_FIT_UNRESOLVED')).toHaveLength(2);
    expect(m.packers[0].fit).toBe('unresolved');
    expect(m.packers[0].outerDiameter).toBeCloseTo(9.625 * 25.4);
    const svg = handleHole(w), group = svg.slice(svg.indexOf('<g data-component-id="PK-P01"'), svg.indexOf('<g data-component-id="PK-L01"'));
    expect(group).toContain('fill="none"'); expect(group).toContain('unresolved');
    expect(group).not.toContain('stroke-dasharray');
    expect((group.match(/<line /g) ?? []).length).toBe(1); // Only the label leader; no seal crosses.
  });
  test('equivalent quantity units preserve intervals and annular widths', () => {
    const w = fixture(), before = layout(w);
    for (const p of packers(w)) for (const key of ['top', 'bottom']) p[key] = { value: p[key].value / 0.3048, unit: 'ft' };
    for (const c of w.components.filter((c: any) => c.type === 'Casing')) for (const s of c.segments) s.boreDiameter = { value: s.boreDiameter.value * 25.4, unit: 'mm' };
    const after = layout(w);
    for (const [i, p] of before.packers.entries()) {
      expect(after.packers[i].physicalTopY).toBeCloseTo(p.physicalTopY, 8);
      expect(after.packers[i].blocks[0].width).toBeCloseTo(p.blocks[0].width, 8);
    }
  });
  test('terminal at tubing bottom and adjacent intervals are accepted', () => {
    const w = fixture(), p = packers(w)[3]; p.top.value = 3960; p.bottom.value = 4000;
    const adjacent = { ...structuredClone(p), id: 'PK-T02', top: { value: 3940, unit: 'm' }, bottom: { value: 3960, unit: 'm' } };
    w.components.push(adjacent);
    expect(prepareWell(w).completion!.packers).toHaveLength(5);
  });
  test('exact tubing joint uses the next segment and the declared next host', () => {
    const w = fixture(), p = packers(w)[2]; p.top.value = 2800; p.bottom.value = 2820;
    expect(prepareWell(w).completion!.packers.find(p => p.role === 'isolation')!.innerOD).toBeCloseTo(3.5 * 25.4);
  });
  test('installed does not imply set, and retrievability is only declared', () => {
    const w = fixture(); tube(w).lifecycle = 'installed';
    packers(w)[3].lifecycle = 'installed'; packers(w)[3].setState = 'unknown';
    expect(prepareWell(w).completion!.packers[3].setState).toBe('unknown');
    expect(prepareWell(w).completion!.packers[3].retrievable).toBe(true);
  });
  const invalid: [string, (w: any) => void, string][] = [
    ['missing version', w => delete w.schemaVersion, 'UNSUPPORTED_VERSION'],
    ['dangling inner', w => packers(w)[0].innerConduitId = 'MISSING', 'DANGLING_REFERENCE'],
    ['dangling outer', w => packers(w)[0].outerHostId = 'MISSING', 'DANGLING_REFERENCE'],
    ['wrong tubing host', w => packers(w)[0].outerHostId = 'C03-INTERMEDIATE', 'INVALID_PACKER_ATTACHMENT'],
    ['openhole not inferred', w => packers(w)[0].outerHostId = 'H04', 'UNSUPPORTED_CONFIGURATION'],
    ['liner top cannot seal tubing', w => packers(w)[1].innerConduitId = 'T01', 'DANGLING_REFERENCE'],
    ['liner top must anchor at top', w => packers(w)[1].top.value += 1, 'ANCHOR_MISMATCH'],
    ['liner must be a liner', w => packers(w)[1].innerConduitId = 'C04-PRODUCTION', 'INVALID_PACKER_ATTACHMENT'],
    ['parent cannot be same liner', w => packers(w)[1].outerHostId = 'L01-PRODUCTION', 'INVALID_PACKER_ATTACHMENT'],
    ['beyond parent shoe', w => packers(w)[1].bottom.value = 3001, 'HOST_INTERVAL'],
    ['zero interval', w => packers(w)[0].bottom.value = 2400, 'INVALID_INTERVAL'],
    ['negative top', w => packers(w)[0].top.value = -1, 'INVALID_INTERVAL'],
    ['nan depth', w => packers(w)[0].top.value = NaN, 'INVALID_NUMBER'],
    ['invalid unit', w => packers(w)[0].top.unit = 'km', 'INVALID_UNIT'],
    ['unknown role', w => packers(w)[0].role = 'inflatable', 'INVALID_PACKER_ROLE'],
    ['missing set state', w => delete packers(w)[0].setState, 'INVALID_SET_STATE'],
    ['unsupported method', w => packers(w)[0].settingMethod = 'hydraulic', 'UNSUPPORTED_FIELD'],
    ['invalid retrievability', w => packers(w)[0].retrievable = 'yes', 'INVALID_BOOLEAN'],
    ['duplicate ID', w => packers(w)[0].id = 'T01', 'DUPLICATE_ID'],
    ['overlap', w => { const p = structuredClone(packers(w)[0]); p.id = 'PK-DUP'; w.components.push(p); }, 'PACKER_OVERLAP'],
    ['taper crossing', w => { const p = packers(w)[0]; p.top.value = 2790; p.bottom.value = 2810; }, 'UNSUPPORTED_GEOMETRY'],
    ['inner lifecycle conflict', w => packers(w)[0].lifecycle = 'installed', 'LIFECYCLE_CONFLICT'],
    ['installed needs sources', w => { packers(w)[0].lifecycle = 'installed'; packers(w)[0].sources = []; }, 'EVIDENCE_REQUIRED'],
    ['mixed legacy format', w => w.components.push({ type: 'Packer', refCasingID: 'L01-PRODUCTION', startDepth: 2800 }), 'AMBIGUOUS_PACKER_FORMAT'],
    ['liner clearance conflict', w => casing(w, 'C04-PRODUCTION').segments[0].boreDiameter.value = 6.9, 'IMPOSSIBLE_FIT'],
  ];
  for (const [name, mutate, code] of invalid) test(name, () => {
    const w = fixture(); mutate(w);
    const ds = diagnostics(w);
    expect(ds.some(d => d.code === code)).toBe(true);
    expect(ds.every(d => d.path && d.message)).toBe(true);
  });
});

describe('Packer layout/SVG', () => {
  test('blocks occupy annuli only, remain symmetric and keep MD anchors', () => {
    const l = layout(fixture());
    expect(l.packers).toHaveLength(4);
    for (const p of l.packers) {
      const [a, b] = p.blocks;
      expect(a.width).toBeGreaterThan(0); expect(a.x + a.width).toBeLessThan(112.5);
      expect(b.x).toBeGreaterThan(112.5); expect(b.width).toBeCloseTo(a.width);
      expect(a.x + b.x + b.width).toBeCloseTo(225);
      expect(a.y + a.height / 2).toBeCloseTo((p.physicalTopY + p.physicalBottomY) / 2);
      expect(p.labels.some(v => v.text.includes('m MD @ DEMO-RKB'))).toBe(true);
    }
    // Liner-top blocks start outside 7 in liner, not the 3.5 in tubing.
    expect(l.packers[1].blocks[0].x + l.packers[1].blocks[0].width).toBeCloseTo(95);
  });
  test('min glyph height enlarges display only, preserving short physical interval', () => {
    const w = fixture(); packers(w)[0].bottom.value = 2400.1;
    const p = layout(w).packers[0];
    expect(p.blocks[0].height).toBe(8);
    expect(p.physicalBottomY - p.physicalTopY).toBeCloseTo(0.018);
    expect(prepareWell(w).completion!.packers[0].bottom).toBe(2400.1);
  });
  test('adjacent small packers remain separate without shifting their MD intervals', () => {
    const w = fixture(), p = packers(w)[0]; p.bottom.value = 2400.1;
    w.components.push({ ...structuredClone(p), id: 'PK-NEXT', top: { value: 2400.1, unit: 'm' }, bottom: { value: 2400.2, unit: 'm' } });
    const [first, next] = layout(w).packers;
    expect(first.blocks[0].y + first.blocks[0].height).toBeCloseTo(next.blocks[0].y, 8);
    expect(first.blocks[0].height).toBeCloseTo(0.018);
    expect(next.blocks[0].height).toBeCloseTo(0.018);
    expect(first.physicalTopY).toBeCloseTo(432);
  });
  test('set crossed blocks and unset/unknown outlines retain role and endpoint metadata', () => {
    const svg = handleHole(fixture());
    expect((svg.match(/data-kind="CompletionPacker"/g) ?? []).length).toBe(4);
    for (const role of ['production', 'liner-top', 'isolation', 'test']) expect(svg).toContain(`data-role="${role}"`);
    expect(svg).toContain('data-inner-conduit-id="L01-PRODUCTION"');
    expect(svg).toContain('data-set-state="unknown"'); expect(svg).toContain('data-set-state="unset"');
    expect(svg).not.toMatch(/NaN|Infinity/);
    expect(svg.slice(svg.indexOf('<g data-component-id="T01"'))).not.toContain('stroke-dasharray');
  });
  test('immutable and stable after component reorder, with escaped long labels in canvas', () => {
    const w = fixture(); packers(w)[0].label = '<script>&'.repeat(20);
    const before = structuredClone(w), first = layout(w), svg = handleHole(w);
    expect(w).toEqual(before); expect(svg).not.toContain('<script>'); expect(svg).toContain('&lt;script&gt;');
    w.components.reverse(); expect(layout(w)).toEqual(first);
    expect([...first.packers.flatMap(p => p.labels), ...first.notes].every(p => p.x + p.text.length * 7 < first.width && p.y + 110 < first.height)).toBe(true);
  });
});
