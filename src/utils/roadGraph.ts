import { REAL_CAMPUS_ROADS } from '../data/realCampusRoads';
import { CAMPUS_WAYPOINTS } from '../data/navGraph';
import { dist2D, type XYZ, type XZ } from './geo';

/**
 * Pedestrian routing graph built from the real OpenStreetMap roads that the 3D
 * scene already draws (data/realCampusRoads.ts), so a route follows the roads
 * you can see instead of cutting straight between hand-placed points.
 *
 * Every entry in CAMPUS_WAYPOINTS (building entrances, junctions) is snapped to
 * the nearest point on the road network and linked to it by a straight access
 * path. Only the largest connected piece of the network is used, so any two
 * waypoints are always reachable from each other.
 */

/** NH-12 runs outside the campus and is not a pedestrian route. */
const EXCLUDED_HIGHWAYS = new Set(['trunk']);

/** Steps are slower and not wheelchair friendly: prefer a ramp unless the detour is large. */
const COST_MULTIPLIER: Record<string, number> = { steps: 1.5 };

/** Snap points closer than this to an existing road vertex reuse that vertex. */
const SNAP_EPSILON = 0.05;

/**
 * Road ends from different roads closer than this are joined. The OSM data leaves
 * small gaps (e.g. the plaza steps stop ~3 m short of the ring road), which would
 * otherwise force a long detour between two points a few meters apart.
 */
const GAP_TOLERANCE = 4;

/**
 * Links listed in `neighbors` in navGraph.ts are kept up to this length (in meters), so
 * short hops across plazas, forecourts and the hostel grounds (where OSM has no mapped
 * paths) stay direct. Longer hand-drawn links would cut corners across the campus, so
 * those are left to the road network.
 */
const DIRECT_LINK_MAX = 70;

interface Segment {
  a: number;
  b: number;
  mult: number;
}

interface Edge {
  to: number;
  length: number;
  /** length x cost multiplier; what the search minimises. */
  cost: number;
}

interface RoadGraph {
  nodes: XZ[];
  adjacency: Edge[][];
  /** waypoint id -> the graph node placed at the waypoint's own position. */
  waypointNode: Map<string, number>;
}

let cachedGraph: RoadGraph | null = null;

