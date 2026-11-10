import * as THREE from 'three';
import { REAL_CAMPUS_ROADS } from '../data/realCampusRoads';
import { TextureGenerator } from './builders/TextureGenerator';

export class RoadNetworkBuilder {
  public static buildRoads(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'real-road-network';

    const asphaltTex = TextureGenerator.createAsphaltTexture();
    const asphaltBump = TextureGenerator.createAsphaltBumpMap();
    const paverTex = TextureGenerator.createPaverTexture();
    const concreteTex = TextureGenerator.createConcreteTexture();

    // Materials with realistic PBR properties and DoubleSide to ensure full visibility from any angle
    const asphaltDarkMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      bumpMap: asphaltBump,
      bumpScale: 0.04,
      color: '#1e293b',
      roughness: 0.85,
      metalness: 0.08,
      side: THREE.DoubleSide
    });

    const asphaltCampusMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      bumpMap: asphaltBump,
      bumpScale: 0.03,
      color: '#334155',
      roughness: 0.82,
      metalness: 0.06,
      side: THREE.DoubleSide
    });

    const sidewalkMat = new THREE.MeshStandardMaterial({
      map: paverTex,
      color: '#cbd5e1',
      roughness: 0.90,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    const curbMat = new THREE.MeshStandardMaterial({
      map: concreteTex,
      color: '#94a3b8',
      roughness: 0.88,
      side: THREE.DoubleSide
    });

    const walkwayMat = new THREE.MeshStandardMaterial({
      map: paverTex,
      color: '#e2e8f0',
      roughness: 0.80,
      side: THREE.DoubleSide
    });

    const yellowLineMat = new THREE.MeshBasicMaterial({ color: '#f59e0b', side: THREE.DoubleSide });
    const whiteLineMat = new THREE.MeshBasicMaterial({ color: '#f8fafc', side: THREE.DoubleSide });

    REAL_CAMPUS_ROADS.forEach((road) => {
      const pts = road.points;
      if (pts.length < 2) return;

      const isTrunk = road.highway === 'trunk';
      const isWalkway = road.highway === 'pedestrian' || road.highway === 'footway' || road.highway === 'steps';
      const isSteps = road.highway === 'steps';

      // Authentic roadway widths
      const roadWidth = isTrunk ? 15.0 : (isSteps ? 2.6 : (isWalkway ? 3.8 : 7.0));
      const curbWidth = roadWidth + (isWalkway ? 1.0 : 2.0);

      // 1. Sidewalk / Curb base (elevation y = 0.08)
      const curbY = 0.08;
      const curbGeo = RoadNetworkBuilder.createRibbonGeometry(pts, curbWidth, curbY);
      if (curbGeo) {
        const curbMesh = new THREE.Mesh(curbGeo, isWalkway ? curbMat : sidewalkMat);
        curbMesh.receiveShadow = true;
        group.add(curbMesh);
      }

      // 2. Asphalt / Paved surface (elevation y = 0.14 - 0.16)
      const roadY = isWalkway ? 0.16 : 0.14;
      const roadGeo = RoadNetworkBuilder.createRibbonGeometry(pts, roadWidth, roadY);
      if (roadGeo) {
        const rMat = isTrunk ? asphaltDarkMat : (isWalkway ? walkwayMat : asphaltCampusMat);
        const roadMesh = new THREE.Mesh(roadGeo, rMat);
        roadMesh.receiveShadow = true;
        group.add(roadMesh);
      }

      // 3. Centerline for trunk & main avenues (elevation y = 0.17)
      if (isTrunk) {
        const centerLineGeo = RoadNetworkBuilder.createRibbonGeometry(pts, 0.45, 0.175);
        if (centerLineGeo) {
          const centerMesh = new THREE.Mesh(centerLineGeo, yellowLineMat);
          group.add(centerMesh);
        }
      } else if (!isWalkway && pts.length >= 4) {
        const centerLineGeo = RoadNetworkBuilder.createRibbonGeometry(pts, 0.30, 0.165);
        if (centerLineGeo) {
          const centerMesh = new THREE.Mesh(centerLineGeo, whiteLineMat);
          group.add(centerMesh);
        }
      }

      // 4. Smooth circular junction caps at vertices
      pts.forEach(([px, pz]) => {
        const capRadius = (roadWidth / 2) * 0.99;
        const cap = new THREE.Mesh(
          new THREE.CircleGeometry(capRadius, 20),
          isTrunk ? asphaltDarkMat : (isWalkway ? walkwayMat : asphaltCampusMat)
        );
        cap.rotation.x = -Math.PI / 2;
        cap.position.set(px, roadY + 0.003, pz);
        cap.receiveShadow = true;
        group.add(cap);

        // Also add curb cap for smooth rounded corners
        const curbCapRadius = (curbWidth / 2) * 0.99;
        const curbCap = new THREE.Mesh(
          new THREE.CircleGeometry(curbCapRadius, 20),
          isWalkway ? curbMat : sidewalkMat
        );
        curbCap.rotation.x = -Math.PI / 2;
        curbCap.position.set(px, curbY + 0.001, pz);
        curbCap.receiveShadow = true;
        group.add(curbCap);
      });
    });

    // 5. Landscaped Garden Islands inside real loops
    const grassMat = new THREE.MeshStandardMaterial({
      color: '#16a34a',
      roughness: 0.95,
      side: THREE.DoubleSide
    });

    // Entrance Plaza Garden Base
    const plazaLawn = new THREE.Mesh(new THREE.CircleGeometry(24, 32), grassMat);
    plazaLawn.rotation.x = -Math.PI / 2;
    plazaLawn.position.set(76, 0.05, 28);
    plazaLawn.receiveShadow = true;
    group.add(plazaLawn);

    // Plaza Fountain Pedestrian Island
    const fountainIsland = new THREE.Mesh(new THREE.CircleGeometry(6.5, 32), sidewalkMat);
    fountainIsland.rotation.x = -Math.PI / 2;
    fountainIsland.position.set(76, 0.165, 28);
    fountainIsland.receiveShadow = true;
    group.add(fountainIsland);

    // BioTech Semicircle Loop Island
    const biotechLawn = new THREE.Mesh(new THREE.CircleGeometry(8.5, 24), grassMat);
    biotechLawn.rotation.x = -Math.PI / 2;
    biotechLawn.position.set(-18, 0.05, 111);
    biotechLawn.receiveShadow = true;
    group.add(biotechLawn);

    // Staff Quarters Diamond Loop Island
    const staffLawn = new THREE.Mesh(new THREE.CircleGeometry(5.5, 16), grassMat);
    staffLawn.rotation.x = -Math.PI / 2;
    staffLawn.position.set(-128, 0.05, 114);
    staffLawn.receiveShadow = true;
    group.add(staffLawn);

    return group;
  }

  private static createRibbonGeometry(points: [number, number][], width: number, yLevel: number): THREE.BufferGeometry | null {
    const isClosed = Math.hypot(points[0][0] - points[points.length - 1][0], points[0][1] - points[points.length - 1][1]) < 1.0;
    const nPts = isClosed ? points.slice(0, -1) : points;
    const N = nPts.length;
    if (N < 2) return null;

    const vertices: number[] = [];
    const indices: number[] = [];

    const left: [number, number][] = [];
    const right: [number, number][] = [];

    for (let i = 0; i < N; i++) {
      const curr = nPts[i];
      let tX = 0, tZ = 0, miter = 1.0;

      if (isClosed) {
        const prev = nPts[(i - 1 + N) % N];
        const next = nPts[(i + 1) % N];
        const d1X = curr[0] - prev[0], d1Z = curr[1] - prev[1];
        const len1 = Math.hypot(d1X, d1Z) || 1;
        const v1X = d1X / len1, v1Z = d1Z / len1;

        const d2X = next[0] - curr[0], d2Z = next[1] - curr[1];
        const len2 = Math.hypot(d2X, d2Z) || 1;
        const v2X = d2X / len2, v2Z = d2Z / len2;

        const dot = v1X * v2X + v1Z * v2Z;
        tX = v1X + v2X;
        tZ = v1Z + v2Z;
        const tLen = Math.hypot(tX, tZ) || 1;
        tX /= tLen;
        tZ /= tLen;
        miter = Math.min(2.0, Math.sqrt(2 / Math.max(0.1, 1 + dot)));
      } else if (i === 0) {
        const dX = nPts[1][0] - curr[0], dZ = nPts[1][1] - curr[1];
        const len = Math.hypot(dX, dZ) || 1;
        tX = dX / len;
        tZ = dZ / len;
      } else if (i === N - 1) {
        const dX = curr[0] - nPts[N - 2][0], dZ = curr[1] - nPts[N - 2][1];
        const len = Math.hypot(dX, dZ) || 1;
        tX = dX / len;
        tZ = dZ / len;
      } else {
        const prev = nPts[i - 1];
        const next = nPts[i + 1];
        const d1X = curr[0] - prev[0], d1Z = curr[1] - prev[1];
        const len1 = Math.hypot(d1X, d1Z) || 1;
        const v1X = d1X / len1, v1Z = d1Z / len1;

        const d2X = next[0] - curr[0], d2Z = next[1] - curr[1];
        const len2 = Math.hypot(d2X, d2Z) || 1;
        const v2X = d2X / len2, v2Z = d2Z / len2;

        const dot = v1X * v2X + v1Z * v2Z;
        tX = v1X + v2X;
        tZ = v1Z + v2Z;
        const tLen = Math.hypot(tX, tZ) || 1;
        tX /= tLen;
        tZ /= tLen;
        miter = Math.min(2.0, Math.sqrt(2 / Math.max(0.1, 1 + dot)));
      }

      const nX = -tZ;
      const nZ = tX;
      const halfW = (width / 2) * miter;

      left.push([curr[0] + nX * halfW, curr[1] + nZ * halfW]);
      right.push([curr[0] - nX * halfW, curr[1] - nZ * halfW]);
    }

    const uvs: number[] = [];
    let accumDist = 0;

    for (let i = 0; i < N; i++) {
      if (i > 0) {
        accumDist += Math.hypot(nPts[i][0] - nPts[i - 1][0], nPts[i][1] - nPts[i - 1][1]);
      }
      const v = accumDist / 6.0;
      uvs.push(0, v);
      uvs.push(1, v);

      vertices.push(left[i][0], yLevel, left[i][1]);
      vertices.push(right[i][0], yLevel, right[i][1]);
    }

    // CCW triangle winding so normal points straight UP (+Y)
    for (let i = 0; i < N - 1; i++) {
      const v0 = i * 2;
      const v1 = i * 2 + 1;
      const v2 = (i + 1) * 2;
      const v3 = (i + 1) * 2 + 1;

      indices.push(v0, v2, v1);
      indices.push(v1, v2, v3);
    }

    if (isClosed) {
      const v0 = (N - 1) * 2;
      const v1 = (N - 1) * 2 + 1;
      const v2 = 0;
      const v3 = 1;
      indices.push(v0, v2, v1);
      indices.push(v1, v2, v3);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    return geo;
  }
}
