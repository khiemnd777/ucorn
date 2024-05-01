import { Obstacle, calculateLightPoints } from './../utils/cement-utils';
import { inchToPixel, pointsToSVGPath } from './../utils/common-utils';
import {
  Casing,
  getCasingByCasingID,
  getCasingDiameterByDepth,
  getCasingSegmentPoints,
} from './casing';
import { Hole, getHoleSegmentPoints } from './hole';

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
      const casingSegmentPoints = getCasingSegmentPoints({
        casing: refCasing,
        centerX,
      })({ depthScale });
      const wholeHoleSegmentPoints = getHoleSegmentPoints({ holes, centerX })({
        depthScale,
        d3,
      });
      const wavyObstacles: Obstacle[] = wholeHoleSegmentPoints.map((h) => ({
        type: 'rectangular',
        amplitude: 1.5,
        frequency: 4,
        startY: h.startY,
        endY: h.endY,
        startX: h.startX,
        points: h.points,
      }));
      const wholeCasingSegmentPoints: {
        id: string | undefined;
        points: Point[];
      }[] = [];
      casings.forEach((c) => {
        if (c.casingID !== cement.refCasingID) {
          wholeCasingSegmentPoints.push({
            id: c.casingID,
            points: getCasingSegmentPoints({ casing: c, centerX })({
              depthScale,
            }),
          });
        }
      });
      const lineObstacles: Obstacle[] = wholeCasingSegmentPoints.map((c) => ({
        type: 'rectangular',
        points: c.points,
      }));

      const lightPoints = calculateLightPoints(casingSegmentPoints, [
        ...lineObstacles,
        ...wavyObstacles,
      ]);
      const svgPath = pointsToSVGPath(lightPoints);
      console.log(svgPath);
      svg
        .append('path')
        .attr('d', svgPath)
        .attr('stroke', 'blue')
        .attr('stroke-width', 1)
        .attr('fill', 'none');
    }
  };
