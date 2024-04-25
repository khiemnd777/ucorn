import { getBoundary, inchToPixel } from './../utils/common';

export interface Underreamed {
  diameter: number;
  startDepth: number;
  endDepth: number;
}

export interface Hole {
  holeID?: string;
  diameter: number;
  depth: number;
  underreamed?: Underreamed[];
}

const getWaveX = ({
  centerX,
  diameter,
  y,
  side,
}: {
  centerX: number;
  diameter: number;
  y: number;
  side: string;
}) => {
  const waveAmplitude = 1.5; // Amplitude of the wave
  const waveFrequency = 4; // Frequency of the wave
  const diameterInPxl = inchToPixel(diameter);
  return side === 'left'
    ? centerX - diameterInPxl / 2 - waveAmplitude * Math.sin(y / waveFrequency)
    : centerX + diameterInPxl / 2 + waveAmplitude * Math.sin(y / waveFrequency);
};

const getWaveY = ({
  startLength,
  holeDepthSeq,
  y,
}: {
  startLength: number;
  holeDepthSeq: number;
  y: number;
}) => {
  return holeDepthSeq - y + startLength;
};

export const drawWavePath =
  ({
    centerX,
    diameter,
    startLength,
    holeDepthSeq,
    side,
  }: {
    centerX: number;
    diameter: number;
    startLength: number;
    holeDepthSeq: number;
    side: string;
  }) =>
  ({ d3 }: D3Props) => {
    return d3
      .line()
      .x((d: any, i: number) =>
        getWaveX({
          centerX,
          diameter,
          y: i,
          side,
        })
      )
      .y((d: any, i: number) =>
        getWaveY({
          startLength,
          holeDepthSeq,
          y: i,
        })
      );
  };

const drawHoleBySide =
  ({
    startLength,
    holeDepthSeq,
    diameter,
    centerX,
    range,
    side,
  }: {
    diameter: number;
    startLength: number;
    holeDepthSeq: number;
    centerX: number;
    range: any;
    side: string;
  }) =>
  ({ d3, svg }: D3Props) => {
    svg
      .append('path')
      .datum(range)
      .attr(
        'd',
        drawWavePath({
          startLength,
          holeDepthSeq,
          centerX,
          diameter,
          side,
        })({ d3 })
      )
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 1);
  };

const drawMudLineBySide =
  ({
    startLength,
    holeDepthSeq,
    mudLineDiameter,
    diameter,
    centerX,
    side,
  }: {
    mudLineDiameter: number;
    diameter: number;
    startLength: number;
    holeDepthSeq: number;
    centerX: number;
    side: string;
  }) =>
  ({ svg }: D3Props) => {
    const waveX = getWaveX({
      centerX,
      diameter,
      y: holeDepthSeq,
      side,
    });
    const waveY = getWaveY({
      holeDepthSeq,
      startLength,
      y: holeDepthSeq,
    });
    const diameterInPxl = inchToPixel(mudLineDiameter);
    const sign = side === 'left' ? -1 : 1;
    const mudLineX = centerX + sign * (diameterInPxl / 2);
    const width = waveX - mudLineX;
    svg
      .append('path')
      .attr('d', `M${waveX},${waveY} l${-width},0`)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 1);
  };

export const drawMudLine =
  ({
    startLength,
    holeDepthSeq,
    mudLineDiameter,
    diameter,
    centerX,
  }: {
    diameter: number;
    mudLineDiameter: number;
    startLength: number;
    holeDepthSeq: number;
    centerX: number;
  }) =>
  ({ svg }: D3Props) => {
    // Draw left mud line
    drawMudLineBySide({
      startLength,
      centerX,
      mudLineDiameter,
      diameter,
      holeDepthSeq,
      side: 'left',
    })({ svg });

    // Draw left mud line
    drawMudLineBySide({
      startLength,
      centerX,
      mudLineDiameter,
      diameter,
      holeDepthSeq,
      side: 'right',
    })({ svg });

    return diameter;
  };

