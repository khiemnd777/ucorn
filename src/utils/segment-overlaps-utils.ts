import { Hole, getHoleSegmentPoints } from './../components/hole';
import { Casing, getCasingSegmentPoints } from './../components/casing';
import { clipAndIntersectPoints } from './common-utils';

export interface Segment {
  type: 'casing' | 'hole';
  points: Point[];
  actualPoint?: Point[];
}

export const mapCasingsToSegments =
  ({ casings, centerX }: { casings: Casing[]; centerX: number }) =>
  ({ depthScale }: D3Props) => {
    const result: Segment[] = [];
    casings.forEach((casing) => {
      result.push({
        type: 'casing',
        points: getCasingSegmentPoints({ casing, centerX })({ depthScale }),
      });
    });
    return result;
  };

export const mapHolesToSegments =
  ({ holes, centerX }: { holes: Hole[]; centerX: number }) =>
  ({ depthScale, d3 }: D3Props) => {
    const result: Segment[] = [];
    const holeSegments = getHoleSegmentPoints({ holes, centerX })({
      d3,
      depthScale,
    });
    holeSegments.forEach((hole) => {
      result.push({
        type: 'hole',
        points: [
          {
            x: hole.startX,
            y: hole.startY,
          },
          {
            x: hole.startX,
            y: hole.endY,
          },
        ],
      });
    });
    return result;
  };

export function resolveSegmentOverlaps(segments: Segment[]): Segment[] {
  let processedSegments: any[] = [];

  // Assuming the first segment is the base line (Line 0) for boundaries
  const baseSegment = segments.shift(); // Removes and returns the first element
  if (!baseSegment) {
    return []; // Handle case where there are no segments or Line 0 is missing
  }

  // Determine the boundary y-values of the base segment
  const baseStartY = Math.min(...baseSegment.points.map((p) => p.y));
  const baseEndY = Math.max(...baseSegment.points.map((p) => p.y));

  // Process each segment to calculate distinct segments
  segments.forEach((segment) => {
    for (let i = 0; i < segment.points.length - 1; i++) {
      const currentSegment = {
        type: segment.type,
        from: segment.points[i],
        to: segment.points[i + 1],
      };

      // Initialize to consider the new segment
      let newSegments = [currentSegment];

      // Process existing segments to handle overlaps
      processedSegments.forEach((existingSegment) => {
        newSegments = newSegments.flatMap((ns) => {
          const overlapStart = Math.max(ns.from.y, existingSegment.from.y);
          const overlapEnd = Math.min(ns.to.y, existingSegment.to.y);

          if (overlapStart < overlapEnd) {
            const before =
              ns.from.y < overlapStart
                ? [
                    {
                      ...ns,
                      to: { ...ns.from, y: overlapStart },
                    },
                  ]
                : [];
            const after =
              ns.to.y > overlapEnd
                ? [
                    {
                      ...ns,
                      from: { ...ns.from, y: overlapEnd },
                    },
                  ]
                : [];
            return [...before, ...after];
          }
          return [ns];
        });
      });

      // Merge new segments back to the main list
      processedSegments = [...processedSegments, ...newSegments];
    }
  });

  // Remove duplicate segments
  processedSegments = processedSegments.reduce((acc, current) => {
    if (
      !acc.some(
        (seg) =>
          seg.from.x === current.from.x &&
          seg.from.y === current.from.y &&
          seg.to.x === current.to.x &&
          seg.to.y === current.to.y &&
          seg.type === current.type
      )
    ) {
      acc.push(current);
    }
    return acc;
  }, []);

  // Sort segments by y first, then x
  processedSegments.sort((a, b) => {
    if (a.from.y === b.from.y) {
      return a.from.x - b.from.x;
    }
    return a.from.y - b.from.y;
  });

  // Adjust segments to fit within the y-values of the base line
  processedSegments = processedSegments
    .map((seg) => ({
      ...seg,
      from: { x: seg.from.x, y: Math.max(seg.from.y, baseStartY) },
      to: { x: seg.to.x, y: Math.min(seg.to.y, baseEndY) },
      actualFrom: { x: seg.from.x, y: seg.from.y },
      actualTo: { x: seg.to.x, y: seg.to.y },
    }))
    .filter((seg) => seg.from.y < seg.to.y);

  // Reverse all segments of the baseline and add them to the end of segments
  for (let i = baseSegment.points.length - 1; i > 0; i--) {
    processedSegments.push({
      type: baseSegment.type,
      from: { x: baseSegment.points[i].x, y: baseSegment.points[i].y },
      to: { x: baseSegment.points[i - 1].x, y: baseSegment.points[i - 1].y },
    });
  }

  return processedSegments.map((seg) => ({
    type: seg.type,
    points: [seg.from, seg.to],
    actualPoint: [seg.actualFrom ?? seg.from, seg.actualTo ?? seg.to],
  }));
}

export function joinSegments(segments: Segment[]): Point[] {
  let polyline: Point[] = [];

  segments.forEach((segment) => {
    if (segment.type === 'casing') {
      // Add first point of the hole
      polyline.push(...segment.points);
    } else if (segment.type === 'hole' && segment.points.length > 1) {
      // Generate and add a wavy line for holes with more than one point
      const firstPoint = segment.points[0];
      const lastPoint = segment.points[segment.points.length - 1];
      const wavyLine = generateWavyLine(
        firstPoint.x,
        firstPoint.y,
        lastPoint.y,
        segment.actualPoint?.[0].y ?? firstPoint.y,
        segment.actualPoint?.[segment.actualPoint.length - 1].y ?? lastPoint.y,
        1.5,
        4
      );
      polyline.push(...wavyLine);
      polyline.push(lastPoint);
    }
  });

  return polyline;
}

function generateWavyLine(
  startX: number,
  startY: number,
  endY: number,
  actualStartY: number,
  actualEndY: number,
  amplitude: number,
  frequency: number
): Point[] {
  let points: Point[] = [];
  const step = 0.1; // Resolution of the line

  for (let y = actualStartY; y <= actualEndY; y += step) {
    const x = startX - amplitude * Math.sin((actualEndY - y) / frequency);
    points.push({ x, y: y });
  }

  points = clipAndIntersectPoints(points, startY, endY);

  return points;
}
