import D3Node from 'd3-node';

export const getBoundary = () => ({
  x: 15,
  y: 0,
});

export function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

// Define the scale
export const createDepthScale =
  (domain: number[], range: number[]) =>
  ({ d3 }: D3Props) =>
    d3
      .scaleLinear()
      .domain([...domain]) // Depth in meters
      .range([...range]); // SVG pixels

export const createSVG = (width: number, height: number, padding?: number) => {
  // Create an SVG element
  const d3n = new D3Node(); // initializes D3.js on the server
  const d3 = d3n.d3;
  padding = padding || 0;
  return [
    d3n
      .createSVG(width + padding, height + padding)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .append('g') // Append a group element to move everything by padding
      .attr('transform', `translate(${padding}, ${padding})`),
    d3,
    d3n,
  ];
};

export const inchToPixel = (inch: number) => {
  return inch * 5;
};

export const calculateCenterX = (firstHoleDiameter: number) => {
  const boundary = getBoundary();
  const startHoleX = boundary.x;
  const maxHoleWidth = startHoleX + inchToPixel(firstHoleDiameter);
  const centerX = startHoleX + maxHoleWidth / 2;
  return centerX;
};
