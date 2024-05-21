// interface Point {
//   x: number;
//   y: number;
// }

// /**
//  * Clips an array of points by y-value, including calculating intersections with diagonals for minY and maxY.
//  * @param points Array of points that define line segments.
//  * @param minY The minimum y-value of the range.
//  * @param maxY The maximum y-value of the range.
//  * @returns An array of points clipped at minY and maxY, including intersections with diagonals.
//  */
// function clipAndIntersectPoints(
//   points: Point[],
//   minY: number,
//   maxY: number
// ): Point[] {
//   let clippedPoints: Point[] = [];

//   // Check each segment to clip at minY and maxY and calculate diagonal intersections
//   for (let i = 0; i < points.length - 1; i++) {
//     let p1 = points[i];
//     let p2 = points[i + 1];

//     // Include the start point if within bounds and check for intersections with minY and maxY
//     if (p1.y >= minY && p1.y <= maxY) {
//       clippedPoints.push(p1);
//     }

//     // Check each segment for crossing minY
//     if ((p1.y < minY && p2.y >= minY) || (p1.y >= minY && p2.y < minY)) {
//       let xIntersectMin =
//         p1.x + ((minY - p1.y) / (p2.y - p1.y)) * (p2.x - p1.x);
//       clippedPoints.push({ x: xIntersectMin, y: minY });
//     }

//     // Check each segment for crossing maxY
//     if ((p1.y < maxY && p2.y >= maxY) || (p1.y >= maxY && p2.y < maxY)) {
//       let xIntersectMax =
//         p1.x + ((maxY - p1.y) / (p2.y - p1.y)) * (p2.x - p1.x);
//       clippedPoints.push({ x: xIntersectMax, y: maxY });
//     }

//     // Include the end point if within bounds
//     if (p2.y >= minY && p2.y <= maxY) {
//       clippedPoints.push(p2);
//     }
//   }

//   // Remove duplicate points and sort by y to ensure order
//   const uniquePoints = clippedPoints.filter(
//     (point, index, self) =>
//       index === self.findIndex((p) => p.x === point.x && p.y === point.y)
//   );
//   uniquePoints.sort((a, b) => a.y - b.y || a.x - b.x);

//   return uniquePoints;
// }

// // Example usage
// const points: Point[] = [
//   { x: 1, y: 1 },
//   { x: 3, y: 3 },
//   { x: 3, y: 5 },
//   { x: 4, y: 7 }, // Extended example to show maxY clipping
// ];

// const minY = 2;
// const maxY = 4;

// const clippedPoints = clipAndIntersectPoints(points, minY, maxY);
// console.log('Clipped and Intersected Points:', clippedPoints);