function buildRoadGraph(): RoadGraph {
  const nodes: XZ[] = [];
  const nodeIndex = new Map<string, number>();
  const getNode = (p: XZ): number => {
    const key = `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
    let id = nodeIndex.get(key);
    if (id === undefined) {
      id = nodes.length;
      nodes.push([p[0], p[1]]);
      nodeIndex.set(key, id);
    }
    return id;
  };

  // 1. Unique undirected segments from every walkable road polyline.
  const segmentMap = new Map<string, Segment>();
  const nodeRoads = new Map<number, Set<number>>(); // node -> ids of the roads that use it
  const segmentKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  for (const road of REAL_CAMPUS_ROADS) {
    if (EXCLUDED_HIGHWAYS.has(road.highway)) continue;
    const mult = COST_MULTIPLIER[road.highway] ?? 1;
    for (let i = 0; i < road.points.length - 1; i++) {
      const a = getNode(road.points[i]);
      const b = getNode(road.points[i + 1]);
      if (a === b) continue;
      for (const n of [a, b]) {
        const roadsAtNode = nodeRoads.get(n) ?? new Set<number>();
        roadsAtNode.add(road.id);
        nodeRoads.set(n, roadsAtNode);
      }
      const key = segmentKey(a, b);
      const existing = segmentMap.get(key);
      if (existing) existing.mult = Math.min(existing.mult, mult);
      else segmentMap.set(key, { a, b, mult });
    }
  }

  // 1b. Join road ends that nearly touch (see GAP_TOLERANCE).
  const roadNodeIds = [...nodeRoads.keys()];
  for (let i = 0; i < roadNodeIds.length; i++) {
    for (let j = i + 1; j < roadNodeIds.length; j++) {
      const a = roadNodeIds[i];
      const b = roadNodeIds[j];
      if (dist2D(nodes[a], nodes[b]) > GAP_TOLERANCE) continue;
      const roadsA = nodeRoads.get(a)!;
      const roadsB = nodeRoads.get(b)!;
      if ([...roadsA].some((id) => roadsB.has(id))) continue; // same road, already linked
      const key = segmentKey(a, b);
      if (!segmentMap.has(key)) segmentMap.set(key, { a, b, mult: 1 });
    }
  }

  // 2. Keep only the largest connected piece (union-find).
  const parent = nodes.map((_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  for (const s of segmentMap.values()) parent[find(s.a)] = find(s.b);

  const touched = new Set<number>();
  for (const s of segmentMap.values()) {
    touched.add(s.a);
    touched.add(s.b);
  }
  const componentSize = new Map<number, number>();
  for (const n of touched) {
    const root = find(n);
    componentSize.set(root, (componentSize.get(root) ?? 0) + 1);
  }
  let mainRoot = -1;
  let mainSize = 0;
  for (const [root, size] of componentSize) {
    if (size > mainSize) {
      mainRoot = root;
      mainSize = size;
    }
  }
  const segments = [...segmentMap.values()].filter((s) => find(s.a) === mainRoot);

  // 3. Snap every waypoint to the nearest point on a segment.
  interface Snap {
    wpId: string;
    segment: number;
    t: number;
    point: XZ;
  }
  const snapsBySegment = new Map<number, Snap[]>();
  for (const wp of Object.values(CAMPUS_WAYPOINTS)) {
    const p: XZ = [wp.position[0], wp.position[2]];
    let best: Snap | null = null;
    let bestDist = Infinity;
    for (let idx = 0; idx < segments.length; idx++) {
      const A = nodes[segments[idx].a];
      const B = nodes[segments[idx].b];
      const dx = B[0] - A[0];
      const dz = B[1] - A[1];
      const len2 = dx * dx + dz * dz;
      const t = Math.max(0, Math.min(1, ((p[0] - A[0]) * dx + (p[1] - A[1]) * dz) / len2));
      const q: XZ = [A[0] + t * dx, A[1] + t * dz];
      const d = dist2D(p, q);
      if (d < bestDist) {
        bestDist = d;
        best = { wpId: wp.id, segment: idx, t, point: q };
      }
    }
    if (best) {
      const list = snapsBySegment.get(best.segment) ?? [];
      list.push(best);
      snapsBySegment.set(best.segment, list);
    }
  }

  // 4. Split each snapped segment at its snap points so waypoints become graph nodes.
  const anchor = new Map<string, number>();
  const finalSegments: Segment[] = [];
  segments.forEach((seg, idx) => {
    const snaps = snapsBySegment.get(idx);
    if (!snaps) {
      finalSegments.push(seg);
      return;
    }
    snaps.sort((x, y) => x.t - y.t);
    let prev = seg.a;
    for (const snap of snaps) {
      let nodeId: number;
      if (dist2D(snap.point, nodes[seg.a]) < SNAP_EPSILON) nodeId = seg.a;
      else if (dist2D(snap.point, nodes[seg.b]) < SNAP_EPSILON) nodeId = seg.b;
      else nodeId = getNode(snap.point);
      anchor.set(snap.wpId, nodeId);
      if (nodeId !== prev) {
        finalSegments.push({ a: prev, b: nodeId, mult: seg.mult });
        prev = nodeId;
      }
    }
    if (prev !== seg.b) finalSegments.push({ a: prev, b: seg.b, mult: seg.mult });
  });

  // 5. Give every waypoint its own node, joined to the road by its access path.
  const waypointNode = new Map<string, number>();
  for (const wp of Object.values(CAMPUS_WAYPOINTS)) {
    const roadNode = anchor.get(wp.id);
    if (roadNode === undefined) continue;
    const id = nodes.length;
    nodes.push([wp.position[0], wp.position[2]]);
    waypointNode.set(wp.id, id);
    finalSegments.push({ a: id, b: roadNode, mult: 1 });
  }

  // 6. Short hand-authored links between neighbouring waypoints (see DIRECT_LINK_MAX),
  // plus waypoints that sit on exactly the same spot.
  const linked = new Set<string>();
  const linkWaypoints = (idA: string, idB: string) => {
    const a = waypointNode.get(idA);
    const b = waypointNode.get(idB);
    if (a === undefined || b === undefined || a === b) return;
    const key = segmentKey(a, b);
    if (linked.has(key)) return;
    linked.add(key);
    finalSegments.push({ a, b, mult: 1 });
  };
  const allWaypoints = Object.values(CAMPUS_WAYPOINTS);
  for (const wp of allWaypoints) {
    for (const neighborId of wp.neighbors) {
      const other = CAMPUS_WAYPOINTS[neighborId];
      if (!other) continue;
      const d = dist2D([wp.position[0], wp.position[2]], [other.position[0], other.position[2]]);
      if (d <= DIRECT_LINK_MAX) linkWaypoints(wp.id, neighborId);
    }
  }
  for (let i = 0; i < allWaypoints.length; i++) {
    for (let j = i + 1; j < allWaypoints.length; j++) {
      const a = allWaypoints[i];
      const b = allWaypoints[j];
      if (dist2D([a.position[0], a.position[2]], [b.position[0], b.position[2]]) <= SNAP_EPSILON) {
        linkWaypoints(a.id, b.id);
      }
    }
  }

  // 7. Adjacency lists.
  const adjacency: Edge[][] = nodes.map(() => []);
  for (const s of finalSegments) {
    const length = dist2D(nodes[s.a], nodes[s.b]);
    const cost = length * s.mult;
    adjacency[s.a].push({ to: s.b, length, cost });
    adjacency[s.b].push({ to: s.a, length, cost });
  }

  return { nodes, adjacency, waypointNode };
}

function getRoadGraph(): RoadGraph {
  if (!cachedGraph) cachedGraph = buildRoadGraph();
  return cachedGraph;
}

/** A* over the road graph. The straight-line heuristic never overestimates, so the result is optimal. */
function shortestNodePath(graph: RoadGraph, from: number, to: number): number[] | null {
  const { nodes, adjacency } = graph;
  const g = new Array<number>(nodes.length).fill(Infinity);
  const f = new Array<number>(nodes.length).fill(Infinity);
  const prev = new Array<number>(nodes.length).fill(-1);
  const open = new Set<number>([from]);
  g[from] = 0;
  f[from] = dist2D(nodes[from], nodes[to]);

  while (open.size > 0) {
    let current = -1;
    let minF = Infinity;
    for (const id of open) {
      if (f[id] < minF) {
        minF = f[id];
        current = id;
      }
    }

    if (current === to) {
      const path: number[] = [];
      for (let n = current; n !== -1; n = prev[n]) path.unshift(n);
      return path;
    }

    open.delete(current);
    for (const edge of adjacency[current]) {
      const tentative = g[current] + edge.cost;
      if (tentative < g[edge.to]) {
        g[edge.to] = tentative;
        prev[edge.to] = current;
        f[edge.to] = tentative + dist2D(nodes[edge.to], nodes[to]);
        open.add(edge.to);
      }
    }
  }
  return null;
}

/**
 * Walking path between two waypoints: the start entrance, along the roads, then the
 * end entrance. Returns [x, y, z] points with consecutive duplicates removed (so a
 * single point if the two waypoints are on the same spot), or null if either id is
 * unknown.
 */
export function routeOnRoads(startId: string, endId: string): XYZ[] | null {
  const graph = getRoadGraph();
  const startWp = CAMPUS_WAYPOINTS[startId];
  const endWp = CAMPUS_WAYPOINTS[endId];
  const from = graph.waypointNode.get(startId);
  const to = graph.waypointNode.get(endId);
  if (!startWp || !endWp || from === undefined || to === undefined) return null;

  const nodePath = shortestNodePath(graph, from, to);
  if (!nodePath) return null;

  const points: XYZ[] = [];
  for (const id of nodePath) {
    const p: XYZ = [graph.nodes[id][0], 0, graph.nodes[id][1]];
    const last = points[points.length - 1];
    if (!last || dist2D([last[0], last[2]], [p[0], p[2]]) > SNAP_EPSILON) points.push(p);
  }
  // Use the waypoints' own coordinates for the two ends (the loop above may have
  // dropped them in favour of a road vertex a few millimetres away).
  points[0] = startWp.position;
  if (points.length > 1) points[points.length - 1] = endWp.position;
  return points;
}