export const drawBottomHoleLine =
  ({
    diameter,
    centerX,
    holeDepthSeq,
  }: {
    diameter: number;
    centerX: number;
    holeDepthSeq: number;
  }) =>
  ({ svg }: D3Props) => {
    const diameterInPxl = inchToPixel(diameter);
    const x = centerX - diameterInPxl / 2;
    const y = holeDepthSeq;
    svg
      .append('path')
      .attr('d', `M${x},${y} l${diameterInPxl},0`)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 1);
  };

export const drawHole =
  ({
    startLength,
    diameter,
    depth,
    centerX,
  }: {
    diameter: number;
    depth: number;
    startLength: number;
    centerX: number;
  }) =>
  ({ d3, svg, depthScale }: D3Props) => {
    const holeDepthSeq = depthScale(depth) - startLength;
    const range = d3.range(holeDepthSeq);

    // Draw the left wavy line
    drawHoleBySide({
      startLength,
      holeDepthSeq,
      diameter,
      centerX,
      range,
      side: 'left',
    })({ d3, svg });

    // Draw the right wavy line
    drawHoleBySide({
      startLength,
      holeDepthSeq,
      diameter,
      centerX,
      range,
      side: 'right',
    })({ d3, svg });

    return startLength + holeDepthSeq;
  };

const transformHoleData = (holeDatum: Hole) => {
  const results: Hole[] = [];

  // Handle the case where 'underreamed' is undefined or empty
  if (!holeDatum.underreamed || holeDatum.underreamed.length === 0) {
    results.push({
      diameter: holeDatum.diameter,
      depth: holeDatum.depth,
    });
    return results;
  }

  let currentDepth = 0;

  // Sort underreamed sections by startDepth just in case they are not ordered
  holeDatum.underreamed.sort((a, b) => a.startDepth - b.startDepth);

  // Process each underreamed section
  holeDatum.underreamed.forEach((section, index) => {
    // Add the normal section before the underreamed section if there is a gap
    if (section.startDepth > currentDepth) {
      results.push({
        diameter: holeDatum.diameter,
        depth: section.startDepth,
      });
    }

    // Add the underreamed section
    results.push({
      diameter: section.diameter,
      depth: section.endDepth,
    });

    // Update current depth tracking
    currentDepth = section.endDepth;

    // Check for a gap between this underreamed section and the next (or to the total depth if it's the last section)
    if (
      index + 1 < holeDatum.underreamed.length &&
      holeDatum.underreamed[index + 1].startDepth > currentDepth
    ) {
      results.push({
        diameter: holeDatum.diameter,
        depth: holeDatum.underreamed[index + 1].startDepth,
      });
    } else if (
      index === holeDatum.underreamed.length - 1 &&
      currentDepth < holeDatum.depth
    ) {
      // Add the remaining part of the hole after the last underreamed section
      results.push({
        diameter: holeDatum.diameter,
        depth: holeDatum.depth,
      });
    }
  });

  return results;
};

export const drawHoles =
  ({ holeData, centerX }: { holeData: Hole[]; centerX: number }) =>
  ({ d3, svg, depthScale }: D3Props) => {
    const boundary = getBoundary();
    // Draw hole sections
    let nextStartLength = boundary.y;
    let mudLineDiameter = 0;

    // Transform the hole with underreamed section inside of each one.
    const transformedHoles: Hole[] = [];

    holeData.forEach((h, inx) =>
      transformedHoles.push(...transformHoleData(h))
    );

    transformedHoles.forEach((h, inx) => {
      // Draw the mud line at the first hole
      if (inx === 0) {
        mudLineDiameter = h.diameter + 7.25;
      }

      // Draw connected line between each hole
      mudLineDiameter = drawMudLine({
        centerX,
        diameter: h.diameter,
        mudLineDiameter: mudLineDiameter,
        holeDepthSeq: depthScale(h.depth) - nextStartLength,
        startLength: nextStartLength,
      })({ svg });

      // Draw the hole part
      nextStartLength = drawHole({
        diameter: h.diameter,
        depth: h.depth,
        startLength: nextStartLength,
        centerX,
      })({ d3, depthScale, svg });

      // Draw the bottom line of the last hole
      if (inx === transformedHoles.length - 1) {
        drawBottomHoleLine({
          diameter: h.diameter,
          centerX,
          holeDepthSeq: depthScale(h.depth),
        })({ svg });
      }
    });
  };
