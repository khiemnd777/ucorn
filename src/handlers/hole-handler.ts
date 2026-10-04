import {
  calculateCenterX,
  createDepthScale,
  createSVG,
  inchToPixel,
} from '../utils/common-utils';
import { drawHoles } from './../components/hole';
import { Casing, drawCasings } from './../components/casing';
import { Packer, drawPacker } from './../components/packer';
import { Wellhead, drawWellhead, getWellheadPoints } from './../components/wellhead';
import { CasingHanger, drawCasingHanger } from './../components/casing-hanger';
import { Cement, drawCement } from './../components/cement';
import { cementPattern } from './../patterns/cement-pattern';
import { prepareWell } from '../validation/completion';
import { layoutCompletion } from '../geometry/completion-layout';
import { drawTubing } from '../components/tubing';
import { drawTubingHanger } from '../components/tubing-hanger';
import { drawCompletionPacker } from '../components/completion-packer';
import { drawCompletionNotes } from '../components/completion-notes';
import { drawCrossover } from '../components/crossover';
import { drawCoupling } from '../components/coupling';
import { drawPupJoint } from '../components/pup-joint';

export const handleHole = (input: unknown) => {
  const { well: wellData, completion } = prepareWell(input);
  // Create an SVG element
  const [svg, d3, d3n, defs] = createSVG(400, 900, 100);

  const holeData = wellData.holes;
  const lastHoleDepth = holeData[holeData.length - 1].depth;
  const depthScale = createDepthScale([0, Math.max(lastHoleDepth, 1000) + 800], [0, 900])({ d3 });
  const contextWidth = completion ? Math.max(...holeData.map(h => h.diameter), ...wellData.components!.filter(c => c.type === 'Casing').flatMap(c => (c as Casing).segments.map(s => s.diameter))) : holeData[0].diameter;
  const centerX = calculateCenterX(contextWidth);

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

  if (completion) {
    const headPoints = completion.hanger && wellhead ? getWellheadPoints(wellhead, casings, centerX) : undefined;
    const layout = layoutCompletion(completion, {
      centerX, depthToY: depthScale, diameterToWidth: mm => inchToPixel(mm / 25.4),
      labelX: Math.max(315, centerX + inchToPixel(contextWidth) / 2 + 40),
      headMouth: headPoints ? { left: headPoints.topPoints[1].x, right: headPoints.topPoints[2].x, top: headPoints.topPoints[1].y } : undefined,
    });
    d3.select(svg.node().ownerSVGElement).attr('width', layout.width).attr('height', layout.height).attr('viewBox', `0 0 ${layout.width} ${layout.height}`);
    drawTubing({ tubing: completion.tubing, layout })({ svg });
    if (completion.hanger) {
      drawTubingHanger({ tubingHanger: completion.hanger, layout })({ svg });
    }
    const pupsById = new Map(completion.pupJoints.map(pup => [pup.id, pup]));
    for (const pupLayout of layout.pupJoints) {
      drawPupJoint({ pupJoint: pupsById.get(pupLayout.id)!, layout: pupLayout, labelX: layout.labelX })({ svg });
    }
    const couplingsById = new Map(completion.couplings.map(coupling => [coupling.id, coupling]));
    for (const couplingLayout of layout.couplings) {
      drawCoupling({ coupling: couplingsById.get(couplingLayout.id)!, layout: couplingLayout, labelX: layout.labelX })({ svg });
    }
    const crossoversById = new Map(completion.crossovers.map(crossover => [crossover.id, crossover]));
    for (const crossoverLayout of layout.crossovers) {
      drawCrossover({ crossover: crossoversById.get(crossoverLayout.id)!, layout: crossoverLayout, labelX: layout.labelX })({ svg });
    }
    const packersById = new Map(completion.packers.map(packer => [packer.id, packer]));
    for (const packerLayout of layout.packers) {
      const packer = packersById.get(packerLayout.id)!;
      drawCompletionPacker({ packer, layout: packerLayout, labelX: layout.labelX })({ svg });
    }
    drawCompletionNotes({ notes: layout.notes })({ svg });
  }
  return d3n.svgString();
};
