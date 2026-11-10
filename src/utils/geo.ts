/**
 * Shared scale + geometry helpers for routing and directions.
 *
 * WORLD UNITS ARE METERS. The campus roads in data/realCampusRoads.ts come from
 * OpenStreetMap projected to local meters, and RoadNetworkBuilder draws them at
 * real widths (7 for campus roads, 15 for the NH-12 trunk road). Keep this at 1
 * unless the scene is ever rescaled.
 */
export const METERS_PER_UNIT = 1;

/** Average walking speed, ~4.5 km/h. Used for time estimates and the walk simulation. */
export const WALKING_SPEED_MPS = 1.25;

export type XZ = [number, number];
export type XYZ = [number, number, number];

/** Straight-line distance on the ground plane, in world units. */
export function dist2D(a: XZ, b: XZ): number {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

/**
 * Compass bearing from `from` to `to` in degrees, clockwise from north.
 * In this scene north is -Z and east is +X (see CameraController.resetHeadingNorth).
 */
export function bearingDeg(from: XZ, to: XZ): number {
  const deg = (Math.atan2(to[0] - from[0], -(to[1] - from[1])) * 180) / Math.PI;
  return (deg + 360) % 360;
}

const CARDINALS = [
  'north',
  'north-east',
  'east',
  'south-east',
  'south',
  'south-west',
  'west',
  'north-west',
] as const;

export function cardinalFromBearing(bearing: number): string {
  return CARDINALS[Math.round(bearing / 45) % 8];
}

/**
 * Signed change of heading from one bearing to another, in (-180, 180].
 * Positive = turning right (clockwise seen from above), negative = turning left.
 */
export function signedTurnDeg(fromBearing: number, toBearing: number): number {
  let delta = (toBearing - fromBearing) % 360;
  if (delta > 180) delta -= 360;
  else if (delta <= -180) delta += 360;
  return delta;
}
