import {
  calculateCenterX,
  createDepthScale,
  createSVG,
} from '../utils/common-utils';
import { WellData } from 'well-data';
import { drawHoles } from './../components/hole';
import { Casing, drawCasings } from './../components/casing';
import { Packer, drawPacker } from './../components/packer';
import { Wellhead, drawWellhead } from './../components/wellhead';
import { CasingHanger, drawCasingHanger } from './../components/casing-hanger';
import { Cement, drawCement } from './../components/cement';
import { cementPattern } from './../patterns/cement-pattern';

export const handleHole = (wellData: WellData) => {
  // Create an SVG element
  const [svg, d3, d3n, defs] = createSVG(400, 900, 100);

  const holeData = wellData.holes;
  const lastHoleDepth = holeData[holeData.length - 1].depth;
  const depthScale = createDepthScale([0, Math.max(lastHoleDepth, 1000) + 800], [0, 900])({ d3 });
  const centerX = calculateCenterX(holeData[0].diameter);

  // defs
  cementPattern()({ defs });

  const casings: Casing[] = wellData.components?.filter(
    (c) => c.type === 'Casing'
  ) as any;

  // Draw cement
  const cements: Cement[] = wellData.components?.filter(
    (c) => c.type === 'Cement'
  ) as any;
  if (cements) {
    cements.forEach((cement) =>
      drawCement({ cement, holes: holeData, casings, centerX })({
        svg,
        depthScale,
        d3,
      })
    );
  }

  // Draw hole sections
  drawHoles({ holeData, centerX })({ d3, svg, depthScale });

  // Draw casing components
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
