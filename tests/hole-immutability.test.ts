import { expect, test } from 'bun:test';
import { handleHole } from '../src/handlers/hole-handler';

test('legacy underream rendering does not sort the caller array in place', () => {
  const well = { holes: [{ diameter: 12.25, depth: 1000, underreamed: [
    { diameter: 15, startDepth: 700, endDepth: 800 },
    { diameter: 14, startDepth: 300, endDepth: 400 },
  ] }] };
  const before = structuredClone(well);
  expect(handleHole(well)).toContain('<svg');
  expect(well).toEqual(before);
});
