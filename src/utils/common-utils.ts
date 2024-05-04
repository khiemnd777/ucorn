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
  const svg = d3n
    .createSVG(width + padding, height + padding)
    .attr('xmlns', 'http://www.w3.org/2000/svg');
  const defs = svg.append('defs');
  return [
    svg
      .append('g') // Append a group element to move everything by padding
      .attr('transform', `translate(${padding}, ${padding})`),
    d3,
    d3n,
    defs,
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

export const pointsToSVGPath = (
  points: Point[],
  closePath: boolean = false
): string => {
  if (points.length === 0) return ''; // Handle the case of an empty points array

  // Start the path at the first point
  let path = `M ${points[0].x} ${points[0].y}`;

  // Add a line to each subsequent point
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }

  return path + (closePath ? ' Z' : ''); // Returns the SVG path data as a string
};

export const reflectPoints = (
  points: Point[],
  centerX: number,
  direction: 'rtl' | 'ltr' = 'ltr'
): Point[] => {
  return points.map((point) => ({
    x:
      direction === 'rtl'
        ? centerX - (point.x - centerX)
        : 2 * centerX - point.x,
    y: point.y, // Y-coordinate remains the same as only the x-coordinate changes
  }));
};

export const clipAndIntersectPoints = (
  points: Point[],
  minY: number,
  maxY: number
): Point[] => {
  let clippedPoints: Point[] = [];

  // Check each segment to clip at minY and maxY and calculate diagonal intersections
  for (let i = 0; i < points.length - 1; i++) {
    let p1 = points[i];
    let p2 = points[i + 1];

    // Include the start point if within bounds and check for intersections with minY and maxY
    if (p1.y >= minY && p1.y <= maxY) {
      clippedPoints.push(p1);
    }

    // Check each segment for crossing minY
    if ((p1.y < minY && p2.y >= minY) || (p1.y >= minY && p2.y < minY)) {
      let xIntersectMin =
        p1.x + ((minY - p1.y) / (p2.y - p1.y)) * (p2.x - p1.x);
      clippedPoints.push({ x: xIntersectMin, y: minY });
    }

    // Check each segment for crossing maxY
    if ((p1.y < maxY && p2.y >= maxY) || (p1.y >= maxY && p2.y < maxY)) {
      let xIntersectMax =
        p1.x + ((maxY - p1.y) / (p2.y - p1.y)) * (p2.x - p1.x);
      clippedPoints.push({ x: xIntersectMax, y: maxY });
    }

    // Include the end point if within bounds
    if (p2.y >= minY && p2.y <= maxY) {
      clippedPoints.push(p2);
    }
  }

  // Remove duplicate points and sort by y to ensure order
  const uniquePoints = clippedPoints.filter(
    (point, index, self) =>
      index === self.findIndex((p) => p.x === point.x && p.y === point.y)
  );
  uniquePoints.sort((a, b) => a.y - b.y || a.x - b.x);

  return uniquePoints;
};
