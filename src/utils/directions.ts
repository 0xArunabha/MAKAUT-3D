import {
  METERS_PER_UNIT,
  bearingDeg,
  cardinalFromBearing,
  dist2D,
  signedTurnDeg,
  type XYZ,
  type XZ,
} from './geo';

export type Maneuver =
  | 'depart'
  | 'arrive'
  | 'slight-left'
  | 'slight-right'
  | 'left'
  | 'right'
  | 'sharp-left'
  | 'sharp-right';

export interface DirectionStep {
  text: string;
  /** Meters to walk before the next step (0 for the final step). */
  distanceMeters: number;
  /** Where this step happens, [x, y, z]; the UI flies the camera here when a step is tapped. */
  position: XYZ;
  maneuver: Maneuver;
}

export interface Landmark {
  name: string;
  position: XYZ;
}

export interface DirectionsInput {
  /** Walking path, [x, y, z] points with no consecutive duplicates. */
  points: XYZ[];
  startName: string;
  endName: string;
  /** Named places used to say where a turn happens ("Turn left near Central Library"). */
  landmarks: Landmark[];
}

/** How far ahead/behind (in world units) the heading is measured, to ignore tiny kinks in the data. */
const LOOK_DISTANCE = 10;
/** Heading changes smaller than this are treated as "keep going". */
const MIN_TURN_DEG = 35;
/** Bends closer together than this are merged into a single turn. */
const MERGE_DISTANCE = 15;
/** Ignore turns this close to the start or end of the route. */
const MIN_LEG = 6;
/** A landmark must be within this distance of a turn to be mentioned. */
const LANDMARK_RADIUS = 30;

const TURN_PHRASE: Record<Exclude<Maneuver, 'depart' | 'arrive'>, string> = {
  'slight-left': 'Bear left',
  'slight-right': 'Bear right',
  left: 'Turn left',
  right: 'Turn right',
  'sharp-left': 'Make a sharp left',
  'sharp-right': 'Make a sharp right',
};

function classifyTurn(angle: number): Exclude<Maneuver, 'depart' | 'arrive'> {
  const size = Math.abs(angle);
  const right = angle > 0;
  if (size < 60) return right ? 'slight-right' : 'slight-left';
  if (size < 135) return right ? 'right' : 'left';
  return right ? 'sharp-right' : 'sharp-left';
}

interface Polyline {
  xz: XZ[];
  /** Distance along the path at each vertex. */
  cum: number[];
  total: number;
  pointAt: (s: number) => XZ;
}

function makePolyline(points: XYZ[]): Polyline {
  const xz: XZ[] = points.map((p) => [p[0], p[2]]);
  const cum: number[] = [0];
  for (let i = 1; i < xz.length; i++) cum.push(cum[i - 1] + dist2D(xz[i - 1], xz[i]));
  const total = cum[cum.length - 1];

  const pointAt = (s: number): XZ => {
    if (s <= 0) return xz[0];
    if (s >= total) return xz[xz.length - 1];
    let i = 1;
    while (cum[i] < s) i++;
    const segLen = cum[i] - cum[i - 1];
    const t = segLen > 0 ? (s - cum[i - 1]) / segLen : 0;
    return [
      xz[i - 1][0] + (xz[i][0] - xz[i - 1][0]) * t,
      xz[i - 1][1] + (xz[i][1] - xz[i - 1][1]) * t,
    ];
  };

  return { xz, cum, total, pointAt };
}

interface Turn {
  /** Distance along the path. */
  s: number;
  /** Vertex index of the sharpest point of the turn. */
  index: number;
  /** Signed heading change in degrees; positive = right. */
  angle: number;
}

function findTurns(line: Polyline): Turn[] {
  const { xz, cum, total, pointAt } = line;

  // Vertices where the heading, measured LOOK_DISTANCE before and after, changes enough.
  const candidates: { i: number; angle: number }[] = [];
  for (let i = 1; i < xz.length - 1; i++) {
    const before = pointAt(cum[i] - LOOK_DISTANCE);
    const after = pointAt(cum[i] + LOOK_DISTANCE);
    const angle = signedTurnDeg(bearingDeg(before, xz[i]), bearingDeg(xz[i], after));
    if (Math.abs(angle) >= MIN_TURN_DEG) candidates.push({ i, angle });
  }

  // Merge neighbouring candidates (one real corner is often several vertices) and
  // re-measure the heading change across the whole bend.
  const turns: Turn[] = [];
  let g = 0;
  while (g < candidates.length) {
    let h = g;
    while (h + 1 < candidates.length && cum[candidates[h + 1].i] - cum[candidates[h].i] <= MERGE_DISTANCE) h++;

    const group = candidates.slice(g, h + 1);
    const peak = group.reduce((a, b) => (Math.abs(b.angle) > Math.abs(a.angle) ? b : a));
    const first = group[0].i;
    const last = group[group.length - 1].i;
    const headingIn = bearingDeg(pointAt(cum[first] - LOOK_DISTANCE), xz[first]);
    const headingOut = bearingDeg(xz[last], pointAt(cum[last] + LOOK_DISTANCE));
    const angle = signedTurnDeg(headingIn, headingOut);

    if (Math.abs(angle) >= MIN_TURN_DEG && cum[peak.i] >= MIN_LEG && total - cum[peak.i] >= MIN_LEG) {
      turns.push({ s: cum[peak.i], index: peak.i, angle });
    }
    g = h + 1;
  }
  return turns;
}

function nearestLandmark(position: XZ, landmarks: Landmark[]): string | null {
  let best: string | null = null;
  let bestDist = LANDMARK_RADIUS;
  for (const lm of landmarks) {
    const d = dist2D(position, [lm.position[0], lm.position[2]]);
    if (d <= bestDist) {
      bestDist = d;
      best = lm.name;
    }
  }
  return best;
}

/**
 * Turn-by-turn steps for a walking path. Turns are detected from the change of
 * heading along the path (not from the number of waypoints), so a route that
 * follows a winding road does not produce a step at every bend.
 */
export function buildDirections(input: DirectionsInput): { steps: DirectionStep[]; totalLength: number } {
  const { points, startName, endName, landmarks } = input;
  const line = makePolyline(points);
  const turns = findTurns(line);

  const departHeading = cardinalFromBearing(bearingDeg(line.xz[0], line.pointAt(LOOK_DISTANCE)));

  interface RawStep {
    s: number;
    text: string;
    position: XYZ;
    maneuver: Maneuver;
  }
  const raw: RawStep[] = [
    {
      s: 0,
      text: `Depart from ${startName}, heading ${departHeading}`,
      position: points[0],
      maneuver: 'depart',
    },
  ];

  for (const turn of turns) {
    const maneuver = classifyTurn(turn.angle);
    const near = nearestLandmark(line.xz[turn.index], landmarks);
    raw.push({
      s: turn.s,
      text: near ? `${TURN_PHRASE[maneuver]} near ${near}` : TURN_PHRASE[maneuver],
      position: points[turn.index],
      maneuver,
    });
  }

  raw.push({
    s: line.total,
    text: `Arrive at ${endName}`,
    position: points[points.length - 1],
    maneuver: 'arrive',
  });

  const steps: DirectionStep[] = raw.map((step, i) => ({
    text: step.text,
    distanceMeters: i === raw.length - 1 ? 0 : Math.round((raw[i + 1].s - step.s) * METERS_PER_UNIT),
    position: step.position,
    maneuver: step.maneuver,
  }));

  return { steps, totalLength: line.total };
}
