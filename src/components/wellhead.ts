import { getBoundary, inchToPixel } from '../utils/common-utils';
import { Casing, getCasingByCasingID } from './casing';

export interface Wellhead {
  type: 'Wellhead';
  wellheadType: 'Platform' | 'Onshore' | 'Shallow' | 'Subsea';
  surfaceCasingID: string;
  seatingCasingID?: string;
}

export const getWellheadPoints = (
  wellhead: Wellhead,
  casings: Casing[],
  centerX: number
) => {
  const surfaceCasing = getCasingByCasingID(casings, wellhead.surfaceCasingID);
  if (surfaceCasing) {
    const boundary = getBoundary();
    const startY = boundary.y;
    const surfaceCasingDiameter = surfaceCasing.segments[0].diameter;
    const refLeftCasingX = centerX - inchToPixel(surfaceCasingDiameter) / 2;
    const refRightCasingX = centerX + inchToPixel(surfaceCasingDiameter) / 2;
    const wellheadHeight = 52;
    const wellheadBoreWidth = 6;

    return {
      startPoints: [
        { x: refLeftCasingX - wellheadBoreWidth, y: startY },
        { x: refLeftCasingX, y: startY },
        { x: refRightCasingX, y: startY },
        { x: refRightCasingX + wellheadBoreWidth, y: startY },
      ],
      topPoints: [
        { x: refLeftCasingX - wellheadBoreWidth, y: startY - wellheadHeight },
        { x: refLeftCasingX, y: startY - wellheadHeight },
        { x: refRightCasingX, y: startY - wellheadHeight },
        { x: refRightCasingX + wellheadBoreWidth, y: startY - wellheadHeight },
      ],
    };
  }
  return null;
};

export const drawWellhead =
  ({
    wellhead,
    casings,
    centerX,
  }: {
    wellhead: Wellhead;
    casings: Casing[];
    centerX: number;
  }) =>
  ({ svg }: D3Props) => {
    const surfaceCasing = getCasingByCasingID(
      casings,
      wellhead.surfaceCasingID
    );
    if (surfaceCasing) {
      let seatingCasing: Casing | undefined = undefined;
      if (wellhead.seatingCasingID) {
        seatingCasing = getCasingByCasingID(casings, wellhead.seatingCasingID);
      }
      const boundary = getBoundary();
      const startY = boundary.y;
      const surfaceCasingDiameter = surfaceCasing.segments[0].diameter;
      const refLeftCasingX = centerX - inchToPixel(surfaceCasingDiameter) / 2;
      const refRightCasingX = centerX + inchToPixel(surfaceCasingDiameter) / 2;
      const wellheadHeight = 52;
      const wellheadBoreWidth = 6;

      // Draw left wellhead's bore
      svg
        .append('path')
        .attr(
          'd',
          `M${refLeftCasingX},${startY} l0,-${wellheadHeight} l-${wellheadBoreWidth},0 l0,${wellheadHeight} z`
        )
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 1);

      // Draw right wellhead's bore
      svg
        .append('path')
        .attr(
          'd',
          `M${refRightCasingX},${startY} l0,-${wellheadHeight} l${wellheadBoreWidth},0 l0,${wellheadHeight} z`
        )
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 1);

      if (seatingCasing) {
        const seatingCasingDiameter = seatingCasing.segments[0].diameter;
        const seatingLeftCasingX =
          centerX - inchToPixel(seatingCasingDiameter) / 2;
        const seatingWidth = Math.abs(seatingLeftCasingX - refLeftCasingX);
        const seatingRightCasingX =
          centerX + inchToPixel(seatingCasingDiameter) / 2;
        const seatingBoreWidth = seatingWidth - wellheadBoreWidth;
        // Draw left wellhead's seating
        svg
          .append('path')
          .attr(
            'd',
            `M${seatingLeftCasingX},${startY} l${seatingBoreWidth},0 l0,-${wellheadBoreWidth} l-${seatingBoreWidth},0 z`
          )
          .attr('fill', 'none')
          .attr('stroke', 'blue')
          .attr('stroke-width', 1);

        // Draw right wellhead's seating
        svg
          .append('path')
          .attr(
            'd',
            `M${seatingRightCasingX},${startY} l-${seatingBoreWidth},0 l0,-${wellheadBoreWidth} l${seatingBoreWidth},0 z`
          )
          .attr('fill', 'none')
          .attr('stroke', 'blue')
          .attr('stroke-width', 1);
      }
    }
  };
