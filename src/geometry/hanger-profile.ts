export interface HangerPoint { x: number; y: number }

// Shared display profile, independent of MD and physical equipment dimensions.
export const HANGER_BORE_HEIGHT = 10;
export const HANGER_SLOT_PITCH = HANGER_BORE_HEIGHT + 2;
export const HANGER_BORE_INSET = 1;

/** Stepped hanger band: both vertical bores have equal height; both ramps are 45°. */
export function hangerProfile(outerX: number, innerX: number, top: number): HangerPoint[] {
  const dx = innerX - outerX;
  const hook = dx / 6;
  const rise = Math.abs(dx - 2 * hook);
  return [
    { x: outerX, y: top },
    { x: outerX, y: top + HANGER_BORE_HEIGHT },
    { x: outerX + hook, y: top + HANGER_BORE_HEIGHT },
    { x: innerX - hook, y: top + HANGER_BORE_HEIGHT + rise },
    { x: innerX, y: top + HANGER_BORE_HEIGHT + rise },
    { x: innerX, y: top + rise },
    { x: innerX - hook, y: top + rise },
    { x: outerX + hook, y: top },
  ];
}

/** Tubing hanger has a flat upper face; the accepted lower casing-style ramp stays intact. */
export function tubingHangerProfile(outerX: number, innerX: number, top: number): HangerPoint[] {
  return [...hangerProfile(outerX, innerX, top).slice(0, 5), { x: innerX, y: top }];
}

export function hangerPath(points: HangerPoint[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z';
}
