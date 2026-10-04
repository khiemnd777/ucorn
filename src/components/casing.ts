import { getBoundary, inchToPixel } from '../utils/common-utils';

export interface Segment {
  segmentID?: string;
  diameter: number;
  length: number;
  /** Explicit context bore for completion v2; never inferred from diameter. */
  boreDiameter?: import('../domain/completion').Quantity;
}

export interface Tieback {
  tiebackID?: string;
  tiebackType?: 'Casing Extension' | 'Well Deepening' | 'Well Reinforcement';
  startDepth: number;
  segments: Segment[];
}

export interface Casing {
  type: 'Casing';
  casingID?: string;
  refHoleID?: string;
  pipeType:
    | 'Conductor Casing'
    | 'Surface Casing'
    | 'Intermediate Casing'
    | 'Production Casing'
    | 'Drilling Liner'
    | 'Production Liner';
  startDepth: number;
  segments: Segment[];
  tieback?: Tieback;
  shoe?: boolean;
}

export const getCasingDiameterByDepth = (casing: Casing, depth: number) => {
  let cumulativeDepth = casing.startDepth; // Start at the initial depth of the casing

  // Loop through each segment to find where the given depth falls
  for (const segment of casing.segments) {
    // Add the length of the current segment to the cumulative depth
    cumulativeDepth += segment.length;

    // Check if the given depth falls within this segment
    if (depth <= cumulativeDepth) {
      return segment.diameter; // Return the diameter of the current segment
    }
  }

  // If the target depth is beyond the last segment
  throw 'Depth exceeds the length of the last segment';
};

export const getCasingAndDiameterByDepth = (
  casingData: Casing[],
  depth: number
) => {
  for (const casing of casingData) {
    let cumulativeDepth = casing.startDepth; // Start at the initial depth of this casing

    for (const segment of casing.segments) {
      if (
        depth >= cumulativeDepth &&
        depth < cumulativeDepth + segment.length
      ) {
        // If the target depth falls within this segment
        return {
          casingID: casing.casingID,
          diameter: segment.diameter,
          depth: depth,
        };
      }
      // Update the cumulative depth to include this segment's length
      cumulativeDepth += segment.length;
    }
  }

  // If the target depth is beyond all casings
  throw 'Depth exceeds the length of the last segment or is before the first segment starts';
};

export const getCasingByCasingID = (casingData: Casing[], casingID: string) => {
  if (casingID) {
    return casingData.find((c) => c.casingID === casingID);
  }
  return undefined;
};

const drawCasingShoes =
  ({
    lastSegmentDiameter,
    casingDepth,
    centerX,
  }: {
    lastSegmentDiameter: number;
    casingDepth: number;
    centerX: number;
  }) =>
  ({ svg, depthScale }: D3Props) => {
    // Casing shoe dimensions
    const shoeWidth = 6; // Width of each shoe triangle
    const shoeHeight = shoeWidth / 1.5; // Height of each shoe triangle

    // Calculate positions for left and right casing shoes
    const xLeftShoe = centerX - inchToPixel(lastSegmentDiameter) / 2;
    const xRightShoe = centerX + inchToPixel(lastSegmentDiameter) / 2;
    const yShoe = depthScale(casingDepth);

    // Draw the left casing shoe
    svg
      .append('path')
      .attr(
        'd',
        `M ${xLeftShoe} ${yShoe} L ${
          xLeftShoe - shoeWidth
        } ${yShoe} L ${xLeftShoe} ${yShoe - shoeHeight} Z`
      )
      .attr('stroke', 'blue')
      .attr('stroke-width', 1)
      .attr('fill', 'blue');

    // Draw the right casing shoe
    svg
      .append('path')
      .attr(
        'd',
        `M ${xRightShoe} ${yShoe} L ${
          xRightShoe + shoeWidth
        } ${yShoe} L ${xRightShoe} ${yShoe - shoeHeight} Z`
      )
      .attr('stroke', 'blue')
      .attr('stroke-width', 1)
      .attr('fill', 'blue');
  };

