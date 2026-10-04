import { expect, test } from 'bun:test';
import { handleHole } from '../src/handlers/hole-handler';
import sample from '../sample-data/well-5-holes-liner-hangers.json';

type Point = { x: number; y: number };

function cementPolygons(payload: typeof sample): Point[][] {
  const svg = handleHole(payload);
  expect(svg).not.toMatch(/NaN|Infinity/);
  return [...svg.matchAll(/<path\b[^>]*\bd="([^"]+)"[^>]*\bfill="url\(#cementPattern\)"/g)]
    .map(match => [...match[1].matchAll(/[ML]\s+(-?[\d.]+)\s+(-?[\d.]+)/g)]
      .map(point => ({ x: Number(point[1]), y: Number(point[2]) })));
}

// Cross-section through a closed polygon, away from interval boundaries.
function section(points: Point[], depth: number) {
  const y = depth * 900 / 5000;
  const crossings: number[] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    if ((a.y <= y && b.y > y) || (b.y <= y && a.y > y)) {
      crossings.push(a.x + (y - a.y) * (b.x - a.x) / (b.y - a.y));
    }
  }
  expect(crossings.length).toBe(2);
  return [Math.min(...crossings), Math.max(...crossings)];
}

test('demo cement fills five annuli to their string bottoms, including liner overlap', () => {
  const before = JSON.stringify(sample);
  const polygons = cementPolygons(sample);
  const cements = sample.components.filter(c => c.type === 'Cement');
  expect(cements.map(c => [c.refCasingID, c.startDepth])).toEqual([
    ['C01-CONDUCTOR', 0], ['C02-SURFACE', 0], ['C03-INTERMEDIATE', 0],
    ['C04-PRODUCTION', 0], ['L01-PRODUCTION', 2800],
  ]);
  expect(polygons.length).toBe(10);

  // Fixture dimensions in inches; hole walls have a 1.5 px wave.
  const intervals = [
    { inner: 30, top: 0, bottom: 100, sections: [[50, 36, true]] },
    { inner: 20, top: 0, bottom: 600, sections: [[50, 30, false], [350, 26, true]] },
    { inner: 13.375, top: 0, bottom: 1800, sections: [[350, 20, false], [1200, 17.5, true]] },
    { inner: 9.625, top: 0, bottom: 3000, sections: [[1200, 13.375, false], [2400, 12.25, true]] },
    { inner: 7, top: 2800, bottom: 4200, sections: [[2900, 9.625, false], [3600, 8.5, true]] },
  ];
  intervals.forEach((interval, index) => {
    const left = polygons[index * 2], right = polygons[index * 2 + 1];
    for (const points of [left, right]) {
      expect(Math.min(...points.map(p => p.y))).toBeCloseTo(interval.top * 900 / 5000, 10);
      expect(Math.max(...points.map(p => p.y))).toBeCloseTo(interval.bottom * 900 / 5000, 10);
    }
    // No cement vertex enters the referenced string's lumen.
    const wall = 112.5 - interval.inner * 5 / 2;
    expect(Math.max(...left.map(p => p.x))).toBeCloseTo(wall, 10);
    expect(Math.min(...right.map(p => p.x))).toBeCloseTo(225 - wall, 10);
    expect(right).toEqual(left.map(p => ({ x: 225 - p.x, y: p.y })));

    for (const [depth, diameter, wavy] of interval.sections) {
      const outer = 112.5 - Number(diameter) * 5 / 2;
      const [outerEdge, innerEdge] = section(left, Number(depth));
      expect(innerEdge).toBeCloseTo(wall, 10);
      expect(Math.abs(outerEdge - outer)).toBeLessThanOrEqual(wavy ? 1.500001 : 0.000001);
      const [rightInner, rightOuter] = section(right, Number(depth));
      expect(rightInner).toBeCloseTo(225 - innerEdge, 10);
      expect(rightOuter).toBeCloseTo(225 - outerEdge, 10);
    }
  });
  expect(JSON.stringify(sample)).toBe(before);
});

test('editing TOC clips cement above the declared top without changing the bottom', () => {
  const payload = structuredClone(sample);
  const tops: Record<string, number> = { 'C02-SURFACE': 500, 'L01-PRODUCTION': 3100 };
  payload.components = payload.components.filter(c => c.type !== 'Cement' || c.refCasingID! in tops);
  for (const component of payload.components) {
    if (component.type === 'Cement') component.startDepth = tops[component.refCasingID!];
  }
  const polygons = cementPolygons(payload);
  expect(polygons.length).toBe(4);
  [[500, 600], [3100, 4200]].forEach(([top, bottom], index) => {
    for (const points of polygons.slice(index * 2, index * 2 + 2)) {
      expect(Math.min(...points.map(p => p.y))).toBeCloseTo(top * 900 / 5000, 10);
      expect(Math.max(...points.map(p => p.y))).toBeCloseTo(bottom * 900 / 5000, 10);
    }
  });
  expect(Math.abs(section(polygons[2], 3600)[0] - (112.5 - 8.5 * 5 / 2))).toBeLessThanOrEqual(1.500001);
});

test('cement geometry does not depend on casing array order', () => {
  const payload = structuredClone(sample);
  const casings = payload.components.filter(c => c.type === 'Casing').reverse();
  payload.components = [...casings, ...payload.components.filter(c => c.type !== 'Casing')];
  expect(cementPolygons(payload)).toEqual(cementPolygons(sample));
});
