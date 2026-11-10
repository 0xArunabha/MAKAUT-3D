import { CAMPUS_WAYPOINTS, type NavWaypoint } from '../data/navGraph';

export interface RouteResult {
  waypoints: NavWaypoint[];
  pathCoordinates: [number, number, number][];
  totalDistanceMeters: number;
  estimatedMinutes: number;
  instructions: { text: string; distanceMeters: number }[];
}

function distance(p1: [number, number, number], p2: [number, number, number]): number {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  const dz = p1[2] - p2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function findRoute(startId: string, endId: string): RouteResult | null {
  if (!CAMPUS_WAYPOINTS[startId] || !CAMPUS_WAYPOINTS[endId]) return null;
  if (startId === endId) {
    const wp = CAMPUS_WAYPOINTS[startId];
    return {
      waypoints: [wp],
      pathCoordinates: [wp.position],
      totalDistanceMeters: 0,
      estimatedMinutes: 0,
      instructions: [{ text: `You are already at ${wp.name}`, distanceMeters: 0 }]
    };
  }

  const openSet = new Set<string>([startId]);
  const cameFrom = new Map<string, string>();
  
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  Object.keys(CAMPUS_WAYPOINTS).forEach((id) => {
    gScore.set(id, Infinity);
    fScore.set(id, Infinity);
  });

  gScore.set(startId, 0);
  fScore.set(startId, distance(CAMPUS_WAYPOINTS[startId].position, CAMPUS_WAYPOINTS[endId].position));

  while (openSet.size > 0) {
    // Pick node in openSet with lowest fScore
    let current = '';
    let minF = Infinity;
    for (const node of openSet) {
      const f = fScore.get(node) ?? Infinity;
      if (f < minF) {
        minF = f;
        current = node;
      }
    }

    if (current === endId) {
      // Reconstruct path
      const path: NavWaypoint[] = [];
      let currId: string | undefined = current;
      while (currId) {
        path.unshift(CAMPUS_WAYPOINTS[currId]);
        currId = cameFrom.get(currId);
      }

      // Compute distances & instructions
      // Scale: 1 unit ~ 3 meters
      const UNIT_TO_METERS = 3.2;
      let totalDistanceUnits = 0;
      const instructions: { text: string; distanceMeters: number }[] = [];

      for (let i = 0; i < path.length - 1; i++) {
        const segDistUnits = distance(path[i].position, path[i + 1].position);
        totalDistanceUnits += segDistUnits;
        const segMeters = Math.round(segDistUnits * UNIT_TO_METERS);
        
        let direction = 'Head towards';
        if (i === 0) {
          direction = 'Depart from';
        } else if (i === path.length - 2) {
          direction = 'Arrive at';
        }

        instructions.push({
          text: `${direction} ${path[i + 1].name}`,
          distanceMeters: segMeters
        });
      }

      const totalDistanceMeters = Math.round(totalDistanceUnits * UNIT_TO_METERS);
      // Average walking speed ~ 4.5 km/h = 75 meters/minute
      const estimatedMinutes = Math.max(1, Math.round(totalDistanceMeters / 75));

      return {
        waypoints: path,
        pathCoordinates: path.map(w => w.position),
        totalDistanceMeters,
        estimatedMinutes,
        instructions
      };
    }

    openSet.delete(current);
    const currentWp = CAMPUS_WAYPOINTS[current];

    for (const neighborId of currentWp.neighbors) {
      const neighborWp = CAMPUS_WAYPOINTS[neighborId];
      if (!neighborWp) continue;

      const tentativeG = (gScore.get(current) ?? Infinity) + distance(currentWp.position, neighborWp.position);

      if (tentativeG < (gScore.get(neighborId) ?? Infinity)) {
        cameFrom.set(neighborId, current);
        gScore.set(neighborId, tentativeG);
        const h = distance(neighborWp.position, CAMPUS_WAYPOINTS[endId].position);
        fScore.set(neighborId, tentativeG + h);
        openSet.add(neighborId);
      }
    }
  }

  return null;
}

export function getWaypointForBuilding(buildingId: string): NavWaypoint | undefined {
  return Object.values(CAMPUS_WAYPOINTS).find(wp => wp.buildingId === buildingId);
}