export const getCasingSegmentPoints =
  ({ casing, centerX }: { casing: Casing; centerX: number }) =>
  ({ depthScale }: D3Props) => {
    const boundary = getBoundary();
    const points: { x: number; y: number }[] = []; // Points for the left polyline
    let currentDepth = casing.startDepth;
    let prevCrossoverLength = 0;

    casing.segments.forEach((segment, index) => {
      const diameterInPxl = inchToPixel(segment.diameter);
      const x1 = centerX - diameterInPxl / 2;
      const x2 = centerX + diameterInPxl / 2;
      const y1 = Math.max(
        depthScale(currentDepth) + prevCrossoverLength,
        boundary.y
      );
      const y2 = depthScale(currentDepth + segment.length);
      // Push start and end points for this segment to the polyline arrays
      points.push({ x: x1, y: y1 }, { x: x1, y: y2 });

      // Handle cross-over to the next segment
      if (index < casing.segments.length - 1) {
        const nextSegment = casing.segments[index + 1];
        const nextX1 = centerX - inchToPixel(nextSegment.diameter) / 2;
        const crossoverLength = Math.abs(nextX1 - x1);

        // Add cross-over points
        points.push({ x: nextX1, y: y2 + crossoverLength });
        prevCrossoverLength = crossoverLength;
      }

      currentDepth += segment.length;
    });

    return points;
  };

const drawCasingSegments =
  ({ casing, centerX }: { casing: Casing; centerX: number }) =>
  ({ svg, d3, depthScale }: D3Props) => {
    const boundary = getBoundary();

    // Line generator
    const line = d3
      .line()
      .x((d: any) => d.x)
      .y((d: any) => d.y)
      .curve(d3.curveLinear);

    const leftPoints: { x: number; y: number }[] = []; // Points for the left polyline
    const rightPoints: { x: number; y: number }[] = []; // Points for the right polyline
    let currentDepth = casing.startDepth;
    let prevCrossoverLength = 0;
    casing.segments.forEach((segment, index) => {
      const diameterInPxl = inchToPixel(segment.diameter);
      const x1 = centerX - diameterInPxl / 2;
      const x2 = centerX + diameterInPxl / 2;
      const y1 = Math.max(
        depthScale(currentDepth) + prevCrossoverLength,
        boundary.y
      );
      const y2 = depthScale(currentDepth + segment.length);
      // Push start and end points for this segment to the polyline arrays
      leftPoints.push({ x: x1, y: y1 }, { x: x1, y: y2 });
      rightPoints.push({ x: x2, y: y1 }, { x: x2, y: y2 });

      // Handle cross-over to the next segment
      if (index < casing.segments.length - 1) {
        const nextSegment = casing.segments[index + 1];
        const nextX1 = centerX - inchToPixel(nextSegment.diameter) / 2;
        const nextX2 = centerX + inchToPixel(nextSegment.diameter) / 2;
        const crossoverLength = Math.abs(nextX1 - x1);

        // Add cross-over points
        leftPoints.push({ x: nextX1, y: y2 + crossoverLength });
        rightPoints.push({ x: nextX2, y: y2 + crossoverLength });
        prevCrossoverLength = crossoverLength;
      }

      currentDepth += segment.length;
    });

    if ('undefined' === typeof casing.shoe || casing.shoe) {
      drawCasingShoes({
        lastSegmentDiameter:
          casing.segments[casing.segments.length - 1].diameter,
        casingDepth: currentDepth,
        centerX,
      })({ svg, depthScale });
    }

    // Draw the left polyline
    svg
      .append('path')
      .datum(leftPoints)
      .attr('d', line)
      .attr('stroke', 'blue')
      .attr('stroke-width', 1)
      .attr('fill', 'none');

    // Draw the right polyline
    svg
      .append('path')
      .datum(rightPoints)
      .attr('d', line)
      .attr('stroke', 'blue')
      .attr('stroke-width', 1)
      .attr('fill', 'none');
  };

export const drawCasings =
  ({ casings, centerX }: { casings: Casing[]; centerX: number }) =>
  ({ svg, d3, depthScale }: D3Props) => {
    // Line generator
    const line = d3
      .line()
      .x((d: any) => d.x)
      .y((d: any) => d.y)
      .curve(d3.curveLinear);

    casings.forEach((casing) => {
      drawCasingSegments({ casing, centerX })({ svg, d3, depthScale });
    });
  };
