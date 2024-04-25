import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import D3Node from 'd3-node';
import { calculateCenterX, createDepthScale, createSVG } from './utils/common';
import { WellData } from 'well-data';
import { Hole, drawHoles } from './components/hole';
import { Casing, drawCasings } from './components/casing';
import { Packer, drawPacker } from './components/packer';
import { Wellhead, drawWellhead } from './components/wellhead';
import { CasingHanger, drawCasingHanger } from './components/casing-hanger';

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON bodies

app.post('/hole', (req, res) => {
  // Create an SVG element
  const [svg, d3, d3n] = createSVG(400, 900, 100);

  const depthScale = createDepthScale([0, 1000], [0, 900])({ d3 });

  const wellData = req.body as WellData;
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

  // Send the SVG as response
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(d3n.svgString());
});

app.post('/generate-svg', (req: Request, res: Response) => {
  const data: Hole[] = req.body; // TypeScript ensures data is of type Hole[]
  const svg = generateSVG(data);
  res.set('Content-Type', 'image/svg+xml');
  res.send(svg);
});

function generateSVG(data: Hole[]): string {
  const d3n = new D3Node(); // initializes D3.js on the server
  const svg = d3n.createSVG(1000, 1000); // create an SVG with defined width and height

  data.forEach((hole, index) => {
    svg
      .append('circle')
      .attr('cx', 100 * (index + 1))
      .attr('cy', 100)
      .attr('r', hole.diameter)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', '2');
  });

  return d3n.svgString();
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
