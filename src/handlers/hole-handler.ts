import {
  calculateCenterX,
  createDepthScale,
  createSVG,
} from './../utils/common';
import { WellData } from 'well-data';
import { drawHoles } from './../components/hole';
import { Casing, drawCasings } from './../components/casing';
import { Packer, drawPacker } from './../components/packer';
import { Wellhead, drawWellhead } from './../components/wellhead';
import { CasingHanger, drawCasingHanger } from './../components/casing-hanger';

export const handleHole = async (wellData: WellData) => {
  // Create an SVG element
  const [svg, d3, d3n] = createSVG(400, 900, 100);

  const depthScale = createDepthScale([0, 1000], [0, 900])({ d3 });
  const holeData = wellData.holes;
  const centerX = calculateCenterX(holeData[0].diameter);

  // Draw hole sections
  drawHoles({ holeData, centerX })({ d3, svg, depthScale });

  // Draw casing components
  const casings: Casing[] = wellData.components?.filter(
    (c) => c.type === 'Casing'
  ) as any;
  if (casings) {
    drawCasings({ casings, centerX })({ d3, svg, depthScale });
  }

  // Draw packer components
  const packers: Packer[] = wellData.components?.filter(
    (c) => c.type === 'Packer'
  ) as any;
  if (packers) {
    packers.forEach((packer) =>
      drawPacker({ packer, casings, centerX })({ svg, depthScale })
    );
  }

  // Draw wellhead
  const wellhead: Wellhead = wellData.components?.find(
    (c) => c.type === 'Wellhead'
  ) as any;
  if (wellhead) {
    drawWellhead({ wellhead, casings, centerX })({ svg });

    // Draw casing hanger
    const casingHangers: CasingHanger[] = wellData.components?.filter(
      (c) => c.type === 'CasingHanger'
    ) as any;
    if (casingHangers) {
      casingHangers.forEach((casingHanger, inx) => {
        drawCasingHanger({
          casingHanger,
          wellhead,
          casings,
          centerX,
          slot: inx + 1,
        })({ svg });
      });
    }
  }

  return d3n.svgString();
};
