interface Edge {
  start: Point;
  end: Point;
}

export interface Obstacle {
  type: 'rectangular' | 'wavy'; // Added to distinguish between obstacle types
  // Properties for rectangular obstacles
  points?: Point[]; // Array of points defining the polygon for rectangular types
  // Properties for wavy line obstacles
  amplitude?: number;
  frequency?: number;
  phaseShift?: number;
  verticalShift?: number;
  startY?: number;
  endY?: number;
  startX?: number;
}
// Calculate the light path, taking into account both regular and wavy obstacles
export function calculateLightPoints(
  segments: Point[],
  obstacles: Obstacle[]
): Point[] {
  let pathPoints: Point[] = [segments[0]];

  for (let i = 0; i < segments.length - 1; i++) {
    let segmentStart = segments[i];
    let segmentEnd = segments[i + 1];
    let currentPoint = segmentStart;
    let direction = {
      x: segmentEnd.x - segmentStart.x,
      y: segmentEnd.y - segmentStart.y,
    };
    let magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    direction.x /= magnitude;
    direction.y /= magnitude;

    let closestIntersection: Point | null = null;
    let minDistance = Infinity;

    obstacles.forEach((obstacle) => {
      if (obstacle.type === 'rectangular') {
        const edges = getObstacleEdges(obstacle);
        edges.forEach((edge) => {
          const intersection = getIntersectionPoint(
            currentPoint,
            direction,
            edge
          );
          if (intersection) {
            const distance = calculateDistanceToPoint(
              currentPoint,
              intersection
            );
            if (distance < minDistance) {
              minDistance = distance;
              closestIntersection = intersection;
            }
          }
        });
      } else if (
        obstacle.type === 'wavy' &&
        obstacle.startY !== undefined &&
        obstacle.endY !== undefined
      ) {
        const wavyIntersection = findIntersectionWithVerticalWavyLine(
          segmentStart,
          direction,
          obstacle,
          obstacle.startY,
          obstacle.endY
        );
        if (wavyIntersection) {
          const distance = calculateDistanceToPoint(
            segmentStart,
            wavyIntersection
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestIntersection = wavyIntersection;
          }
        }
      }
    });

    if (closestIntersection) {
      pathPoints.push(closestIntersection);
      let bendPoint = getBendPoint(
        closestIntersection,
        direction,
        obstacles[0]
      );
      pathPoints.push(bendPoint);
      segmentStart = bendPoint; // Update segmentStart to the new bendPoint for the next iteration
    } else {
      pathPoints.push(segmentEnd);
    }
  }

  return pathPoints;
}

function getObstacleEdges(obstacle: Obstacle): Edge[] {
  let edges: Edge[] = [];
  if (
    obstacle.type === 'rectangular' &&
    obstacle.points &&
    obstacle.points.length > 1
  ) {
    for (let i = 0; i < obstacle.points.length; i++) {
      let startPoint = obstacle.points[i];
      let endPoint = obstacle.points[(i + 1) % obstacle.points.length]; // Connects last point to first
      edges.push({ start: startPoint, end: endPoint });
    }
  }
  return edges;
}

function getIntersectionPoint(
  rayStart: Point,
  rayDirection: Point,
  edge: Edge
): Point | null {
  let a1 = rayDirection.y;
  let b1 = -rayDirection.x;
  let d1 = a1 * rayStart.x + b1 * rayStart.y;

  let a2 = edge.end.y - edge.start.y;
  let b2 = edge.start.x - edge.end.x;
  let d2 = a2 * edge.start.x + b2 * edge.start.y;

  let denom = a1 * b2 - a2 * b1;
  if (denom == 0) {
    return null; // Lines are parallel
  }

  let intersectX = (b2 * d1 - b1 * d2) / denom;
  let intersectY = (a1 * d2 - a2 * d1) / denom;

  // Check if the intersection is within the bounds of the line segment
  if (
    Math.min(edge.start.x, edge.end.x) <= intersectX &&
    intersectX <= Math.max(edge.start.x, edge.end.x) &&
    Math.min(edge.start.y, edge.end.y) <= intersectY &&
    intersectY <= Math.max(edge.start.y, edge.end.y)
  ) {
    return { x: intersectX, y: intersectY };
  }

  return null;
}

function calculateDistanceToPoint(from: Point, to: Point): number {
  return Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2);
}

function findIntersectionWithVerticalWavyLine(
  rayStart: Point,
  rayDirection: Point,
  wavyLine: Obstacle,
  startY: number,
  endY: number
): Point | null {
  let deltaY = (endY - startY) / 1000; // Increment in y-direction, smaller for more precision
  for (let y = startY; y <= endY; y += deltaY) {
    let x = evaluateWavyLine(y, wavyLine);
    if (x < (wavyLine.startX ?? 0)) {
      continue; // Skip this y if the x of the wavy line at y is before the horizontal start
    }
    // Calculate where the ray would be at this y-coordinate
    if (rayDirection.y !== 0) {
      // Avoid division by zero
      let rayXAtY =
        rayStart.x + ((y - rayStart.y) / rayDirection.y) * rayDirection.x;
      if (Math.abs(rayXAtY - x) < 0.01) {
        // Check if close enough to consider as an intersection
        return { x, y };
      }
    }
  }
  return null; // No intersection found
}

function evaluateWavyLine(y: number, wavyLine: Obstacle): number {
  return (
    wavyLine.amplitude! *
      Math.sin(wavyLine.frequency! * (y - wavyLine.phaseShift!)) +
    wavyLine.verticalShift!
  );
}

function getBendPoint(
  intersectionPoint: Point,
  direction: Point,
  obstacle: Obstacle
): Point {
  if (obstacle.type === 'wavy') {
    // Calculate the derivative of the wavy line equation at the intersection point
    const dy_dx =
      obstacle.amplitude! *
      obstacle.frequency! *
      Math.cos(
        obstacle.frequency! * (intersectionPoint.y - obstacle.phaseShift!)
      );
    // Calculate the normal to the curve at the intersection point
    const normal = { x: -dy_dx, y: 1 };
    // Normalize the normal vector
    const normalMagnitude = Math.sqrt(
      normal.x * normal.x + normal.y * normal.y
    );
    normal.x /= normalMagnitude;
    normal.y /= normalMagnitude;
    // Reflect the direction across the normal
    return reflectDirection(direction, normal, intersectionPoint);
  } else {
    // Assuming vertical edges for rectangular obstacles
    const normal = { x: 1, y: 0 };
    return reflectDirection(direction, normal, intersectionPoint);
  }
}

function reflectDirection(
  direction: Point,
  normal: Point,
  intersectionPoint: Point
): Point {
  const dotProduct = direction.x * normal.x + direction.y * normal.y;
  const reflectedDirection = {
    x: direction.x - 2 * dotProduct * normal.x,
    y: direction.y - 2 * dotProduct * normal.y,
  };
  // Calculate a reasonable distance for the next point after reflection
  const reflectionLength = 100; // This can be adjusted based on your simulation scale
  return {
    x: intersectionPoint.x + reflectedDirection.x * reflectionLength,
    y: intersectionPoint.y + reflectedDirection.y * reflectionLength,
  };
}
