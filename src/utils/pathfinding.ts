import { CAMPUS_WAYPOINTS, type NavWaypoint } from '../data/navGraph';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import { METERS_PER_UNIT, WALKING_SPEED_MPS, type XYZ } from './geo';
import { routeOnRoads } from './roadGraph';
import { buildDirections, type DirectionStep, type Landmark } from './directions';

export type RouteInstruction = DirectionStep;

export interface RouteResult {
  /** The start and end waypoints of the route. */
  waypoints: NavWaypoint[];
  /** Walking path, [x, y, z] points following the campus roads. */
  pathCoordinates: XYZ[];
  totalDistanceMeters: number;
  estimatedMinutes: number;
  /** Turn-by-turn steps; the first is "Depart", the last is "Arrive". */
  instructions: RouteInstruction[];
}

const buildingShortNames = new Map(CAMPUS_BUILDINGS.map((b) => [b.id, b.shortName]));

/** Named places to mention in directions, leaving out the start and end buildings themselves. */
function landmarksExcluding(startWp: NavWaypoint, endWp: NavWaypoint): Landmark[] {
  const skip = new Set([startWp.buildingId, endWp.buildingId]);
  const landmarks: Landmark[] = [];
  for (const wp of Object.values(CAMPUS_WAYPOINTS)) {
    if (!wp.buildingId || skip.has(wp.buildingId)) continue;
    landmarks.push({ name: buildingShortNames.get(wp.buildingId) ?? wp.name, position: wp.position });
  }
  return landmarks;
}

/** Result for "start and end are the same spot": nothing to walk. */
function alreadyThere(startWp: NavWaypoint, endWp: NavWaypoint): RouteResult {
  return {
    waypoints: startWp === endWp ? [startWp] : [startWp, endWp],
    pathCoordinates: [endWp.position],
    totalDistanceMeters: 0,
    estimatedMinutes: 0,
    instructions: [
      {
        text: `You are already at ${endWp.name}`,
        distanceMeters: 0,
        position: endWp.position,
        maneuver: 'arrive',
      },
    ],
  };
}

export function findRoute(startId: string, endId: string): RouteResult | null {
  const startWp = CAMPUS_WAYPOINTS[startId];
  const endWp = CAMPUS_WAYPOINTS[endId];
  if (!startWp || !endWp) return null;
  if (startId === endId) return alreadyThere(startWp, endWp);

  const path = routeOnRoads(startId, endId);
  if (!path) return null;
  // Two different waypoints on exactly the same spot.
  if (path.length < 2) return alreadyThere(startWp, endWp);

  const { steps, totalLength } = buildDirections({
    points: path,
    startName: startWp.name,
    endName: endWp.name,
    landmarks: landmarksExcluding(startWp, endWp),
  });

  const totalDistanceMeters = Math.round(totalLength * METERS_PER_UNIT);
  const estimatedMinutes = Math.max(1, Math.round(totalDistanceMeters / (WALKING_SPEED_MPS * 60)));

  return {
    waypoints: [startWp, endWp],
    pathCoordinates: path,
    totalDistanceMeters,
    estimatedMinutes,
    instructions: steps,
  };
}

/**
 * Which instruction is active at a given progress (0..1) along the route.
 * Steps are weighted by the distance they cover, so a long straight leg stays on
 * its instruction for as long as it takes to walk it.
 */
export function instructionIndexAt(instructions: RouteInstruction[], progress: number): number {
  if (instructions.length === 0) return -1;
  const total = instructions.reduce((sum, step) => sum + step.distanceMeters, 0);
  if (total <= 0) return 0;

  const covered = Math.max(0, Math.min(1, progress)) * total;
  let acc = 0;
  for (let i = 0; i < instructions.length; i++) {
    acc += instructions[i].distanceMeters;
    if (covered < acc) return i;
  }
  return instructions.length - 1;
}

export function getWaypointForBuilding(buildingId: string): NavWaypoint | undefined {
  return Object.values(CAMPUS_WAYPOINTS).find((wp) => wp.buildingId === buildingId);
}
