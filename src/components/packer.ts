import { inchToPixel } from './../utils/common';
import {
  Casing,
  getCasingByCasingID,
  getCasingDiameterByDepth,
} from './casing';

export interface Packer {
  type: 'Packer';
  toolType?:
    | 'Liner Top Packer'
    | 'Production Packer'
    | 'Isolation Packer'
    | 'Well Test Packer';
  refCasingID: string;
  seatingCasingID?: string;
  startDepth: number;
}

export const drawPacker =
  ({
    packer,
    casings,
    centerX,
  }: {
    packer: Packer;
    casings: Casing[];
    centerX: number;
  }) =>
  ({ svg, depthScale }: D3Props) => {
    const refCasing = getCasingByCasingID(casings, packer.refCasingID);
    if (refCasing) {
      let seatingCasingDiameter = 0;
      if (packer.seatingCasingID) {
        const seatingCasing = getCasingByCasingID(
          casings,
          packer.seatingCasingID
        );
        if (seatingCasing) {
          seatingCasingDiameter = getCasingDiameterByDepth(
            seatingCasing,
            packer.startDepth
          );
        }
      }
      const refCasingDiameter = getCasingDiameterByDepth(
        refCasing,
        packer.startDepth
      );
      const y = depthScale(packer.startDepth);
      const refLeftCasingX = centerX - inchToPixel(refCasingDiameter) / 2;
      const refRightCasingX = centerX + inchToPixel(refCasingDiameter) / 2;
      const seatingCasingX = seatingCasingDiameter
        ? centerX - inchToPixel(seatingCasingDiameter) / 2
        : refLeftCasingX - 3;
      const width = Math.abs(refLeftCasingX - seatingCasingX);
      const height = 8;
      // Left path
      svg
        .append('path')
        .attr(
          'd',
          `
            M${refLeftCasingX},${y} l-${width},0 l0,${height} l${width},0 z
            M${refLeftCasingX},${y} l-${width},${height}
            M${refLeftCasingX},${y + height} l-${width},-${height}
          `
        )
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 1);

      // Right path
      svg
        .append('path')
        .attr(
          'd',
          `
            M${refRightCasingX},${y} l${width},0 l0,${height} l-${width},0 z
            M${refRightCasingX},${y} l${width},${height}
            M${refRightCasingX},${y + height} l${width},-${height}
          `
        )
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 1);
    }
  };
