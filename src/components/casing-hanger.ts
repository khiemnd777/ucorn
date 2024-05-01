import { getBoundary, inchToPixel } from '../utils/common-utils';
import { Casing, getCasingByCasingID } from './casing';
import { Wellhead, getWellheadPoints } from './wellhead';

export interface CasingHanger {
  type: 'CasingHanger';
  refCasingID: string;
}

const calculateInclinationVerticalHeight = (
  angleDegrees: number,
  horizontalDistance: number
) => {
  // Convert angle from degrees to radians
  const angleRadians = angleDegrees * (Math.PI / 180);

  // Calculate vertical height using tangent
  const verticalHeight = Math.tan(angleRadians) * horizontalDistance;

  return verticalHeight;
};

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
          const deltaHangerBoreHeight = 10;
          const refCasingDiameter = refCasing.segments[0].diameter;
          const casingStartDepth = refCasing.startDepth;
          const refLeftCasingX = centerX - inchToPixel(refCasingDiameter) / 2;
          const refRightCasingX = centerX + inchToPixel(refCasingDiameter) / 2;
          const wellheadLeftTopX = wellheadPoints.topPoints[1].x;
          const wellheadRightTopX = wellheadPoints.topPoints[2].x;
          const wellheadTopY = wellheadPoints.topPoints[1].y;
          const hangerLeftStartX = wellheadLeftTopX + 1;
          const hangerRightStartX = wellheadRightTopX - 1;
          const hangerStartY =
            wellheadTopY + slot * (deltaHangerBoreHeight + 2);
          const hangerWidth = Math.abs(refLeftCasingX - hangerLeftStartX);
          const deltaHangerHookWidth = hangerWidth / 6;
          const deltaHangerWidth = hangerWidth - deltaHangerHookWidth;
          const hangerInclVerticalHeight = calculateInclinationVerticalHeight(
            45,
            deltaHangerWidth
          );

          // Draw left casing hanger's bore
          svg
            .append('path')
            .attr(
              'd',
              `
                M${hangerLeftStartX},${hangerStartY} 
                l0,${deltaHangerBoreHeight} 
                l${deltaHangerHookWidth},0 
                L${refLeftCasingX - deltaHangerHookWidth},${
                hangerStartY + deltaHangerBoreHeight + hangerInclVerticalHeight
              } 
                l${deltaHangerHookWidth},0
                l0,-${deltaHangerBoreHeight} 
                l-${deltaHangerHookWidth},0
                L${hangerLeftStartX + deltaHangerHookWidth},${hangerStartY}
                z
                ${
                  casingStartDepth === 0
                    ? `
                M${refLeftCasingX},${
                        hangerStartY +
                        deltaHangerBoreHeight +
                        hangerInclVerticalHeight
                      }
                L${refLeftCasingX},${boundary.y}
                `
                    : ''
                }
              `
            )
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 1);

          // Draw right casing hanger's bore
          svg
            .append('path')
            .attr(
              'd',
              `
                M${hangerRightStartX},${hangerStartY} 
                l0,${deltaHangerBoreHeight} 
                l-${deltaHangerHookWidth},0 
                L${refRightCasingX + deltaHangerHookWidth},${
                hangerStartY + deltaHangerBoreHeight + hangerInclVerticalHeight
              } 
                l-${deltaHangerHookWidth},0
                l0,-${deltaHangerBoreHeight} 
                l${deltaHangerHookWidth},0
                L${hangerRightStartX - deltaHangerHookWidth},${hangerStartY} 
                z
                ${
                  casingStartDepth === 0
                    ? `
                M${refRightCasingX},${
                        hangerStartY +
                        deltaHangerBoreHeight +
                        hangerInclVerticalHeight
                      }
                L${refRightCasingX},${boundary.y}
                `
                    : ''
                }
              `
            )
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 1);
        }
      }
    }
  };
