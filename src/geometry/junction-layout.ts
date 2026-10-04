import type { LinePrimitive } from './completion-layout';

export interface JunctionWindow { atY: number; topY: number; bottomY: number }

export function layoutJunctionWindow(junction: { at: number; from: { top: number }; to: { bottom: number } }, depthToY: (md: number) => number, obstacles: { topY: number; bottomY: number }[] = []): JunctionWindow {
  const atY = depthToY(junction.at);
  // Leave visible pipe between two point tools at the ends of a short segment.
  let halfHeight = Math.min(4, (atY - depthToY(junction.from.top)) / 4, (depthToY(junction.to.bottom) - atY) / 4);
  for (const obstacle of obstacles) {
    if (obstacle.bottomY <= atY) halfHeight = Math.min(halfHeight, atY - obstacle.bottomY);
    if (obstacle.topY >= atY) halfHeight = Math.min(halfHeight, obstacle.topY - atY);
  }
  return { atY, topY: atY - halfHeight, bottomY: atY + halfHeight };
}

/** Clip pipe walls/ordinary steps where an explicit connector owns the display. */
export function trimTubingAtJunctions(lines: LinePrimitive[], junctions: JunctionWindow[]): LinePrimitive[] {
  return lines.flatMap(line => {
    if (line.y1 === line.y2) return junctions.some(j => j.atY === line.y1) ? [] : [line];
    let pieces = [line];
    for (const junction of junctions) {
      pieces = pieces.flatMap(piece => {
        if (piece.y2 <= junction.topY || piece.y1 >= junction.bottomY) return [piece];
        return [
          ...(piece.y1 < junction.topY ? [{ ...piece, y2: junction.topY }] : []),
          ...(piece.y2 > junction.bottomY ? [{ ...piece, y1: junction.bottomY }] : []),
        ];
      });
    }
    return pieces;
  });
}
