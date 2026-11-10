import * as THREE from 'three';
import { REAL_CAMPUS_BOUNDARY } from '../../data/realCampusRoads';
import { TextureGenerator } from './TextureGenerator';

export class EnvironmentBuilder {
  public static buildGround(scene: THREE.Scene): void {
    this.setupGround(scene);
  }

  public static buildFoliageAndFurniture(scene: THREE.Scene, nightLightsGroup: THREE.Group): void {
    this.setupFoliage(scene);
    this.setupStreetFurniture(scene, nightLightsGroup);
  }

  private static setupGround(scene: THREE.Scene) {
    // 1. Campus Ground Terrain Plane (680 x 580m) with procedural PBR Grass
    const grassTex = TextureGenerator.createGrassTexture();
    grassTex.repeat.set(36, 30);
    const grassBump = TextureGenerator.createGrassBumpMap();
    grassBump.repeat.set(36, 30);

    const groundGeo = new THREE.PlaneGeometry(680, 580);
    const groundMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      bumpMap: grassBump,
      bumpScale: 0.05,
      roughness: 0.92,
      metalness: 0.01
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(-70, 0.0, -20);
    ground.receiveShadow = true;
    scene.add(ground);

    // 2. Outer Bengal Landscape Horizon Plane (1600 x 1400m) to blend seamlessly with sky fog
    const outerGrassTex = TextureGenerator.createGrassTexture();
    outerGrassTex.repeat.set(90, 80);
    const outerGeo = new THREE.PlaneGeometry(1600, 1400);
    const outerMat = new THREE.MeshStandardMaterial({
      map: outerGrassTex,
      color: '#346b3b',
      roughness: 0.95,
      metalness: 0.01
    });
    const outerGround = new THREE.Mesh(outerGeo, outerMat);
    outerGround.rotation.x = -Math.PI / 2;
    outerGround.position.set(-70, -0.05, -20);
    outerGround.receiveShadow = true;
    scene.add(outerGround);

    // 3. Realistic Boundary Walls along REAL_CAMPUS_BOUNDARY polygon with concrete texture
    const concreteTex = TextureGenerator.createConcreteTexture();
    const wallMat = new THREE.MeshStandardMaterial({ map: concreteTex, color: '#cbd5e1', roughness: 0.85 });
    const capMat = new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.8 });
    const wallHeight = 2.8;
    const wallThickness = 1.0;

    for (let i = 0; i < REAL_CAMPUS_BOUNDARY.length - 1; i++) {
      const p1 = REAL_CAMPUS_BOUNDARY[i];
      const p2 = REAL_CAMPUS_BOUNDARY[i + 1];

      const dx = p2[0] - p1[0];
      const dz = p2[1] - p1[1];
      const len = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx);

      // Check if this is the East perimeter segment near the Main Gate (X > 130, Z around 41)
      const isEastEntranceSegment = (p1[0] > 130 && p2[0] > 130) || (p1[0] > 130 && p1[1] < 0 && p2[1] > 0);
      
      if (isEastEntranceSegment) {
        // Leave 26-meter open entrance for the Main Gate at Z ≈ 41
        const gateZ = 41;
        const tGate = (gateZ - p1[1]) / dz;
        const gateGapHalf = 13 / len;

        const t1 = Math.max(0, tGate - gateGapHalf);
        const t2 = Math.min(1, tGate + gateGapHalf);

        // Sub-segment 1 (before gate)
        if (t1 > 0.02) {
          const subLen1 = len * t1;
          const subMidX1 = p1[0] + dx * (t1 / 2);
          const subMidZ1 = p1[1] + dz * (t1 / 2);
          this.createWallSegment(scene, subLen1, wallThickness, wallHeight, subMidX1, subMidZ1, angle, wallMat, capMat);
        }

        // Sub-segment 2 (after gate)
        if (t2 < 0.98) {
          const subLen2 = len * (1 - t2);
          const subMidX2 = p1[0] + dx * ((t2 + 1) / 2);
          const subMidZ2 = p1[1] + dz * ((t2 + 1) / 2);
          this.createWallSegment(scene, subLen2, wallThickness, wallHeight, subMidX2, subMidZ2, angle, wallMat, capMat);
        }
      } else {
        const midX = (p1[0] + p2[0]) / 2;
        const midZ = (p1[1] + p2[1]) / 2;
        this.createWallSegment(scene, len, wallThickness, wallHeight, midX, midZ, angle, wallMat, capMat);
      }
    }
  }

  private static createWallSegment(
    scene: THREE.Scene,
    len: number,
    thickness: number,
    height: number,
    x: number,
    z: number,
    angle: number,
    wallMat: THREE.Material,
    capMat: THREE.Material
  ) {
    const wallGroup = new THREE.Group();
    wallGroup.position.set(x, 0, z);
    wallGroup.rotation.y = -angle;

    const wall = new THREE.Mesh(new THREE.BoxGeometry(len, height, thickness), wallMat);
    wall.position.y = height / 2;
    wall.castShadow = true;
    wall.receiveShadow = true;
    wallGroup.add(wall);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(len + 0.1, 0.25, thickness + 0.3), capMat);
    cap.position.y = height + 0.125;
    cap.castShadow = true;
    wallGroup.add(cap);

    scene.add(wallGroup);
  }

  private static setupStreetFurniture(scene: THREE.Scene, nightLightsGroup: THREE.Group) {
    const furnitureGroup = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.6 });
    const lightHeadMat = new THREE.MeshBasicMaterial({ color: '#f8fafc' });
    const solarPanelMat = new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.8 });

    const createStreetlamp = (x: number, z: number, angle = 0) => {
      const lamp = new THREE.Group();
      lamp.position.set(x, 0, z);
      lamp.rotation.y = angle;

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 5.2, 8), poleMat);
      pole.position.y = 2.6;
      lamp.add(pole);

      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 6), poleMat);
      arm.rotation.z = Math.PI / 4;
      arm.position.set(0.6, 5.4, 0);
      lamp.add(arm);

      const lightHead = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.4), lightHeadMat);
      lightHead.position.set(1.2, 5.8, 0);
      lamp.add(lightHead);

      const solar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.8), solarPanelMat);
      solar.rotation.z = -0.2;
      solar.position.set(0, 5.5, 0);
      lamp.add(solar);

      // Night light source
      const lampPoint = new THREE.PointLight('#fef08a', 0.8, 20);
      lampPoint.position.set(x + Math.cos(angle) * 1.2, 5.4, z + Math.sin(angle) * 1.2);
      nightLightsGroup.add(lampPoint);

      furnitureGroup.add(lamp);
    };

    // 1. Entrance Avenue Streetlamps (between Main Gate and Plaza)
    [105, 125, 145].forEach(x => {
      createStreetlamp(x, 34, Math.PI / 2);
      createStreetlamp(x, 48, -Math.PI / 2);
    });

    // 2. Entrance Plaza Perimeter Streetlamps
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
      createStreetlamp(76 + Math.cos(a) * 26, 28 + Math.sin(a) * 26, a + Math.PI);
    }

    // 3. Central Spine Avenue Streetlamps
    for (let z = -60; z <= 90; z += 30) {
      createStreetlamp(2, z, Math.PI / 2);
      createStreetlamp(-8, z, -Math.PI / 2);
    }

    // 4. BioTech & SE Avenue Streetlamps
    createStreetlamp(-15, 105, 0);
    createStreetlamp(70, 135, Math.PI / 2);

    // 5. Classic wooden park benches around the central fountain plaza
    const benchWoodMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.85 });
    const benchLegMat = new THREE.MeshStandardMaterial({ color: '#1e293b' });
    const createBench = (x: number, z: number, angle: number) => {
      const b = new THREE.Group();
      b.position.set(x, 0, z);
      b.rotation.y = angle;

      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.6), benchWoodMat);
      seat.position.y = 0.5;
      b.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.1), benchWoodMat);
      back.position.set(0, 0.85, -0.26);
      b.add(back);

      [-0.9, 0.9].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.5), benchLegMat);
        leg.position.set(lx, 0.25, 0);
        b.add(leg);
      });

      furnitureGroup.add(b);
    };

    createBench(76, 20, 0);
    createBench(76, 36, Math.PI);
    createBench(68, 28, Math.PI / 2);
    createBench(84, 28, -Math.PI / 2);

    scene.add(furnitureGroup);
  }

  private static setupFoliage(scene: THREE.Scene) {
    // 1. Royal Palm Trees along the entrance avenue
    const palmGroup = new THREE.Group();
    const palmTrunkGeo = new THREE.CylinderGeometry(0.18, 0.32, 7.5, 8);
    const palmTrunkMat = new THREE.MeshStandardMaterial({ color: '#78716c', roughness: 0.9 });
    const palmLeafMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.65 });

    const createPalm = (x: number, z: number) => {
      const palm = new THREE.Group();
      palm.position.set(x, 0, z);

      const trunk = new THREE.Mesh(palmTrunkGeo, palmTrunkMat);
      trunk.position.y = 3.75;
      trunk.castShadow = true;
      palm.add(trunk);

      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const frond = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.8, 4), palmLeafMat);
        frond.rotation.z = Math.PI / 3;
        frond.rotation.y = angle;
        frond.position.set(Math.cos(angle) * 1.2, 7.2, Math.sin(angle) * 1.2);
        palm.add(frond);
      }
      palmGroup.add(palm);
    };

    [105, 118, 132, 146].forEach(px => {
      createPalm(px, 33);
      createPalm(px, 49);
    });
    scene.add(palmGroup);

    // 2. Instanced Multi-Variety Broadleaf Canopy Shade Trees throughout campus
    const treeCount = 140;
    const trunkGeo = new THREE.CylinderGeometry(0.28, 0.52, 6.5, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#57534e', roughness: 0.92 });

    // Organic faceted tree crown geometry catching rich sunlight facets
    const crownGeo = new THREE.DodecahedronGeometry(3.6, 1);
    
    // 3 Natural Bengal campus tree foliage color variations (Mango, Banyan/Rain tree, Neem)
    const crownMatMango = new THREE.MeshStandardMaterial({ color: '#14532d', roughness: 0.76, flatShading: true });
    const crownMatRainTree = new THREE.MeshStandardMaterial({ color: '#166534', roughness: 0.72, flatShading: true });
    const crownMatNeem = new THREE.MeshStandardMaterial({ color: '#22c55e', roughness: 0.68, flatShading: true });

    const countPerType = Math.ceil(treeCount / 3);
    const crownMeshMango = new THREE.InstancedMesh(crownGeo, crownMatMango, countPerType);
    const crownMeshRain = new THREE.InstancedMesh(crownGeo, crownMatRainTree, countPerType);
    const crownMeshNeem = new THREE.InstancedMesh(crownGeo, crownMatNeem, countPerType);
    const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);

    trunkMesh.castShadow = true;
    crownMeshMango.castShadow = true;
    crownMeshRain.castShadow = true;
    crownMeshNeem.castShadow = true;

    const dummy = new THREE.Object3D();
    let index = 0;
    let idxMango = 0;
    let idxRain = 0;
    let idxNeem = 0;

    const positions: [number, number][] = [];

    // Along NH-12 eastern boundary
    for (let z = -140; z <= 180; z += 24) {
      positions.push([150, z]);
      positions.push([168, z]);
    }

    // Around Entrance Plaza
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
      positions.push([76 + Math.cos(a) * 30, 28 + Math.sin(a) * 30]);
    }

    // Around Sports Ground
    for (let x = -90; x <= -40; x += 15) {
      positions.push([x, -68]);
      positions.push([x, -15]);
    }

    // Central West and Crescent Perimeter
    for (let z = -70; z <= 80; z += 20) {
      positions.push([12, z]);
      positions.push([-20, z]);
    }

    // Southern sector towards BioTech & Girls' Hostel
    for (let x = -80; x <= 60; x += 22) {
      positions.push([x, 110]);
      positions.push([x, 165]);
    }

    // NW hostel zone
    for (let x = -260; x <= -180; x += 25) {
      positions.push([x, -140]);
      positions.push([x, -210]);
    }

    const validPositions = positions.filter(([tx, tz]) => {
      // Clear Academic Building footprint & forecourt
      if (tx >= -46 && tx <= 16 && tz >= 38 && tz <= 78) return false;
      // Clear Administrative Building footprint
      if (tx >= -42 && tx <= 14 && tz >= -52 && tz <= -12) return false;
      // Clear Central Library footprint
      if (tx >= -26 && tx <= 4 && tz >= -4 && tz <= 20) return false;
      // Clear BioTech circular loop
      if (Math.hypot(tx - (-18.6), tz - 90.2) < 19) return false;
      return true;
    });

    validPositions.slice(0, treeCount).forEach(([x, z], i) => {
      const scale = 0.85 + Math.random() * 0.35;
      dummy.position.set(x, 3.2 * scale, z);
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();
      trunkMesh.setMatrixAt(index, dummy.matrix);

      dummy.position.set(x, 6.8 * scale, z);
      dummy.updateMatrix();

      const type = i % 3;
      if (type === 0 && idxMango < countPerType) {
        crownMeshMango.setMatrixAt(idxMango++, dummy.matrix);
      } else if (type === 1 && idxRain < countPerType) {
        crownMeshRain.setMatrixAt(idxRain++, dummy.matrix);
      } else if (idxNeem < countPerType) {
        crownMeshNeem.setMatrixAt(idxNeem++, dummy.matrix);
      }

      index++;
    });

    trunkMesh.count = index;
    crownMeshMango.count = idxMango;
    crownMeshRain.count = idxRain;
    crownMeshNeem.count = idxNeem;

    trunkMesh.instanceMatrix.needsUpdate = true;
    crownMeshMango.instanceMatrix.needsUpdate = true;
    crownMeshRain.instanceMatrix.needsUpdate = true;
    crownMeshNeem.instanceMatrix.needsUpdate = true;

    scene.add(trunkMesh);
    scene.add(crownMeshMango);
    scene.add(crownMeshRain);
    scene.add(crownMeshNeem);

    // 3. Manicured Boxwood Hedges flanking the Entrance Boulevard (X = 98 to 148)
    const hedgeMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.82, flatShading: true });
    const hedgeGeo = new THREE.BoxGeometry(4.2, 0.9, 0.9);
    for (let hx = 100; hx <= 145; hx += 4.6) {
      const hedgeNorth = new THREE.Mesh(hedgeGeo, hedgeMat);
      hedgeNorth.position.set(hx, 0.45, 36.5);
      hedgeNorth.castShadow = true;
      hedgeNorth.receiveShadow = true;
      scene.add(hedgeNorth);

      const hedgeSouth = new THREE.Mesh(hedgeGeo, hedgeMat);
      hedgeSouth.position.set(hx, 0.45, 45.5);
      hedgeSouth.castShadow = true;
      hedgeSouth.receiveShadow = true;
      scene.add(hedgeSouth);
    }
  }
}
