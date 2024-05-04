import { Obstacle, calculateLightPoints } from './../utils/cement-utils';
import {
  clipAndIntersectPoints,
  pointsToSVGPath,
  reflectPoints,
} from './../utils/common-utils';
import { Casing, getCasingByCasingID, getCasingSegmentPoints } from './casing';
import { Hole, getHoleSegmentPoints } from './hole';
import {
  Segment,
  joinSegments,
  mapCasingsToSegments,
  mapHolesToSegments,
  resolveSegmentOverlaps,
} from './../utils/segment-overlaps-utils';

export interface Cement {
  type: 'Cement';
  refCasingID: string;
  startDepth: number;
}

export const drawCement =
  ({
    cement,
    holes,
    casings,
    centerX,
  }: {
    cement: Cement;
    holes: Hole[];
    casings: Casing[];
    centerX: number;
  }) =>
  ({ svg, depthScale, d3 }: D3Props) => {
    const refCasing = getCasingByCasingID(casings, cement.refCasingID);
    if (refCasing) {
      let refCasingSegmentPoints = getCasingSegmentPoints({
        casing: refCasing,
        centerX,
      })({ depthScale });
      const cementStartDepth = depthScale(cement.startDepth);
      refCasingSegmentPoints = clipAndIntersectPoints(
        refCasingSegmentPoints,
        cementStartDepth,
        refCasingSegmentPoints[refCasingSegmentPoints.length - 1].y
      );
      const otherCasingSegmentPoints = mapCasingsToSegments({
        casings: casings.filter((c) => c.casingID !== cement.refCasingID),
        centerX,
      })({ depthScale });

      const holeSegmentPoints = mapHolesToSegments({ holes, centerX })({
        depthScale,
        d3,
      });

      let wholeSegmentPoints = [
        ...holeSegmentPoints,
        ...otherCasingSegmentPoints,
      ];

      wholeSegmentPoints = wholeSegmentPoints.filter(
        (s) => s.points[0].x < refCasingSegmentPoints[0].x
      );

      // Sort segments based on the x-value of their first point
      wholeSegmentPoints.sort((a, b) => b.points[0].x - a.points[0].x);

      const resolvingSegments: Segment[] = [
        {
          type: 'casing',
          points: refCasingSegmentPoints,
        },
        ...wholeSegmentPoints,
      ];

      const resolvedSegments = resolveSegmentOverlaps(resolvingSegments);
      const jointResolvedSegments = joinSegments(resolvedSegments);

      const leftPath = pointsToSVGPath(jointResolvedSegments, true);
      svg
        .append('path')
        .attr('d', leftPath)
        .attr('stroke', 'blue')
        .attr('stroke-width', 1)
        .attr('fill', 'none');

      const rightSegments = reflectPoints(
        jointResolvedSegments,
        centerX,
        'ltr'
      );
      const rightPath = pointsToSVGPath(rightSegments, true);
      svg
        .append('path')
        .attr('d', rightPath)
        .attr('stroke', 'blue')
        .attr('stroke-width', 1)
        .attr('fill', 'none');
    }
  };
