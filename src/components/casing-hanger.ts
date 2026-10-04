import { getBoundary, inchToPixel } from '../utils/common-utils';
import { Casing, getCasingByCasingID } from './casing';
import { Wellhead, getWellheadPoints } from './wellhead';
import { hangerProfile, hangerPath, HANGER_BORE_INSET, HANGER_SLOT_PITCH } from '../geometry/hanger-profile';

export interface CasingHanger {
  type: 'CasingHanger';
  refCasingID: string;
}

export const drawCasingHanger =
  ({
    casingHanger,
    wellhead,
    casings,
    slot,
    centerX,
  }: {
    casingHanger: CasingHanger;
    wellhead: Wellhead;
    centerX: number;
    casings: Casing[];
    slot: number;
  }) =>
  ({ svg }: D3Props) => {
    if (wellhead) {
      const refCasing = getCasingByCasingID(casings, casingHanger.refCasingID);
      if (refCasing) {
        const wellheadPoints = getWellheadPoints(wellhead, casings, centerX);
        if (wellheadPoints) {
          const boundary = getBoundary();
          const refCasingDiameter = refCasing.segments[0].diameter;
          const casingStartDepth = refCasing.startDepth;
          const refLeftCasingX = centerX - inchToPixel(refCasingDiameter) / 2;
          const refRightCasingX = centerX + inchToPixel(refCasingDiameter) / 2;
          const hangerStartY = wellheadPoints.topPoints[1].y + slot * HANGER_SLOT_PITCH;
          const left = hangerProfile(wellheadPoints.topPoints[1].x + HANGER_BORE_INSET, refLeftCasingX, hangerStartY);
          const right = hangerProfile(wellheadPoints.topPoints[2].x - HANGER_BORE_INSET, refRightCasingX, hangerStartY);

          for (const [side, points] of [['left', left], ['right', right]] as const) {
            const terminal = points[4];
            const continuation = casingStartDepth === 0
              ? ` M${terminal.x},${terminal.y} L${terminal.x},${boundary.y}`
              : '';
            svg.append('path')
              .attr('data-kind', 'CasingHanger')
              .attr('data-casing-id', casingHanger.refCasingID)
              .attr('data-side', side)
              .attr('d', hangerPath(points) + continuation)
              .attr('fill', 'none')
              .attr('stroke', 'blue')
              .attr('stroke-width', 1);
          }
        }
      }
    }
  };
