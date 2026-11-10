import * as THREE from 'three';
import type { BuilderContext } from './types';

export interface ZoneBuildingsResult {
  fountainSprayMesh: THREE.Mesh;
}

export class ZoneBuildingsBuilder {
  public static buildZoneBuildings(ctx: BuilderContext): ZoneBuildingsResult {
    this.setupActiveFoodSpots(ctx);
    const fountainSprayMesh = this.setupFountainAndVolleyball(ctx);
    this.setupBioTechBuilding(ctx);
    this.setupIndustrialEngineeringDome(ctx);
    this.setupSportsGround(ctx);
    this.setupNorthWestZone(ctx);
    this.setupGirlsHostel(ctx);
    return { fountainSprayMesh };
  }

  private static setupActiveFoodSpots(ctx: BuilderContext): void {
    // 1. Cafe Karigari (Active Canteen & Hangout) at [112, 0, 32]
    const karigariGroup = new THREE.Group();
    karigariGroup.position.set(112, 0, 32);
    karigariGroup.name = 'bldg-karigari';

    const cafeWall = new THREE.MeshStandardMaterial({ color: '#fffbeb', roughness: 0.8 });
    const orangeAccent = new THREE.MeshStandardMaterial({ color: '#ea580c', roughness: 0.6 });
    const glassMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.2, metalness: 0.8 });
    const deckMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.9 });

    // Cafe wooden deck foundation
    const deck = new THREE.Mesh(new THREE.PlaneGeometry(16, 15), deckMat);
    deck.rotation.x = -Math.PI / 2;
    deck.position.set(0, 0.08, 2);
    deck.receiveShadow = true;
    karigariGroup.add(deck);

    // Cafe Main Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(12, 5.5, 9.5), cafeWall);
    body.position.y = 2.75;
    body.castShadow = true;
    karigariGroup.add(body);

    // Sloped Terracotta Awning
    const awning = new THREE.Mesh(new THREE.BoxGeometry(13.5, 0.4, 4.2), orangeAccent);
    awning.position.set(0, 4.9, 5.8);
    awning.rotation.x = 0.22;
    awning.castShadow = true;
    karigariGroup.add(awning);

    // Glazed Order Counter & Window
    const storefront = new THREE.Mesh(new THREE.BoxGeometry(10, 3.2, 0.2), glassMat);
    storefront.position.set(0, 2.6, 4.8);
    karigariGroup.add(storefront);

    // Outdoor Garden Cafe Seating (Round tables + Chairs + Sun Umbrellas)
    const umbrellaMat = new THREE.MeshStandardMaterial({ color: '#ea580c' });
    const tableMat = new THREE.MeshStandardMaterial({ color: '#78350f' });
    const uPoleMat = new THREE.MeshStandardMaterial({ color: '#71717a' });

    [[-4.5, 7.5], [4.5, 7.5]].forEach(([ux, uz]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2), uPoleMat);
      pole.position.set(ux, 1.6, uz);
      karigariGroup.add(pole);

      const umbrella = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.1, 16), umbrellaMat);
      umbrella.position.set(ux, 3.0, uz);
      karigariGroup.add(umbrella);

      const table = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.1, 16), tableMat);
      table.position.set(ux, 1.0, uz);
      table.castShadow = true;
      karigariGroup.add(table);
    });

    karigariGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-karigari', isBuilding: true };
    });
    ctx.scene.add(karigariGroup);
    ctx.buildingMeshes.set('bldg-karigari', karigariGroup);
    ctx.createBuildingLabel('bldg-karigari', 'CAFE KARIGARI (OPEN)', [112, 9.5, 32]);

    // 2. Hydrogen Eatery (Active Snacks & Tea Spot) at [110, 0, 10]
    const hydrogenGroup = new THREE.Group();
    hydrogenGroup.position.set(110, 0, 10);
    hydrogenGroup.name = 'bldg-hydrogen';

    const hBody = new THREE.Mesh(new THREE.BoxGeometry(11, 4.8, 8.5), cafeWall);
    hBody.position.y = 2.4;
    hBody.castShadow = true;
    hydrogenGroup.add(hBody);

    const hRoof = new THREE.Mesh(new THREE.BoxGeometry(11.8, 0.8, 9.2), orangeAccent);
    hRoof.position.y = 5.2;
    hRoof.castShadow = true;
    hydrogenGroup.add(hRoof);

    // Blue fast-service counter
    const hatch = new THREE.Mesh(
      new THREE.BoxGeometry(7, 1.4, 0.8),
      new THREE.MeshStandardMaterial({ color: '#2563eb' })
    );
    hatch.position.set(0, 1.4, 4.4);
    hydrogenGroup.add(hatch);

    hydrogenGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-hydrogen', isBuilding: true };
    });
    ctx.scene.add(hydrogenGroup);
    ctx.buildingMeshes.set('bldg-hydrogen', hydrogenGroup);
    ctx.createBuildingLabel('bldg-hydrogen', 'HYDROGEN (OPEN)', [110, 8.5, 10]);
  }

  private static setupFountainAndVolleyball(ctx: BuilderContext): THREE.Mesh {
    // =========================================================================
    // 1. MAKAUT Fountain & Central Plaza (Center of Plaza loop at [76, 0.05, 28.5])
    // Authentic Photos: 48m x 48m Square Park, Center 16m Aggregate Terrazzo Basin,
    // Green Water Pool, Vintage Black Lantern Poles, Yucca Landscaping & Student Benches
    // =========================================================================
    const fountainGroup = new THREE.Group();
    fountainGroup.position.set(76, 0.05, 28.5);
    fountainGroup.name = 'bldg-fountain';

    const lawnMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.95 });
    const curbMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.7 });
    const walkMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.85 }); // Warm golden-tan paver stones
    const terrazzoMat = new THREE.MeshStandardMaterial({ color: '#c4976a', roughness: 0.85 }); // Authentic pebble terrazzo (photo 2)
    const greenWaterMat = new THREE.MeshStandardMaterial({
      color: '#047857', // Authentic calm green-teal pool
      roughness: 0.1,
      metalness: 0.6,
      transparent: true,
      opacity: 0.95
    });
    const lanternMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.4, metalness: 0.8 });
    const lampGlowMat = new THREE.MeshBasicMaterial({ color: '#fef08a' });
    const agaveMat = new THREE.MeshStandardMaterial({ color: '#065f46', roughness: 0.8 });
    const benchMetal = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.5 });
    const benchWood = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.75 });

    // 48m x 48m Square Landscaped Park Base
    const squarePark = new THREE.Mesh(new THREE.PlaneGeometry(48, 48), lawnMat);
    squarePark.rotation.x = -Math.PI / 2;
    squarePark.position.y = 0.02;
    squarePark.receiveShadow = true;
    fountainGroup.add(squarePark);

    // Perimeter white stone curb around the square park
    const curbGeo = new THREE.BoxGeometry(48.4, 0.18, 0.6);
    const cNorth = new THREE.Mesh(curbGeo, curbMat);
    cNorth.position.set(0, 0.09, -24);
    fountainGroup.add(cNorth);

    const cSouth = new THREE.Mesh(curbGeo, curbMat);
    cSouth.position.set(0, 0.09, 24);
    fountainGroup.add(cSouth);

    const cWest = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 48.4), curbMat);
    cWest.position.set(-24, 0.09, 0);
    fountainGroup.add(cWest);

    const cEast = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 48.4), curbMat);
    cEast.position.set(24, 0.09, 0);
    fountainGroup.add(cEast);

    // --- 4 CARDINAL RADIAL PROMENADES (Stamped golden-tan paver stones seen in photo 2!) ---
    const walkN = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 16), walkMat);
    walkN.rotation.x = -Math.PI / 2;
    walkN.position.set(0, 0.04, -16);
    walkN.receiveShadow = true;
    fountainGroup.add(walkN);

    const walkS = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 16), walkMat);
    walkS.rotation.x = -Math.PI / 2;
    walkS.position.set(0, 0.04, 16);
    walkS.receiveShadow = true;
    fountainGroup.add(walkS);

    const walkW = new THREE.Mesh(new THREE.PlaneGeometry(16, 3.6), walkMat);
    walkW.rotation.x = -Math.PI / 2;
    walkW.position.set(-16, 0.04, 0);
    walkW.receiveShadow = true;
    fountainGroup.add(walkW);

    const walkE = new THREE.Mesh(new THREE.PlaneGeometry(16, 3.6), walkMat);
    walkE.rotation.x = -Math.PI / 2;
    walkE.position.set(16, 0.04, 0);
    walkE.receiveShadow = true;
    fountainGroup.add(walkE);

    // --- CIRCULAR PROMENADE AROUND THE FOUNTAIN ---
    const ringWalkGeo = new THREE.RingGeometry(8.2, 11.2, 36);
    const ringWalk = new THREE.Mesh(ringWalkGeo, walkMat);
    ringWalk.rotation.x = -Math.PI / 2;
    ringWalk.position.y = 0.04;
    ringWalk.receiveShadow = true;
    fountainGroup.add(ringWalk);

    // --- CENTERPIECE CIRCULAR FOUNTAIN BASIN (Authentic Pebble-Dash Terrazzo!) ---
    // Outer pebble-dash coping wall (Seen in ground photo 2!)
    const basinCoping = new THREE.Mesh(new THREE.CylinderGeometry(8.2, 8.4, 0.85, 36), terrazzoMat);
    basinCoping.position.y = 0.42;
    basinCoping.castShadow = true;
    fountainGroup.add(basinCoping);

    // Green-Teal Calm Water Pool
    const pool = new THREE.Mesh(new THREE.CircleGeometry(7.6, 36), greenWaterMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.68;
    fountainGroup.add(pool);

    // Center Tiered Pedestal in matching stone
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 1.4, 24), terrazzoMat);
    pedestal.position.y = 1.35;
    pedestal.castShadow = true;
    fountainGroup.add(pedestal);

    const upperTier = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 0.4, 24), terrazzoMat);
    upperTier.position.y = 2.05;
    fountainGroup.add(upperTier);

    const sprayGeo = new THREE.ConeGeometry(1.6, 2.2, 16, 1, true);
    const sprayMat = new THREE.MeshBasicMaterial({
      color: '#e0f2fe',
      transparent: true,
      opacity: 0.75,
      wireframe: true
    });
    const fountainSprayMesh = new THREE.Mesh(sprayGeo, sprayMat);
    fountainSprayMesh.position.y = 3.1;
    fountainGroup.add(fountainSprayMesh);

    // --- 8 VINTAGE BLACK LANTERN POSTS ALONG THE WALKWAY (Seen in photo 2!) ---
    for (let lp = 0; lp < 8; lp++) {
      const lpAngle = (lp / 8) * Math.PI * 2 + Math.PI / 8;
      const lx = Math.cos(lpAngle) * 11.8;
      const lz = Math.sin(lpAngle) * 11.8;

      const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 2.6, 8), lanternMat);
      lampPole.position.set(lx, 1.3, lz);
      lampPole.castShadow = true;
      fountainGroup.add(lampPole);

      // Vintage lantern head
      const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.4), lampGlowMat);
      lampHead.position.set(lx, 2.7, lz);
      fountainGroup.add(lampHead);

      const lampCap = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.25, 4), lanternMat);
      lampCap.position.set(lx, 3.05, lz);
      lampCap.rotation.y = Math.PI / 4;
      fountainGroup.add(lampCap);
    }

    // --- 8 PERIMETER PALM TREES ALONG THE CIRCULAR PROMENADE ---
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9 });
    const frondMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.7 });

    for (let p = 0; p < 8; p++) {
      const pAngle = (p / 8) * Math.PI * 2;
      const px = Math.cos(pAngle) * 13.5;
      const pz = Math.sin(pAngle) * 13.5;

      const pGroup = new THREE.Group();
      pGroup.position.set(px, 0, pz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 4.2, 8), trunkMat);
      trunk.position.y = 2.1;
      trunk.rotation.z = (Math.random() - 0.5) * 0.12;
      trunk.castShadow = true;
      pGroup.add(trunk);

      for (let f = 0; f < 6; f++) {
        const fAngle = (f / 6) * Math.PI * 2;
        const frond = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.35, 5), frondMat);
        frond.position.set(Math.cos(fAngle) * 0.8, 4.2, Math.sin(fAngle) * 0.8);
        frond.rotation.x = 0.5 * Math.sin(fAngle);
        frond.rotation.z = -0.5 * Math.cos(fAngle);
        pGroup.add(frond);
      }

      fountainGroup.add(pGroup);
    }

    // --- STUDENT PARK BENCHES (Seen in photos 1, 2, 3 where students sit!) ---
    [
      [-15, 0, -10, 0.4],
      [-15, 0, 10, -0.4],
      [15, 0, -10, 2.7],
      [15, 0, 10, -2.7]
    ].forEach(([bx, by, bz, rot]) => {
      const bench = new THREE.Group();
      bench.position.set(bx, by, bz);
      bench.rotation.y = rot;

      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.7), benchWood);
      seat.position.y = 0.5;
      seat.castShadow = true;
      bench.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.08), benchWood);
      back.position.set(0, 0.8, -0.32);
      bench.add(back);

      [-1.0, 1.0].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.6), benchMetal);
        leg.position.set(lx, 0.25, 0);
        bench.add(leg);
      });

      fountainGroup.add(bench);
    });

    // --- AGAVE / YUCCA ARCHITECTURAL PLANTS (Seen in ground photo 2!) ---
    [[-16, -16], [16, -16], [-16, 16], [16, 16]].forEach(([ax, az]) => {
      const plantGroup = new THREE.Group();
      plantGroup.position.set(ax, 0, az);

      for (let l = 0; l < 8; l++) {
        const lAngle = (l / 8) * Math.PI * 2;
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.2, 4), agaveMat);
        leaf.position.set(Math.cos(lAngle) * 0.4, 0.6, Math.sin(lAngle) * 0.4);
        leaf.rotation.x = 0.5 * Math.sin(lAngle);
        leaf.rotation.z = -0.5 * Math.cos(lAngle);
        plantGroup.add(leaf);
      }
      fountainGroup.add(plantGroup);
    });

    fountainGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-fountain', isBuilding: true };
    });
    ctx.scene.add(fountainGroup);
    ctx.buildingMeshes.set('bldg-fountain', fountainGroup);
    ctx.createBuildingLabel('bldg-fountain', 'MAKAUT FOUNTAIN (CLOSED)', [76, 7.5, 28.5]);

    // =========================================================================
    // 2. Volleyball Court MAKAUT (Directly south of the plaza loop at [73, 0.05, 72])
    // Authentic Satellite: Regulation sand/clay court, white chalk lines, net
    // =========================================================================
    const vbGroup = new THREE.Group();
    vbGroup.position.set(73, 0.05, 72);
    vbGroup.name = 'bldg-volleyball';

    // Sandy-tan playing ground
    const court = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 14),
      new THREE.MeshStandardMaterial({ color: '#d4b896', roughness: 0.95 })
    );
    court.rotation.x = -Math.PI / 2;
    court.receiveShadow = true;
    vbGroup.add(court);

    // White court boundary lines
    const lineMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const courtLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(18, 9)),
      lineMat
    );
    courtLines.rotation.x = -Math.PI / 2;
    courtLines.position.y = 0.02;
    vbGroup.add(courtLines);

    // Center 3m attack lines
    [-3, 3].forEach(lx => {
      const attackLine = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 9), lineMat);
      attackLine.rotation.x = -Math.PI / 2;
      attackLine.position.set(lx, 0.02, 0);
      vbGroup.add(attackLine);
    });

    // Volleyball Net with black mesh and white top band
    const net = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.0, 9.6),
      new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.6 })
    );
    net.position.set(0, 1.95, 0);
    vbGroup.add(net);

    const netTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.12, 9.8),
      new THREE.MeshStandardMaterial({ color: '#ffffff' })
    );
    netTop.position.set(0, 2.45, 0);
    vbGroup.add(netTop);

    // Caution Yellow Support Posts
    const postMat = new THREE.MeshStandardMaterial({ color: '#eab308', metalness: 0.5 });
    [-5.0, 5.0].forEach(pz => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.6, 12), postMat);
      post.position.set(0, 1.3, pz);
      post.castShadow = true;
      vbGroup.add(post);
    });

    // Sideline spectator benches
    const vbBenchWood = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.8 });
    [-8, 8].forEach(bx => {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 4.5), vbBenchWood);
      bench.position.set(bx, 0.25, 8.5);
      bench.castShadow = true;
      vbGroup.add(bench);
    });

    vbGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-volleyball', isBuilding: true };
    });
    ctx.scene.add(vbGroup);
    ctx.buildingMeshes.set('bldg-volleyball', vbGroup);
    ctx.createBuildingLabel('bldg-volleyball', 'VOLLEYBALL COURT', [73, 5.5, 72]);
    return fountainSprayMesh;
  }

  private static setupNorthWestZone(ctx: BuilderContext): void {
    // =========================================================================
    // 1. Power Sub Station (MAKAUT) (Extreme NW corner: [-285, 0, -210])
    // Authentic Satellite: L-shaped compound, concrete pad, control room & transformers
    // =========================================================================
    const subGroup = new THREE.Group();
    subGroup.position.set(-285, 0, -210);
    subGroup.name = 'bldg-substation';

    // Switchyard concrete ground pad
    const subPadMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.9 });
    const subPad = new THREE.Mesh(new THREE.BoxGeometry(26, 0.15, 22), subPadMat);
    subPad.position.set(0, 0.08, 0);
    subPad.receiveShadow = true;
    subGroup.add(subPad);

    // Perimeter Security Wall with Entrance (L-shaped enclosing walls as seen in satellite)
    const subWallMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.85 });
    const wNorth = new THREE.Mesh(new THREE.BoxGeometry(26, 2.4, 0.4), subWallMat);
    wNorth.position.set(0, 1.2, -10.8);
    wNorth.castShadow = true;
    subGroup.add(wNorth);

    const wWest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.4, 22), subWallMat);
    wWest.position.set(-12.8, 1.2, 0);
    wWest.castShadow = true;
    subGroup.add(wWest);

    const wSouth = new THREE.Mesh(new THREE.BoxGeometry(16, 2.4, 0.4), subWallMat);
    wSouth.position.set(-4.8, 1.2, 10.8);
    wSouth.castShadow = true;
    subGroup.add(wSouth);

    // Control Room Building
    const subBuilding = new THREE.Mesh(
      new THREE.BoxGeometry(11, 4.8, 8),
      new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.8 })
    );
    subBuilding.position.set(-6, 2.4, -5);
    subBuilding.castShadow = true;
    subBuilding.receiveShadow = true;
    subGroup.add(subBuilding);

    const subParapet = new THREE.Mesh(
      new THREE.BoxGeometry(11.4, 0.6, 8.4),
      new THREE.MeshStandardMaterial({ color: '#64748b' })
    );
    subParapet.position.set(-6, 4.9, -5);
    subGroup.add(subParapet);

    // High-Voltage Transformers with Cooling Fins & Ceramic Bushings
    const tfMat = new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.35 });
    const radiatorMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.5 });
    const insulatorMat = new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.3 });

    [[-3, 4], [4, 4]].forEach(([tx, tz]) => {
      const tfTank = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.8, 3.2), tfMat);
      tfTank.position.set(tx, 1.9, tz);
      tfTank.castShadow = true;
      subGroup.add(tfTank);

      const radL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 2.6), radiatorMat);
      radL.position.set(tx - 2.0, 1.8, tz);
      subGroup.add(radL);
      const radR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 2.6), radiatorMat);
      radR.position.set(tx + 2.0, 1.8, tz);
      subGroup.add(radR);

      [-0.9, 0, 0.9].forEach(bx => {
        const bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 1.2, 8), insulatorMat);
        bushing.position.set(tx + bx, 4.4, tz);
        subGroup.add(bushing);
      });
    });

    // Steel Gantry Frame / Busbars
    const steelMat = new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.7, roughness: 0.3 });
    const gantry = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 0.4), steelMat);
    gantry.position.set(2, 6.2, 4);
    subGroup.add(gantry);
    [-4, 8].forEach(gx => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 6.2, 8), steelMat);
      pole.position.set(gx, 3.1, 4);
      subGroup.add(pole);
    });

    subGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-substation', isBuilding: true };
    });
    ctx.scene.add(subGroup);
    ctx.buildingMeshes.set('bldg-substation', subGroup);
    ctx.createBuildingLabel('bldg-substation', 'POWER SUB STATION (MAKAUT)', [-285, 10, -210]);

    // =========================================================================
    // 2. MAKAUT Boys' Hostel (North-West: [-222, 0, -183])
    // Authentic Google Maps Satellite Architecture:
    // - Slanted North-West Spine Wing
    // - Central Elevator/Stair Tower & Core
    // - North-East Wing
    // - South-West Wing with 6 Large Photovoltaic Solar Arrays
    // - South-East Wing with Stepped/Corrugated Facade Window Bays
    // - Internal Courtyard with Lawn, Walkways & Mature Trees
    // =========================================================================
    const boysHostelGroup = new THREE.Group();
    boysHostelGroup.position.set(-222, 0, -183);
    boysHostelGroup.name = 'bldg-hostel-boys';

    const hostelWallMat = new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.85 });
    const hostelAccentMat = new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.7 });
    const hostelParapetMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.75 });
    const windowMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.2, metalness: 0.6 });
    const solarCellMat = new THREE.MeshStandardMaterial({ color: '#1e3a8a', roughness: 0.15, metalness: 0.85 });
    const solarFrameMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.4, metalness: 0.6 });
    const tankMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.6 });

    // 2.1 Central Junction & Core Tower
    const coreMesh = new THREE.Mesh(new THREE.BoxGeometry(16, 18.5, 15), hostelWallMat);
    coreMesh.position.set(4, 9.25, -10);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    boysHostelGroup.add(coreMesh);

    const coreParapet = new THREE.Mesh(new THREE.BoxGeometry(16.4, 0.8, 15.4), hostelParapetMat);
    coreParapet.position.set(4, 18.65, -10);
    boysHostelGroup.add(coreParapet);

    // Elevator machine penthouse
    const penthouse = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.6, 6.5), hostelAccentMat);
    penthouse.position.set(4, 20.4, -10);
    penthouse.castShadow = true;
    boysHostelGroup.add(penthouse);

    // Penthouse water storage tanks
    [-1.4, 1.4].forEach(tx => {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.8, 16), tankMat);
      tank.position.set(4 + tx, 23.1, -10);
      tank.castShadow = true;
      boysHostelGroup.add(tank);
    });

    // 2.2 North-West Slanted Spine Wing (angled -24 degrees)
    const nwWingGroup = new THREE.Group();
    nwWingGroup.position.set(-14, 8.75, -18);
    nwWingGroup.rotation.y = -0.42;

    const nwWing = new THREE.Mesh(new THREE.BoxGeometry(32, 17.5, 13), hostelWallMat);
    nwWing.castShadow = true;
    nwWing.receiveShadow = true;
    nwWingGroup.add(nwWing);

    const nwParapet = new THREE.Mesh(new THREE.BoxGeometry(32.4, 0.8, 13.4), hostelParapetMat);
    nwParapet.position.y = 8.9;
    nwWingGroup.add(nwParapet);

    // Fenestration window bands along NW wing
    [-4.5, -0.5, 3.5, 6.8].forEach(wy => {
      const winFront = new THREE.Mesh(new THREE.BoxGeometry(30, 1.3, 0.3), windowMat);
      winFront.position.set(0, wy, 6.55);
      nwWingGroup.add(winFront);
      const winBack = new THREE.Mesh(new THREE.BoxGeometry(30, 1.3, 0.3), windowMat);
      winBack.position.set(0, wy, -6.55);
      nwWingGroup.add(winBack);
    });

    // Rooftop tanks on NW wing
    [-8, 0, 8].forEach(tx => {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.6, 16), tankMat);
      tank.position.set(tx, 9.9, 0);
      tank.castShadow = true;
      nwWingGroup.add(tank);
    });
    boysHostelGroup.add(nwWingGroup);

    // 2.3 North-East Wing (east of core)
    const neWing = new THREE.Mesh(new THREE.BoxGeometry(16, 17.5, 12), hostelWallMat);
    neWing.position.set(18, 8.75, -8);
    neWing.castShadow = true;
    neWing.receiveShadow = true;
    boysHostelGroup.add(neWing);

    const neParapet = new THREE.Mesh(new THREE.BoxGeometry(16.4, 0.8, 12.4), hostelParapetMat);
    neParapet.position.set(18, 17.65, -8);
    boysHostelGroup.add(neParapet);

    [-4.5, -0.5, 3.5, 6.8].forEach(wy => {
      const winNE = new THREE.Mesh(new THREE.BoxGeometry(14, 1.3, 0.3), windowMat);
      winNE.position.set(18, wy + 8.75, -1.9);
      boysHostelGroup.add(winNE);
    });

    // 2.4 South-West Wing (West Courtyard Wing with 6 Solar Arrays)
    const swWing = new THREE.Mesh(new THREE.BoxGeometry(13.5, 17.5, 32), hostelWallMat);
    swWing.position.set(-15, 8.75, 10);
    swWing.castShadow = true;
    swWing.receiveShadow = true;
    boysHostelGroup.add(swWing);

    const swParapet = new THREE.Mesh(new THREE.BoxGeometry(13.9, 0.8, 32.4), hostelParapetMat);
    swParapet.position.set(-15, 17.65, 10);
    boysHostelGroup.add(swParapet);

    // Windows on SW wing (outer and courtyard faces)
    [-4.5, -0.5, 3.5, 6.8].forEach(wy => {
      const winWest = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.3, 28), windowMat);
      winWest.position.set(-21.8, wy + 8.75, 10);
      boysHostelGroup.add(winWest);
      const winEast = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.3, 28), windowMat);
      winEast.position.set(-8.2, wy + 8.75, 10);
      boysHostelGroup.add(winEast);
    });

    // 6 Large Photovoltaic Solar Arrays on SW Wing Rooftop (2x3 Grid from Satellite)
    [-17.5, -12.5].forEach(sx => {
      [-2, 6, 14].forEach(sz => {
        // Solar support frame
        const frame = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.4, 5.2), solarFrameMat);
        frame.position.set(sx, 18.2, sz);
        boysHostelGroup.add(frame);

        // Tilted PV solar panel slab
        const panel = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.15, 5.0), solarCellMat);
        panel.position.set(sx, 18.5, sz);
        panel.rotation.x = 0.26; // Tilted ~15 degrees toward south
        panel.castShadow = true;
        boysHostelGroup.add(panel);
      });
    });

    // 2.5 South-East Wing (East Courtyard Wing with Stepped Window Bays)
    const seWingGroup = new THREE.Group();
    seWingGroup.position.set(15, 8.75, 12);
    seWingGroup.rotation.y = 0.16; // Canted slightly outward

    const seWing = new THREE.Mesh(new THREE.BoxGeometry(12.5, 17.5, 34), hostelWallMat);
    seWing.castShadow = true;
    seWing.receiveShadow = true;
    seWingGroup.add(seWing);

    const seParapet = new THREE.Mesh(new THREE.BoxGeometry(12.9, 0.8, 34.4), hostelParapetMat);
    seParapet.position.y = 8.9;
    seWingGroup.add(seParapet);

    // Corrugated / Stepped Window Bay Fins (matches distinct shadow lines on satellite photo)
    for (let zf = -14; zf <= 14; zf += 5.6) {
      // East projecting bay
      const bayEast = new THREE.Mesh(new THREE.BoxGeometry(1.0, 15, 2.4), hostelAccentMat);
      bayEast.position.set(6.4, 0, zf);
      bayEast.castShadow = true;
      seWingGroup.add(bayEast);

      // Courtyard-facing projecting bay
      const bayWest = new THREE.Mesh(new THREE.BoxGeometry(1.0, 15, 2.4), hostelAccentMat);
      bayWest.position.set(-6.4, 0, zf);
      bayWest.castShadow = true;
      seWingGroup.add(bayWest);
    }

    // Rooftop water storage tanks on SE Wing
    [-6, 6].forEach(tz => {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.8, 16), tankMat);
      tank.position.set(0, 9.9, tz);
      tank.castShadow = true;
      seWingGroup.add(tank);
    });
    boysHostelGroup.add(seWingGroup);

    // 2.6 Internal Courtyard Garden with Lawn, Criss-Cross Pathways & Trees
    const lawnMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.9 });
    const pathMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.85 });

    const courtLawn = new THREE.Mesh(new THREE.BoxGeometry(18, 0.08, 28), lawnMat);
    courtLawn.position.set(0, 0.04, 10);
    courtLawn.receiveShadow = true;
    boysHostelGroup.add(courtLawn);

    // East-West connector walkway
    const pathTrans = new THREE.Mesh(new THREE.BoxGeometry(18, 0.1, 2.2), pathMat);
    pathTrans.position.set(0, 0.06, 6);
    boysHostelGroup.add(pathTrans);

    // Diagonal walkway across courtyard
    const pathDiag = new THREE.Mesh(new THREE.BoxGeometry(22, 0.1, 2.0), pathMat);
    pathDiag.position.set(0, 0.06, 14);
    pathDiag.rotation.y = 0.28;
    boysHostelGroup.add(pathDiag);

    // South exit walkway leading towards lower road
    const pathExit = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.1, 24), pathMat);
    pathExit.position.set(0, 0.06, 32);
    boysHostelGroup.add(pathExit);

    // Courtyard Leafy Shade Trees
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.8 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9 });

    [[-2, 8], [1, 14], [-3, 18], [2, 20]].forEach(([tx, tz]) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2.5, 6), trunkMat);
      trunk.position.set(tx, 1.25, tz);
      trunk.castShadow = true;
      boysHostelGroup.add(trunk);

      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(2.0, 1), treeFoliageMat);
      foliage.position.set(tx, 3.6, tz);
      foliage.castShadow = true;
      boysHostelGroup.add(foliage);
    });

    boysHostelGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-hostel-boys', isBuilding: true };
    });
    ctx.scene.add(boysHostelGroup);
    ctx.buildingMeshes.set('bldg-hostel-boys', boysHostelGroup);
    ctx.createBuildingLabel('bldg-hostel-boys', "MAKAUT BOYS' HOSTEL", [-222, 24, -183]);

    // 3. MAKAUT Boy's Canteen (Standalone block just west of Boys Hostel: [-250, 0, -150])
    const canteenGroup = new THREE.Group();
    canteenGroup.position.set(-250, 0, -150);
    canteenGroup.name = 'bldg-boys-canteen';

    const cBody = new THREE.Mesh(
      new THREE.BoxGeometry(14, 5.5, 12),
      new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.9 })
    );
    cBody.position.y = 2.75;
    cBody.castShadow = true;
    canteenGroup.add(cBody);

    const cRoof = new THREE.Mesh(
      new THREE.BoxGeometry(14.6, 0.8, 12.6),
      new THREE.MeshStandardMaterial({ color: '#64748b' })
    );
    cRoof.position.y = 5.8;
    canteenGroup.add(cRoof);

    canteenGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-boys-canteen', isBuilding: true };
    });
    ctx.scene.add(canteenGroup);
    ctx.buildingMeshes.set('bldg-boys-canteen', canteenGroup);
    ctx.createBuildingLabel('bldg-boys-canteen', "BOY'S CANTEEN (CLOSED)", [-250, 9, -150]);

    // =========================================================================
    // 4. Faculty Building (Angled SW-NE Block: [-158, 0, 96])
    // Authentic Satellite: Angled ~-36 deg, stepped cantilevered sunshades, roof tanks
    // =========================================================================
    const facultyGroup = new THREE.Group();
    facultyGroup.position.set(-158, 0, 96);
    facultyGroup.rotation.y = -0.63; // Angled -36 degrees
    facultyGroup.name = 'bldg-faculty';

    const resWallMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.85 });
    const resParapetMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.75 });
    const louverMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 });
    const resTankMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.6 });
    const resWindowMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.2, metalness: 0.6 });

    // Main 4-story body
    const facBody = new THREE.Mesh(new THREE.BoxGeometry(32, 15, 14), resWallMat);
    facBody.position.y = 7.5;
    facBody.castShadow = true;
    facBody.receiveShadow = true;
    facultyGroup.add(facBody);

    // Parapet
    const facParapet = new THREE.Mesh(new THREE.BoxGeometry(32.4, 0.8, 14.4), resParapetMat);
    facParapet.position.y = 15.4;
    facultyGroup.add(facParapet);

    // Cantilevered Stepped White Sunshade Louvers along Northern Facade
    for (let lx = -13; lx <= 13; lx += 4.2) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 1.8), louverMat);
      louver.position.set(lx, 15.2, -7.9);
      louver.castShadow = true;
      facultyGroup.add(louver);

      // Vertical support fin
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.3, 12, 1.2), louverMat);
      fin.position.set(lx, 8.5, -7.5);
      facultyGroup.add(fin);
    }

    // Windows on South & North Facades
    [-3.5, 0, 3.5, 5.5].forEach(wy => {
      const winSouth = new THREE.Mesh(new THREE.BoxGeometry(30, 1.2, 0.3), resWindowMat);
      winSouth.position.set(0, wy + 7.5, 7.05);
      facultyGroup.add(winSouth);
    });

    // Central Stair/Lift Core
    const facCore = new THREE.Mesh(new THREE.BoxGeometry(6, 3.2, 6), resWallMat);
    facCore.position.set(0, 17.0, 0);
    facCore.castShadow = true;
    facultyGroup.add(facCore);

    // Rooftop Cylindrical Water Tanks
    [-6, -2, 2, 6].forEach(tx => {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.6, 16), resTankMat);
      tank.position.set(tx, 16.6, 0);
      tank.castShadow = true;
      facultyGroup.add(tank);
    });

    facultyGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-faculty', isBuilding: true };
    });
    ctx.scene.add(facultyGroup);
    ctx.buildingMeshes.set('bldg-faculty', facultyGroup);
    ctx.createBuildingLabel('bldg-faculty', 'FACULTY BUILDING', [-158, 20, 96]);

    // =========================================================================
    // 5. MAKAUT STAFF QUATER 2 (Angled NW-SE Block: [-122, 0, 108])
    // Authentic Satellite: Angled ~+42 deg, stepped white sunshades, rooftop tanks
    // =========================================================================
    const staffGroup = new THREE.Group();
    staffGroup.position.set(-122, 0, 108);
    staffGroup.rotation.y = 0.73; // Angled +42 degrees
    staffGroup.name = 'bldg-staff-q2';

    // Main 4-story body
    const sBody = new THREE.Mesh(new THREE.BoxGeometry(28, 15, 14), resWallMat);
    sBody.position.y = 7.5;
    sBody.castShadow = true;
    sBody.receiveShadow = true;
    staffGroup.add(sBody);

    // Parapet
    const sParapet = new THREE.Mesh(new THREE.BoxGeometry(28.4, 0.8, 14.4), resParapetMat);
    sParapet.position.y = 15.4;
    staffGroup.add(sParapet);

    // Stepped White Sunshade Louvers along Northern Facade
    for (let lx = -11; lx <= 11; lx += 4.2) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 1.8), louverMat);
      louver.position.set(lx, 15.2, -7.9);
      louver.castShadow = true;
      staffGroup.add(louver);

      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.3, 12, 1.2), louverMat);
      fin.position.set(lx, 8.5, -7.5);
      staffGroup.add(fin);
    }

    // Central Stair/Lift Core
    const sCore = new THREE.Mesh(new THREE.BoxGeometry(5.5, 3.2, 5.5), resWallMat);
    sCore.position.set(0, 17.0, 0);
    sCore.castShadow = true;
    staffGroup.add(sCore);

    // Rooftop Cylindrical Water Tanks on Southern Roof
    [-4, 0, 4].forEach(tx => {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.6, 16), resTankMat);
      tank.position.set(tx, 16.6, 3);
      tank.castShadow = true;
      staffGroup.add(tank);
    });

    staffGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-staff-q2', isBuilding: true };
    });
    ctx.scene.add(staffGroup);
    ctx.buildingMeshes.set('bldg-staff-q2', staffGroup);
    ctx.createBuildingLabel('bldg-staff-q2', 'STAFF QUATER 2', [-122, 20, 108]);

    // =========================================================================
    // 6. Main Staff / Faculty Residential Block (North Block: [-144, 0, 50])
    // Authentic Satellite: L-shaped compound with 8 rooftop solar arrays & courtyard
    // =========================================================================
    const northResGroup = new THREE.Group();
    northResGroup.position.set(-144, 0, 50);
    northResGroup.name = 'bldg-staff-north';

    const solarCellMat2 = new THREE.MeshStandardMaterial({ color: '#1e3a8a', roughness: 0.15, metalness: 0.85 });
    const solarFrameMat2 = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.4, metalness: 0.6 });

    // West Wing of North Complex
    const nrWestWing = new THREE.Mesh(new THREE.BoxGeometry(16, 16, 38), resWallMat);
    nrWestWing.position.set(-6, 8, 0);
    nrWestWing.castShadow = true;
    nrWestWing.receiveShadow = true;
    northResGroup.add(nrWestWing);

    const nrWestParapet = new THREE.Mesh(new THREE.BoxGeometry(16.4, 0.8, 38.4), resParapetMat);
    nrWestParapet.position.set(-6, 16.4, 0);
    northResGroup.add(nrWestParapet);

    // East Wing of North Complex (L-shaped extension)
    const nrEastWing = new THREE.Mesh(new THREE.BoxGeometry(18, 16, 15), resWallMat);
    nrEastWing.position.set(11, 8, -11);
    nrEastWing.castShadow = true;
    nrEastWing.receiveShadow = true;
    northResGroup.add(nrEastWing);

    const nrEastParapet = new THREE.Mesh(new THREE.BoxGeometry(18.4, 0.8, 15.4), resParapetMat);
    nrEastParapet.position.set(11, 16.4, -11);
    northResGroup.add(nrEastParapet);

    // 8 Large Photovoltaic Solar Arrays on West Wing Rooftop (from satellite)
    [-9.5, -4.5].forEach(sx => {
      [-13, -6, 1].forEach(sz => {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.35, 5.2), solarFrameMat2);
        frame.position.set(sx, 17.0, sz);
        northResGroup.add(frame);

        const panel = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 5.0), solarCellMat2);
        panel.position.set(sx, 17.3, sz);
        panel.rotation.x = 0.26;
        panel.castShadow = true;
        northResGroup.add(panel);
      });
    });

    // 2 Long continuous horizontal solar arrays at the south end
    [-6].forEach(sx => {
      [9, 15].forEach(sz => {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.35, 3.8), solarFrameMat2);
        frame.position.set(sx, 17.0, sz);
        northResGroup.add(frame);

        const panel = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.15, 3.6), solarCellMat2);
        panel.position.set(sx, 17.3, sz);
        panel.rotation.x = 0.26;
        panel.castShadow = true;
        northResGroup.add(panel);
      });
    });

    // Internal Courtyard Garden with Lawn & Trees
    const nrLawnMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.9 });
    const nrLawn = new THREE.Mesh(new THREE.BoxGeometry(16, 0.08, 18), nrLawnMat);
    nrLawn.position.set(9, 0.04, 5);
    nrLawn.receiveShadow = true;
    northResGroup.add(nrLawn);

    const nrTreeMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.8 });
    const nrTrunkMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9 });
    [[6, 2], [11, 7], [7, 10]].forEach(([tx, tz]) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 2.4, 6), nrTrunkMat);
      trunk.position.set(tx, 1.2, tz);
      trunk.castShadow = true;
      northResGroup.add(trunk);

      const fol = new THREE.Mesh(new THREE.DodecahedronGeometry(2.0, 1), nrTreeMat);
      fol.position.set(tx, 3.4, tz);
      fol.castShadow = true;
      northResGroup.add(fol);
    });

    northResGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-staff-q2', isBuilding: true };
    });
    ctx.scene.add(northResGroup);
  }

  private static setupGirlsHostel(ctx: BuilderContext): void {
    const wallMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.85 });
    const girlsAccent = new THREE.MeshStandardMaterial({ color: '#9d174d', roughness: 0.7 });

    const girlsGroup = new THREE.Group();
    girlsGroup.position.set(-100, 0, 150);
    girlsGroup.name = 'bldg-hostel-girls';

    const gBlock1 = new THREE.Mesh(new THREE.BoxGeometry(32, 16, 18), wallMat);
    gBlock1.position.y = 8.4;
    gBlock1.castShadow = true;
    girlsGroup.add(gBlock1);

    const gRoof = new THREE.Mesh(new THREE.BoxGeometry(32.6, 1.2, 18.6), girlsAccent);
    gRoof.position.y = 16.8;
    girlsGroup.add(gRoof);

    // Distinctive long blue-roofed multipurpose dining / community hall
    const blueHall = new THREE.Mesh(
      new THREE.BoxGeometry(22, 6.5, 12),
      wallMat
    );
    blueHall.position.set(16, 3.25, -6);
    blueHall.castShadow = true;
    girlsGroup.add(blueHall);

    const blueHallRoof = new THREE.Mesh(
      new THREE.BoxGeometry(22.8, 1.4, 12.8),
      new THREE.MeshStandardMaterial({ color: '#1d4ed8', roughness: 0.35 })
    );
    blueHallRoof.position.set(16, 7.0, -6);
    girlsGroup.add(blueHallRoof);

    girlsGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-hostel-girls', isBuilding: true };
    });
    ctx.scene.add(girlsGroup);
    ctx.buildingMeshes.set('bldg-hostel-girls', girlsGroup);
    ctx.createBuildingLabel('bldg-hostel-girls', "MAKAUT GIRLS' HOSTEL", [-100, 22, 150]);
  }

  private static setupBioTechBuilding(ctx: BuilderContext): void {
    // =========================================================================
    // MAKAUT Department of Biotechnology (Centroid [-23, 0, 130])
    // Authentic Photos (1, 2, 3, 5): 5-STORY LINEAR COMPLEX, MAKAUT SKY BLUE FACADE,
    // 14 WHITE STRUCTURAL COLUMNS, "MAKAUT, W.B." PORTICO, EAST ELEVATOR TOWER,
    // EXTENSIVE 2-BANK ROOFTOP SOLAR POWER PLANT, 36m CIRCULAR DROP-OFF LOOP & MOUND
    // =========================================================================
    const biotechGroup = new THREE.Group();
    biotechGroup.position.set(-23, 0, 130);
    biotechGroup.rotation.y = -0.16; // Angled matching satellite
    biotechGroup.name = 'bldg-biotech';

    const btSkyBlueMat = new THREE.MeshStandardMaterial({ color: '#6ba3d6', roughness: 0.65 });
    const btRoyalBlueMat = new THREE.MeshStandardMaterial({ color: '#1d4ed8', roughness: 0.45, metalness: 0.2 });
    const btWhiteMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.85 });
    const btGlassMat = new THREE.MeshStandardMaterial({
      color: '#0a192f',
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.92
    });
    const btMullionMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4, metalness: 0.6 });
    const btSolarMat = new THREE.MeshStandardMaterial({
      color: '#1e3a8a',
      roughness: 0.15,
      metalness: 0.85
    });
    const btRackMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.4, metalness: 0.8 });
    const btAsphaltMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.9 });
    const btLawnMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.9 });
    const btCurbMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.8 });
    const btSignTextMat = new THREE.MeshBasicMaterial({ color: '#1d4ed8' });
    const btMechMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.6 });

    const bldgLen = 94.0;
    const bldgWid = 15.5;
    const bldgH = 18.0; // 5 floors

    // 1. Main 5-Story Body in authentic MAKAUT Sky Blue
    const body = new THREE.Mesh(new THREE.BoxGeometry(bldgLen, bldgH, bldgWid), btSkyBlueMat);
    body.position.y = bldgH / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    biotechGroup.add(body);

    // 2. Continuous Royal Blue Roofline Fascia
    const roofFascia = new THREE.Mesh(new THREE.BoxGeometry(bldgLen + 0.6, 1.0, bldgWid + 0.6), btRoyalBlueMat);
    roofFascia.position.y = bldgH + 0.5;
    roofFascia.castShadow = true;
    biotechGroup.add(roofFascia);

    // 3. Royal Blue Crenellated / Slotted Parapet along North and South Roof Edges (Photos 1 & 2)
    const parapetH = 1.4;
    const numParapetSlots = 36;
    for (let s = 0; s < numParapetSlots; s++) {
      const px = -bldgLen / 2 + (s + 0.5) * (bldgLen / numParapetSlots);
      const pierW = (bldgLen / numParapetSlots) * 0.55;

      [-bldgWid / 2, bldgWid / 2].forEach(pz => {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(pierW, parapetH, 0.45), btRoyalBlueMat);
        fin.position.set(px, bldgH + 1.0 + parapetH / 2, pz);
        biotechGroup.add(fin);
      });
    }

    // Top Continuous Parapet Cap Rails
    [-bldgWid / 2, bldgWid / 2].forEach(pz => {
      const cap = new THREE.Mesh(new THREE.BoxGeometry(bldgLen + 0.8, 0.35, 0.55), btRoyalBlueMat);
      cap.position.set(0, bldgH + 1.0 + parapetH + 0.17, pz);
      biotechGroup.add(cap);
    });

    // 4. 14 Vertical White Structural Columns on North & South Facades (Photos 1 & 2)
    const numCols = 14;
    for (let c = 0; c <= numCols; c++) {
      const cx = -bldgLen / 2 + 3.0 + c * ((bldgLen - 6.0) / numCols);

      [-bldgWid / 2 - 0.2, bldgWid / 2 + 0.2].forEach(cz => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.8, bldgH + 1.0, 0.5), btWhiteMat);
        col.position.set(cx, (bldgH + 1.0) / 2, cz);
        col.castShadow = true;
        biotechGroup.add(col);
      });
    }

    // 5. Continuous Horizontal Ribbon Windows on all 5 Floors with Vertical Aluminum Mullions
    for (let f = 1; f <= 5; f++) {
      const winY = (f - 0.5) * 3.4 + 0.5;

      [-bldgWid / 2 - 0.05, bldgWid / 2 + 0.05].forEach(wz => {
        const win = new THREE.Mesh(new THREE.BoxGeometry(bldgLen - 1.2, 1.65, 0.25), btGlassMat);
        win.position.set(0, winY, wz);
        biotechGroup.add(win);

        const sill = new THREE.Mesh(new THREE.BoxGeometry(bldgLen - 0.8, 0.22, 0.4), btWhiteMat);
        sill.position.set(0, winY - 0.9, wz);
        biotechGroup.add(sill);

        for (let m = 0; m <= numCols * 2; m++) {
          const mx = -bldgLen / 2 + 3.0 + m * ((bldgLen - 6.0) / (numCols * 2));
          const mul = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.65, 0.28), btMullionMat);
          mul.position.set(mx, winY, wz);
          biotechGroup.add(mul);
        }
      });
    }

    // AC Outdoor Compressor Units on wall brackets (seen in Photo 1 & 2)
    for (let c = 1; c < numCols; c += 2) {
      const ax = -bldgLen / 2 + 3.0 + c * ((bldgLen - 6.0) / numCols);
      [2, 3, 4].forEach(fl => {
        const ay = fl * 3.4 - 0.8;
        const acUnit = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 0.55), btWhiteMat);
        acUnit.position.set(ax, ay, -bldgWid / 2 - 0.4);
        biotechGroup.add(acUnit);
      });
    }

    // 6. Central Main Entrance Portico ("MAKAUT, W.B." - Photos 1 & 2)
    const porticoW = 12.0;
    const porticoH = 6.4;
    const porticoD = 6.5;
    const porticoX = -2.0;
    const porticoZ = -bldgWid / 2 - porticoD / 2;

    const porticoGroup = new THREE.Group();
    porticoGroup.position.set(porticoX, 0, porticoZ);

    const porticoRoof = new THREE.Mesh(new THREE.BoxGeometry(porticoW, 0.6, porticoD), btWhiteMat);
    porticoRoof.position.set(0, porticoH, 0);
    porticoRoof.castShadow = true;
    porticoGroup.add(porticoRoof);

    const porticoTrim = new THREE.Mesh(new THREE.BoxGeometry(porticoW + 0.3, 0.4, porticoD + 0.3), btRoyalBlueMat);
    porticoTrim.position.set(0, porticoH + 0.4, 0);
    porticoGroup.add(porticoTrim);

    [-porticoW / 2 + 0.8, porticoW / 2 - 0.8].forEach(px => {
      [-porticoD / 2 + 0.8, porticoD / 2 - 0.8].forEach(pz => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.9, porticoH, 0.9), btWhiteMat);
        pillar.position.set(px, porticoH / 2, pz);
        pillar.castShadow = true;
        porticoGroup.add(pillar);
      });
    });

    const foyerGlass = new THREE.Mesh(new THREE.BoxGeometry(porticoW - 2.0, porticoH - 0.8, 0.3), btGlassMat);
    foyerGlass.position.set(0, (porticoH - 0.8) / 2, porticoD / 2 - 0.8);
    porticoGroup.add(foyerGlass);

    const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.6, 0.2), btGlassMat);
    doorMesh.position.set(0, 1.3, -porticoD / 2 + 1.2);
    porticoGroup.add(doorMesh);

    // Signboard: "MAKAUT, W.B." (Prominently visible in Photo 2!)
    const signBox = new THREE.Mesh(new THREE.BoxGeometry(9.0, 1.3, 0.15), btWhiteMat);
    signBox.position.set(0, porticoH + 1.0, -porticoD / 2);
    porticoGroup.add(signBox);

    const signText = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.8, 0.08), btSignTextMat);
    signText.position.set(0, porticoH + 1.0, -porticoD / 2 - 0.06);
    porticoGroup.add(signText);

    for (let st = 0; st < 3; st++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(porticoW - st * 0.8, 0.18, 1.4), btWhiteMat);
      step.position.set(0, 0.09 + (2 - st) * 0.18, -porticoD / 2 - st * 0.4);
      porticoGroup.add(step);
    }

    biotechGroup.add(porticoGroup);

    // 7. East End Elevator / Stair Tower (Crisp White, rising to 22.5m - Photos 1 & 3)
    const eastTowerH = 22.5;
    const eastTower = new THREE.Mesh(new THREE.BoxGeometry(8.5, eastTowerH, bldgWid + 0.4), btWhiteMat);
    eastTower.position.set(bldgLen / 2 - 4.25, eastTowerH / 2, 0);
    eastTower.castShadow = true;
    biotechGroup.add(eastTower);

    const eastTowerParapet = new THREE.Mesh(new THREE.BoxGeometry(8.8, 1.2, bldgWid + 0.7), btRoyalBlueMat);
    eastTowerParapet.position.set(bldgLen / 2 - 4.25, eastTowerH + 0.6, 0);
    biotechGroup.add(eastTowerParapet);

    [-3.0, 3.0].forEach(tz => {
      for (let w = 1; w <= 4; w++) {
        const slit = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.2, 1.2), btGlassMat);
        slit.position.set(bldgLen / 2 + 0.1, w * 4.0, tz);
        biotechGroup.add(slit);
      }
    });

    // 8. West End Stair Core & Rooftop Penthouse
    const westPenthouse = new THREE.Mesh(new THREE.BoxGeometry(10.0, 3.5, bldgWid - 2.0), btWhiteMat);
    westPenthouse.position.set(-bldgLen / 2 + 5.0, bldgH + 1.75, 0);
    westPenthouse.castShadow = true;
    biotechGroup.add(westPenthouse);

    [-2.5, 2.5].forEach(tz => {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.2, 16), btMechMat);
      tank.position.set(-bldgLen / 2 + 5.0, bldgH + 4.5, tz);
      biotechGroup.add(tank);
    });

    // 9. Massive Rooftop Photovoltaic Solar Power Plant (2 Continuous Parallel Banks - Photo 3)
    const solarBankGroup = new THREE.Group();
    solarBankGroup.position.set(0, bldgH + 1.1, 0);

    [-3.8, -1.2, 1.4, 4.0].forEach(rowZ => {
      for (let sx = -36; sx <= 36; sx += 4.5) {
        const rack = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.4, 2.0), btRackMat);
        rack.position.set(sx, 0.4, rowZ);
        solarBankGroup.add(rack);

        const panel = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 2.2), btSolarMat);
        panel.rotation.x = 0.26; // Tilted 15 degrees south
        panel.position.set(sx, 0.8, rowZ);
        panel.castShadow = true;
        solarBankGroup.add(panel);
      }
    });
    biotechGroup.add(solarBankGroup);

    // 10. 36m Circular Drop-Off Driveway Loop with Central Landscaped Lawn Mound (Photos 1, 2, 3, 5)
    const loopGroup = new THREE.Group();
    loopGroup.position.set(-2.0, 0.02, -bldgWid / 2 - 32);

    // Outer Asphalt Roadway Ring
    const loopRoad = new THREE.Mesh(new THREE.RingGeometry(11.0, 18.0, 48), btAsphaltMat);
    loopRoad.rotation.x = -Math.PI / 2;
    loopRoad.receiveShadow = true;
    loopGroup.add(loopRoad);

    const outerCurb = new THREE.Mesh(new THREE.RingGeometry(18.0, 18.4, 48), btCurbMat);
    outerCurb.rotation.x = -Math.PI / 2;
    outerCurb.position.y = 0.02;
    loopGroup.add(outerCurb);

    const innerCurb = new THREE.Mesh(new THREE.RingGeometry(10.7, 11.0, 48), btCurbMat);
    innerCurb.rotation.x = -Math.PI / 2;
    innerCurb.position.y = 0.02;
    loopGroup.add(innerCurb);

    // Central Landscaped Green Lawn Mound (22m diameter - Photos 1 & 2)
    const lawnMound = new THREE.Mesh(new THREE.CircleGeometry(10.7, 36), btLawnMat);
    lawnMound.rotation.x = -Math.PI / 2;
    lawnMound.position.y = 0.04;
    lawnMound.receiveShadow = true;
    loopGroup.add(lawnMound);

    const raisedMound = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 8.5, 0.6, 24), btLawnMat);
    raisedMound.position.set(0, 0.3, 0);
    raisedMound.receiveShadow = true;
    loopGroup.add(raisedMound);

    const shrubMat = new THREE.MeshStandardMaterial({ color: '#166534', roughness: 0.8 });
    for (let sh = 0; sh < 8; sh++) {
      const sAngle = (sh / 8) * Math.PI * 2;
      const shrub = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 1), shrubMat);
      shrub.position.set(Math.cos(sAngle) * 4.2, 0.85, Math.sin(sAngle) * 4.2);
      loopGroup.add(shrub);
    }

    // Approach road connecting loop to north road
    const approachRoad = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 24), btAsphaltMat);
    approachRoad.rotation.x = -Math.PI / 2;
    approachRoad.position.set(0, 0.01, -24);
    approachRoad.receiveShadow = true;
    loopGroup.add(approachRoad);

    // Driveway connecting loop south to portico
    const porticoDrive = new THREE.Mesh(new THREE.PlaneGeometry(10.0, 16), btAsphaltMat);
    porticoDrive.rotation.x = -Math.PI / 2;
    porticoDrive.position.set(0, 0.01, 16);
    porticoDrive.receiveShadow = true;
    loopGroup.add(porticoDrive);

    // East Parking Apron with parked vehicles (Photos 1 & 3)
    const parkingApron = new THREE.Mesh(new THREE.PlaneGeometry(26, 18), btAsphaltMat);
    parkingApron.rotation.x = -Math.PI / 2;
    parkingApron.position.set(30, 0.01, 4);
    parkingApron.receiveShadow = true;
    loopGroup.add(parkingApron);

    const carColors = ['#f8fafc', '#ef4444', '#1e293b', '#cbd5e1'];
    [22, 27, 33, 38].forEach((cx, idx) => {
      const carBody = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.9, 4.2),
        new THREE.MeshStandardMaterial({ color: carColors[idx % carColors.length], roughness: 0.3, metalness: 0.7 })
      );
      carBody.position.set(cx, 0.55, 4);
      carBody.castShadow = true;
      loopGroup.add(carBody);

      const carRoof = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 2.2), btGlassMat);
      carRoof.position.set(cx, 1.25, 3.8);
      loopGroup.add(carRoof);
    });

    biotechGroup.add(loopGroup);

    biotechGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-biotech', isBuilding: true };
    });

    ctx.scene.add(biotechGroup);
    ctx.buildingMeshes.set('bldg-biotech', biotechGroup);
    ctx.createBuildingLabel('bldg-biotech', 'MAKAUT BIOTECH BUILDING', [-23, 24, 130]);
  }

  private static setupIndustrialEngineeringDome(ctx: BuilderContext): void {
    // =========================================================================
    // MAKAUT CIRCULAR ACADEMIC BUILDING / EXAM CONTROL CENTER & IEM (Centroid [70, 0, 122])
    // Authentic Reconstruction from Satellite View & Ground Photos (media_1789203664807, media_1789203701308, media_1789203716396):
    // 1. Positioned at [70, 0, 122] directly east of the campus avenue, fully clearing the roadway
    // 2. 2-Story Cylindrical Drum (R=14.0m, H=9.6m) in pure white with MAKAUT Royal Blue plinth, mid-floor band, and roof coping
    // 3. 16 Radial vertical royal blue pilasters dividing the facade into rhythmic architectural bays
    // 4. North-West Projecting Entrance & Staircase Glass Curtain Wall Tower (H=11.4m):
    //    - Full-height 2-story dark reflective glass curtain wall with blue side pylons and top parapet cornice
    //    - Recessed ground-floor entrance foyer with glazed double doors and cantilevered blue portico canopy
    //    - Concentric semi-circular entrance stairs (granite treads & white risers) with stainless steel handrails
    //    - Accessible wheelchair ramp with safety railings
    // 5. Upper and lower floor rectangular windows with 3D projecting royal blue box hoods (chhajjas)
    // 6. Full-height vertical dark ventilation louver section with royal blue border
    // 7. Central Raised Octagonal Core & 8-Faceted Pitched Royal Blue Metal Roof (apex Y=14.6m) with ventilator cap
    // 8. Rooftop Infrastructure: 3 black cylindrical "PATTON" water storage tanks with PVC piping, blue HVAC penthouse
    // 9. Red fire safety water pipeline along the plinth with red hydrant cabinet
    // 10. North-West Entrance Plaza with authentic red & yellow diagonal/checkered pavers
    // 11. Forecourt raised circular tree planter with blue trim & mature leafy shade tree
    // 12. North Paved Plaza with 4x5 grid of shade tree pits (seen on satellite photo)
    // 13. Paved connection walkway to the campus avenue sidewalk
    // =========================================================================
    const iemGroup = new THREE.Group();
    iemGroup.position.set(70, 0, 122);
    iemGroup.name = 'bldg-industrial';

    // Authentic Material Palette
    const iemWhiteMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.85 });
    const iemRoyalBlueMat = new THREE.MeshStandardMaterial({ color: '#1d4ed8', roughness: 0.4, metalness: 0.25 });
    const iemSkyBlueMat = new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.5, metalness: 0.15 });
    const iemCurtainGlassMat = new THREE.MeshStandardMaterial({
      color: '#071326',
      roughness: 0.06,
      metalness: 0.95,
      transparent: true,
      opacity: 0.94
    });
    const iemWindowGlassMat = new THREE.MeshStandardMaterial({
      color: '#0a1a33',
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.92
    });
    const iemMullionMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.4, metalness: 0.7 });
    const iemLouverMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.75 });
    const iemRoofBlueMat = new THREE.MeshStandardMaterial({ color: '#1e40af', roughness: 0.35, metalness: 0.35 });
    const iemPlinthMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.9 });
    const iemRedPipeMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.45, metalness: 0.3 });
    const iemTankBlackMat = new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.85 });
    const iemSteelMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.2, metalness: 0.9 });
    const iemGraniteMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.5 });
    const iemTreeTrunkMat = new THREE.MeshStandardMaterial({ color: '#573a1e', roughness: 0.9 });
    const iemTreeFoliageMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.75 });

    const radius = 14.0;
    const bldgH = 9.6; // 2 stories
    const floorH = 4.8;

    // -------------------------------------------------------------------------
    // 1. CYLINDRICAL 2-STORY DRUM BODY
    // -------------------------------------------------------------------------
    // Concrete foundation plinth
    const basePlinth = new THREE.Mesh(
      new THREE.CylinderGeometry(radius + 0.2, radius + 0.25, 0.6, 48),
      iemPlinthMat
    );
    basePlinth.position.y = 0.3;
    basePlinth.receiveShadow = true;
    iemGroup.add(basePlinth);

    // Plinth Blue Band
    const plinthBand = new THREE.Mesh(
      new THREE.CylinderGeometry(radius + 0.12, radius + 0.12, 0.25, 48),
      iemRoyalBlueMat
    );
    plinthBand.position.y = 0.55;
    iemGroup.add(plinthBand);

    // Main Cylindrical White Wall Shell
    const drumShell = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, bldgH, 48, 1, true),
      iemWhiteMat
    );
    drumShell.position.y = bldgH / 2;
    drumShell.castShadow = true;
    drumShell.receiveShadow = true;
    iemGroup.add(drumShell);

    // Mid-Floor Royal Blue Horizontal Belt Course (Y = 4.8m)
    const midBand = new THREE.Mesh(
      new THREE.CylinderGeometry(radius + 0.08, radius + 0.08, 0.38, 48),
      iemRoyalBlueMat
    );
    midBand.position.y = floorH;
    iemGroup.add(midBand);

    // Pale blue accent trim right above mid-band
    const midAccent = new THREE.Mesh(
      new THREE.CylinderGeometry(radius + 0.04, radius + 0.04, 0.12, 48),
      iemSkyBlueMat
    );
    midAccent.position.y = floorH + 0.25;
    iemGroup.add(midAccent);

    // Roof Parapet Cornice Band (Y = 9.6m)
    const roofCornice = new THREE.Mesh(
      new THREE.CylinderGeometry(radius + 0.15, radius + 0.08, 0.55, 48),
      iemRoyalBlueMat
    );
    roofCornice.position.y = bldgH;
    iemGroup.add(roofCornice);

    // Parapet Wall Top Coping (Y = 10.0m)
    const parapetCoping = new THREE.Mesh(
      new THREE.CylinderGeometry(radius + 0.05, radius + 0.05, 0.65, 48, 1, true),
      iemWhiteMat
    );
    parapetCoping.position.y = bldgH + 0.35;
    iemGroup.add(parapetCoping);

    const parapetTopTrim = new THREE.Mesh(
      new THREE.CylinderGeometry(radius + 0.1, radius + 0.1, 0.1, 48),
      iemSkyBlueMat
    );
    parapetTopTrim.position.y = bldgH + 0.7;
    iemGroup.add(parapetTopTrim);

    // Roof Deck Floor Slab
    const roofDeck = new THREE.Mesh(
      new THREE.CylinderGeometry(radius - 0.05, radius - 0.05, 0.2, 48),
      iemPlinthMat
    );
    roofDeck.position.y = bldgH - 0.1;
    roofDeck.receiveShadow = true;
    iemGroup.add(roofDeck);

    // -------------------------------------------------------------------------
    // 2. 16 RADIAL VERTICAL ROYAL BLUE PILASTERS
    // -------------------------------------------------------------------------
    const numPilasters = 16;
    const entranceAngle = -Math.PI * 0.75; // -135 degrees (North-West)
    const entranceAngleWidth = Math.PI * 0.35; // Angle span occupied by entrance tower

    for (let p = 0; p < numPilasters; p++) {
      const angle = (p / numPilasters) * Math.PI * 2;
      let diff = Math.abs(angle - entranceAngle);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;
      if (diff < entranceAngleWidth * 0.6) continue; // Skip pilasters inside entrance block

      const pilaster = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, bldgH, 0.28),
        iemRoyalBlueMat
      );
      pilaster.position.set(
        Math.sin(angle) * (radius + 0.08),
        bldgH / 2,
        Math.cos(angle) * (radius + 0.08)
      );
      pilaster.rotation.y = angle;
      pilaster.castShadow = true;
      iemGroup.add(pilaster);
    }

    // -------------------------------------------------------------------------
    // 3. NORTH-WEST PROJECTING ENTRANCE & GLASS CURTAIN WALL TOWER
    // (Seen prominently in Photo 2: media_1789203701308 and Photo 3: media_1789203716396)
    // -------------------------------------------------------------------------
    const towerGroup = new THREE.Group();
    // Rotate to face north-west along entrance angle
    towerGroup.rotation.y = entranceAngle;
    towerGroup.position.set(
      Math.sin(entranceAngle) * (radius - 1.2),
      0,
      Math.cos(entranceAngle) * (radius - 1.2)
    );

    const towerW = 7.2;
    const towerDepth = 4.4;
    const towerH = 11.4;

    // Main Tower Body Shell in White
    const towerBody = new THREE.Mesh(
      new THREE.BoxGeometry(towerW, towerH, towerDepth),
      iemWhiteMat
    );
    towerBody.position.set(0, towerH / 2, towerDepth / 2);
    towerBody.castShadow = true;
    towerGroup.add(towerBody);

    // Left & Right Flanking Royal Blue Blade Pylons
    [-towerW / 2 + 0.38, towerW / 2 - 0.38].forEach(px => {
      const pylon = new THREE.Mesh(
        new THREE.BoxGeometry(0.76, towerH + 0.5, towerDepth + 0.3),
        iemRoyalBlueMat
      );
      pylon.position.set(px, (towerH + 0.5) / 2, towerDepth / 2);
      pylon.castShadow = true;
      towerGroup.add(pylon);
    });

    // Top Cantilevered Roof Parapet Cornice on Tower
    const towerCornice = new THREE.Mesh(
      new THREE.BoxGeometry(towerW + 0.6, 0.7, towerDepth + 0.6),
      iemRoyalBlueMat
    );
    towerCornice.position.set(0, towerH + 0.35, towerDepth / 2);
    towerCornice.castShadow = true;
    towerGroup.add(towerCornice);

    // Full-Height 2-Story Black Reflective Glass Curtain Wall (Facing Plaza at Z = towerDepth)
    const glassW = towerW - 1.52;
    const glassH = towerH - 0.4;
    const curtainWall = new THREE.Mesh(
      new THREE.PlaneGeometry(glassW, glassH),
      iemCurtainGlassMat
    );
    curtainWall.position.set(0, glassH / 2 + 0.2, towerDepth + 0.02);
    towerGroup.add(curtainWall);

    // Aluminum Mullion Grid for Curtain Wall (4 vertical columns, 6 horizontal rows)
    const cols = 4;
    const rows = 6;
    for (let c = 0; c <= cols; c++) {
      const mx = -glassW / 2 + c * (glassW / cols);
      const vertMullion = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, glassH, 0.06),
        iemMullionMat
      );
      vertMullion.position.set(mx, glassH / 2 + 0.2, towerDepth + 0.04);
      towerGroup.add(vertMullion);
    }
    for (let r = 0; r <= rows; r++) {
      const my = 0.2 + r * (glassH / rows);
      const horizMullion = new THREE.Mesh(
        new THREE.BoxGeometry(glassW, 0.06, 0.06),
        iemMullionMat
      );
      horizMullion.position.set(0, my, towerDepth + 0.04);
      towerGroup.add(horizMullion);
    }

    // Ground Floor Recessed Entrance Portico & Glass Double Doors
    const doorW = 2.8;
    const doorH = 2.5;
    const doorGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(doorW, doorH),
      iemCurtainGlassMat
    );
    doorGlass.position.set(0, doorH / 2 + 0.2, towerDepth + 0.08);
    towerGroup.add(doorGlass);

    // Door frame & handles
    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(doorW + 0.15, doorH + 0.1, 0.08),
      iemMullionMat
    );
    doorFrame.position.set(0, doorH / 2 + 0.2, towerDepth + 0.07);
    towerGroup.add(doorFrame);

    [-0.2, 0.2].forEach(hx => {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), iemSteelMat);
      handle.position.set(hx, 1.2, towerDepth + 0.15);
      towerGroup.add(handle);
    });

    // Cantilevered Royal Blue Portico Canopy Eave (Y = 3.8m)
    const canopyW = towerW - 0.4;
    const canopyDepth = 2.6;
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(canopyW, 0.3, canopyDepth),
      iemRoyalBlueMat
    );
    canopy.position.set(0, 3.8, towerDepth + canopyDepth / 2 - 0.2);
    canopy.castShadow = true;
    towerGroup.add(canopy);

    // Blue fascia trim on canopy edge
    const canopyEdge = new THREE.Mesh(
      new THREE.BoxGeometry(canopyW + 0.1, 0.12, 0.08),
      iemSkyBlueMat
    );
    canopyEdge.position.set(0, 3.8, towerDepth + canopyDepth - 0.2);
    towerGroup.add(canopyEdge);

    // Concentric Semi-Circular Entrance Steps (Photo 2)
    const numSteps = 4;
    for (let s = 0; s < numSteps; s++) {
      const stepR = 4.8 - s * 0.4;
      const stepH = 0.15;
      const stepY = (numSteps - 1 - s) * stepH + stepH / 2;

      const stepGeom = new THREE.CylinderGeometry(stepR, stepR, stepH, 32, 1, false, 0, Math.PI);
      const stepMesh = new THREE.Mesh(stepGeom, iemGraniteMat);
      stepMesh.rotation.y = Math.PI; // Face outwards toward plaza
      stepMesh.position.set(0, stepY, towerDepth + 0.6 + s * 0.35);
      stepMesh.receiveShadow = true;
      towerGroup.add(stepMesh);

      // White step riser front trim
      const riserTrim = new THREE.Mesh(
        new THREE.CylinderGeometry(stepR + 0.02, stepR + 0.02, stepH, 32, 1, true, 0, Math.PI),
        iemWhiteMat
      );
      riserTrim.rotation.y = Math.PI;
      riserTrim.position.set(0, stepY, towerDepth + 0.6 + s * 0.35);
      towerGroup.add(riserTrim);
    }

    // Stainless Steel Tubular Railings on Stairs
    [-3.2, 3.2].forEach(rx => {
      const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.95, 8), iemSteelMat);
      post1.position.set(rx, 0.8, towerDepth + 1.2);
      towerGroup.add(post1);

      const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.95, 8), iemSteelMat);
      post2.position.set(rx, 0.5, towerDepth + 2.4);
      towerGroup.add(post2);

      const handrail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.6, 8), iemSteelMat);
      handrail.rotation.x = Math.PI / 6;
      handrail.position.set(rx, 1.0, towerDepth + 1.8);
      towerGroup.add(handrail);
    });

    // Wheelchair Access Ramp on the Left Side
    const ramp = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 4.2), iemPlinthMat);
    ramp.position.set(-towerW / 2 - 0.7, 0.28, towerDepth + 0.8);
    ramp.rotation.x = 0.12;
    ramp.receiveShadow = true;
    towerGroup.add(ramp);

    iemGroup.add(towerGroup);

    // -------------------------------------------------------------------------
    // 4. WINDOW BAYS WITH PROJECTING BLUE BOX HOODS (CHHAJJAS)
    // (Seen in Photo 2: media_1789203701308 and Photo 3: media_1789203716396)
    // -------------------------------------------------------------------------
    const createWindowBay = (angle: number, floorY: number) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(Math.sin(angle) * (radius + 0.04), floorY, Math.cos(angle) * (radius + 0.04));
      wGroup.rotation.y = angle;

      const winW = 1.35;
      const winH = 1.55;

      // Projecting Royal Blue Box Frame / Sunshade Hood
      const hoodDepth = 0.28;
      const hoodTop = new THREE.Mesh(new THREE.BoxGeometry(winW + 0.18, 0.12, hoodDepth + 0.05), iemRoyalBlueMat);
      hoodTop.position.set(0, winH / 2 + 0.06, hoodDepth / 2);
      wGroup.add(hoodTop);

      const hoodBottom = new THREE.Mesh(new THREE.BoxGeometry(winW + 0.18, 0.10, hoodDepth), iemRoyalBlueMat);
      hoodBottom.position.set(0, -winH / 2 - 0.05, hoodDepth / 2);
      wGroup.add(hoodBottom);

      [-winW / 2 - 0.05, winW / 2 + 0.05].forEach(sx => {
        const sideFin = new THREE.Mesh(new THREE.BoxGeometry(0.10, winH + 0.12, hoodDepth), iemRoyalBlueMat);
        sideFin.position.set(sx, 0, hoodDepth / 2);
        wGroup.add(sideFin);
      });

      // Dark reflective glass pane
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), iemWindowGlassMat);
      pane.position.set(0, 0, 0.02);
      wGroup.add(pane);

      // White internal window frame border
      const frameBorder = new THREE.Mesh(new THREE.BoxGeometry(winW, winH, 0.03), iemWhiteMat);
      frameBorder.position.set(0, 0, 0.01);
      wGroup.add(frameBorder);

      // Center vertical mullion
      const centerMul = new THREE.Mesh(new THREE.BoxGeometry(0.04, winH, 0.04), iemMullionMat);
      centerMul.position.set(0, 0, 0.03);
      wGroup.add(centerMul);

      return wGroup;
    };

    // Distribute window bays around the cylindrical walls
    const windowAngles = [
      -Math.PI * 0.45,
      -Math.PI * 0.32,
      -Math.PI * 0.15,
      0,
      Math.PI * 0.15,
      Math.PI * 0.32,
      Math.PI * 0.48,
      Math.PI * 0.65,
      Math.PI * 0.82,
      Math.PI * 0.98,
      -Math.PI * 0.95
    ];

    windowAngles.forEach(wa => {
      // 1st floor window (Y = 2.6m)
      iemGroup.add(createWindowBay(wa, 2.6));
      // 2nd floor window (Y = 7.2m)
      iemGroup.add(createWindowBay(wa, 7.2));
    });

    // -------------------------------------------------------------------------
    // 5. FULL-HEIGHT VERTICAL VENTILATION LOUVER BAY
    // (Seen in Photo 3 on the curved wall)
    // -------------------------------------------------------------------------
    const louverAngle = -Math.PI * 0.58;
    const louverGroup = new THREE.Group();
    louverGroup.position.set(
      Math.sin(louverAngle) * (radius + 0.06),
      bldgH / 2,
      Math.cos(louverAngle) * (radius + 0.06)
    );
    louverGroup.rotation.y = louverAngle;

    // Louver panel surround in Royal Blue
    const louverW = 2.4;
    const louverH = 8.4;
    const louverFrame = new THREE.Mesh(
      new THREE.BoxGeometry(louverW + 0.2, louverH + 0.2, 0.15),
      iemRoyalBlueMat
    );
    louverGroup.add(louverFrame);

    // Dark background void
    const louverBack = new THREE.Mesh(
      new THREE.PlaneGeometry(louverW, louverH),
      iemLouverMat
    );
    louverBack.position.z = 0.02;
    louverGroup.add(louverBack);

    // Horizontal dark gray airflow slats
    const numSlats = 24;
    for (let s = 0; s < numSlats; s++) {
      const sy = -louverH / 2 + (s + 0.5) * (louverH / numSlats);
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(louverW - 0.1, 0.08, 0.12),
        iemLouverMat
      );
      slat.rotation.x = Math.PI / 4;
      slat.position.set(0, sy, 0.05);
      louverGroup.add(slat);
    }
    iemGroup.add(louverGroup);

    // -------------------------------------------------------------------------
    // 6. CENTRAL RAISED OCTAGONAL CORE & PITCHED BLUE METAL ROOF
    // (High-Res Satellite Photo 1 & Elevated Photo 2)
    // -------------------------------------------------------------------------
    const octRadius = 6.8;
    const octH = 1.8;
    const octY = bldgH + octH / 2;

    // Raised Octagonal Drum Walls
    const octDrum = new THREE.Mesh(
      new THREE.CylinderGeometry(octRadius, octRadius, octH, 8, 1, true),
      iemWhiteMat
    );
    octDrum.position.y = octY;
    octDrum.rotation.y = Math.PI / 8; // Align 8 facets
    octDrum.castShadow = true;
    iemGroup.add(octDrum);

    // Octagonal top cornice band
    const octCornice = new THREE.Mesh(
      new THREE.CylinderGeometry(octRadius + 0.15, octRadius + 0.15, 0.25, 8),
      iemRoyalBlueMat
    );
    octCornice.position.y = bldgH + octH;
    octCornice.rotation.y = Math.PI / 8;
    iemGroup.add(octCornice);

    // 8-Faceted Pitched Hipped Royal Blue Metal Standing-Seam Roof
    const roofPitchH = 3.2;
    const pyramidRoof = new THREE.Mesh(
      new THREE.ConeGeometry(octRadius + 0.5, roofPitchH, 8),
      iemRoofBlueMat
    );
    pyramidRoof.position.y = bldgH + octH + roofPitchH / 2;
    pyramidRoof.rotation.y = Math.PI / 8;
    pyramidRoof.castShadow = true;
    iemGroup.add(pyramidRoof);

    // 8 Hip Ridge Caps along the seam joints
    for (let r = 0; r < 8; r++) {
      const ridgeAngle = (r / 8) * Math.PI * 2 + Math.PI / 8;
      const ridgeLen = Math.sqrt(octRadius * octRadius + roofPitchH * roofPitchH);
      const ridgePitch = Math.atan2(octRadius, roofPitchH);

      const ridgeMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, ridgeLen, 6),
        iemRoyalBlueMat
      );
      ridgeMesh.position.set(
        Math.sin(ridgeAngle) * (octRadius * 0.5),
        bldgH + octH + roofPitchH * 0.5,
        Math.cos(ridgeAngle) * (octRadius * 0.5)
      );
      ridgeMesh.rotation.y = ridgeAngle;
      ridgeMesh.rotation.z = -ridgePitch;
      iemGroup.add(ridgeMesh);
    }

    // Hexagonal Ventilator Cap / Lantern at Apex
    const ventCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 1.2, 0.7, 8),
      iemSkyBlueMat
    );
    ventCap.position.y = bldgH + octH + roofPitchH + 0.35;
    iemGroup.add(ventCap);

    // Central Lightning Arrestor Spire
    const spire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.08, 2.4, 8),
      iemSteelMat
    );
    spire.position.y = bldgH + octH + roofPitchH + 1.6;
    iemGroup.add(spire);

    // -------------------------------------------------------------------------
    // 7. ROOFTOP INFRASTRUCTURE: "PATTON" WATER STORAGE TANKS & HVAC PENTHOUSE
    // (Seen in Photo 2: media_1789203701308)
    // -------------------------------------------------------------------------
    // Concrete equipment plinth on roof deck
    const equipPlinth = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.25, 2.2),
      iemPlinthMat
    );
    equipPlinth.position.set(-6.8, bldgH + 0.12, -6.8);
    iemGroup.add(equipPlinth);

    // 3 Black Cylindrical "PATTON" Water Tanks
    const numTanks = 3;
    for (let tk = 0; tk < numTanks; tk++) {
      const tx = -8.2 + tk * 1.4;
      const tank = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 1.3, 16),
        iemTankBlackMat
      );
      tank.position.set(tx, bldgH + 0.25 + 0.65, -6.8);
      tank.castShadow = true;
      iemGroup.add(tank);

      // Tank top lid
      const lid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.56, 0.15, 16),
        iemTankBlackMat
      );
      lid.position.set(tx, bldgH + 0.25 + 1.35, -6.8);
      iemGroup.add(lid);

      // White "PATTON" text stripe around tank center
      const labelStripe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.56, 0.56, 0.25, 16, 1, true),
        iemWhiteMat
      );
      labelStripe.position.set(tx, bldgH + 0.25 + 0.7, -6.8);
      iemGroup.add(labelStripe);
    }

    // Interconnecting black PVC plumbing pipes
    const pipeRun = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 3.6, 8),
      iemSteelMat
    );
    pipeRun.rotation.z = Math.PI / 2;
    pipeRun.position.set(-6.8, bldgH + 1.2, -6.1);
    iemGroup.add(pipeRun);

    // Blue Mechanical / AC Chiller Penthouse Enclosure (Right roof side)
    const mechEnclosure = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 1.8, 2.6),
      iemRoyalBlueMat
    );
    mechEnclosure.position.set(6.5, bldgH + 0.9, -6.5);
    mechEnclosure.castShadow = true;
    iemGroup.add(mechEnclosure);

    const mechLouver = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 1.4),
      iemLouverMat
    );
    mechLouver.position.set(6.5, bldgH + 0.9, -6.5 + 1.32);
    iemGroup.add(mechLouver);

    // -------------------------------------------------------------------------
    // 8. RED FIRE PROTECTION PIPEWORK & PLINTH UTILITIES
    // (Seen in Photo 2 & 3 along the building base)
    // -------------------------------------------------------------------------
    // Circular red pipe running along the base plinth
    const pipeRadius = radius + 0.28;
    const redPipe = new THREE.Mesh(
      new THREE.TorusGeometry(pipeRadius, 0.035, 8, 48),
      iemRedPipeMat
    );
    redPipe.rotation.x = Math.PI / 2;
    redPipe.position.y = 0.45;
    iemGroup.add(redPipe);

    // Red Fire Hydrant Box mounted near entrance
    const hydrantBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.65, 0.25),
      iemRedPipeMat
    );
    hydrantBox.position.set(-10.2, 1.1, -11.5);
    hydrantBox.rotation.y = entranceAngle;
    iemGroup.add(hydrantBox);

    // -------------------------------------------------------------------------
    // 9. NORTH-WEST ENTRANCE PLAZA (RED & YELLOW CHECKERED PAVERS)
    // (Seen in Photo 2: media_1789203701308 and Satellite Photo 1)
    // -------------------------------------------------------------------------
    const plazaCanvas = document.createElement('canvas');
    plazaCanvas.width = 1024;
    plazaCanvas.height = 1024;
    const pzCtx = plazaCanvas.getContext('2d')!;

    // Base warm buff paver
    pzCtx.fillStyle = '#fde047'; // Bright yellow
    pzCtx.fillRect(0, 0, 1024, 1024);

    // Diagonal Terracotta Red Stripes and Diamond Patterns (Photo 2)
    pzCtx.fillStyle = '#dc2626'; // Terracotta red
    const tileSize = 64;
    for (let px = 0; px < 1024; px += tileSize) {
      for (let py = 0; py < 1024; py += tileSize) {
        if (((px + py) / tileSize) % 2 === 0) {
          pzCtx.fillRect(px, py, tileSize, tileSize);
        }
      }
    }

    // Border and grout lines
    pzCtx.strokeStyle = '#451a03';
    pzCtx.lineWidth = 2;
    for (let px = 0; px <= 1024; px += tileSize) {
      pzCtx.beginPath();
      pzCtx.moveTo(px, 0);
      pzCtx.lineTo(px, 1024);
      pzCtx.stroke();
    }
    for (let py = 0; py <= 1024; py += tileSize) {
      pzCtx.beginPath();
      pzCtx.moveTo(0, py);
      pzCtx.lineTo(1024, py);
      pzCtx.stroke();
    }

    const plazaTexture = new THREE.CanvasTexture(plazaCanvas);
    plazaTexture.wrapS = THREE.RepeatWrapping;
    plazaTexture.wrapT = THREE.RepeatWrapping;
    plazaTexture.repeat.set(6, 6);

    const plazaMat = new THREE.MeshStandardMaterial({
      map: plazaTexture,
      roughness: 0.85,
      metalness: 0.1
    });

    // Paved apron extending outward in front of the entrance steps
    const plazaMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 14),
      plazaMat
    );
    plazaMesh.rotation.x = -Math.PI / 2;
    plazaMesh.rotation.z = entranceAngle - Math.PI / 2;
    plazaMesh.position.set(-11.5, 0.02, -11.5);
    plazaMesh.receiveShadow = true;
    iemGroup.add(plazaMesh);

    // -------------------------------------------------------------------------
    // 10. RAISED CIRCULAR TREE PLANTER IN FORECOURT
    // (Seen in Photo 2: media_1789203701308 in front of the red & yellow paving)
    // -------------------------------------------------------------------------
    const planterGroup = new THREE.Group();
    planterGroup.position.set(-11.0, 0, -11.0);

    // Outer concrete planter curb with sky blue paint and white coping
    const planterOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(2.3, 2.35, 0.55, 32),
      iemSkyBlueMat
    );
    planterOuter.position.y = 0.275;
    planterOuter.castShadow = true;
    planterGroup.add(planterOuter);

    const planterCoping = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.4, 0.12, 32),
      iemWhiteMat
    );
    planterCoping.position.y = 0.58;
    planterGroup.add(planterCoping);

    // Soil infill
    const soil = new THREE.Mesh(
      new THREE.CylinderGeometry(2.1, 2.1, 0.1, 32),
      new THREE.MeshStandardMaterial({ color: '#271c14', roughness: 0.95 })
    );
    soil.position.y = 0.52;
    planterGroup.add(soil);

    // Mature leafy shade tree (Photo 2)
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.26, 3.8, 8),
      iemTreeTrunkMat
    );
    trunk.position.y = 2.4;
    trunk.castShadow = true;
    planterGroup.add(trunk);

    // Multitier foliage canopy
    [
      { y: 4.2, r: 2.2 },
      { y: 5.4, r: 1.8 },
      { y: 6.4, r: 1.2 }
    ].forEach(tier => {
      const fol = new THREE.Mesh(
        new THREE.DodecahedronGeometry(tier.r, 1),
        iemTreeFoliageMat
      );
      fol.position.y = tier.y;
      fol.castShadow = true;
      planterGroup.add(fol);
    });

    iemGroup.add(planterGroup);

    // -------------------------------------------------------------------------
    // 11. NORTH PAVED PLAZA WITH 4x5 SHADE TREE GROVE
    // (Visible in Satellite Photo 1: media_1789203664807 immediately north of the building)
    // -------------------------------------------------------------------------
    const groveGroup = new THREE.Group();
    groveGroup.position.set(-2.0, 0, -22.0);

    const grovePaving = new THREE.Mesh(
      new THREE.PlaneGeometry(15.0, 13.0),
      iemPlinthMat
    );
    grovePaving.rotation.x = -Math.PI / 2;
    grovePaving.position.y = 0.015;
    grovePaving.receiveShadow = true;
    groveGroup.add(grovePaving);

    // 4 rows x 5 columns grid of square tree pits & shade trees
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        const gx = -5.6 + col * 2.8;
        const gz = -4.5 + row * 3.0;

        // Square tree pit curb
        const pitCurb = new THREE.Mesh(
          new THREE.BoxGeometry(1.0, 0.08, 1.0),
          iemGraniteMat
        );
        pitCurb.position.set(gx, 0.05, gz);
        groveGroup.add(pitCurb);

        // Young shade tree
        const gTrunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.12, 2.4, 6),
          iemTreeTrunkMat
        );
        gTrunk.position.set(gx, 1.2, gz);
        gTrunk.castShadow = true;
        groveGroup.add(gTrunk);

        const gCrown = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.95, 1),
          iemTreeFoliageMat
        );
        gCrown.position.set(gx, 2.6, gz);
        gCrown.castShadow = true;
        groveGroup.add(gCrown);
      }
    }
    iemGroup.add(groveGroup);

    // -------------------------------------------------------------------------
    // 12. CONNECTING PAVED WALKWAY TO THE CAMPUS ROAD SIDEWALK
    // -------------------------------------------------------------------------
    const walkwayGeom = new THREE.PlaneGeometry(10.0, 4.5);
    const walkwayMesh = new THREE.Mesh(walkwayGeom, iemPlinthMat);
    walkwayMesh.rotation.x = -Math.PI / 2;
    walkwayMesh.rotation.z = -0.16;
    walkwayMesh.position.set(-20.0, 0.018, -10.0);
    walkwayMesh.receiveShadow = true;
    iemGroup.add(walkwayMesh);

    iemGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-industrial', isBuilding: true };
    });

    ctx.scene.add(iemGroup);
    ctx.buildingMeshes.set('bldg-industrial', iemGroup);
    ctx.createBuildingLabel('bldg-industrial', 'CIRCULAR ACADEMIC BUILDING (IEM & EXAM)', [70, 20, 122]);
  }

  private static setupSportsGround(ctx: BuilderContext): void {
    const sports = new THREE.Group();
    sports.position.set(-65, 0.04, -40);
    sports.name = 'bldg-sports';

    const pitch = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 36),
      new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.92 })
    );
    pitch.rotation.x = -Math.PI / 2;
    pitch.receiveShadow = true;
    sports.add(pitch);

    const track = new THREE.Mesh(
      new THREE.RingGeometry(21, 27, 36),
      new THREE.MeshStandardMaterial({ color: '#b91c1c', roughness: 0.88 })
    );
    track.rotation.x = -Math.PI / 2;
    track.position.y = 0.01;
    sports.add(track);

    const cricketPitch = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 15),
      new THREE.MeshStandardMaterial({ color: '#ca8a04', roughness: 0.95 })
    );
    cricketPitch.rotation.x = -Math.PI / 2;
    cricketPitch.position.y = 0.02;
    sports.add(cricketPitch);

    const goalMat = new THREE.MeshStandardMaterial({ color: '#ffffff' });
    [-18, 18].forEach(gz => {
      const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8), goalMat);
      postL.position.set(-3.5, 1.4, gz);
      sports.add(postL);

      const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8), goalMat);
      postR.position.set(3.5, 1.4, gz);
      sports.add(postR);

      const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 7), goalMat);
      crossbar.rotation.z = Math.PI / 2;
      crossbar.position.set(0, 2.8, gz);
      sports.add(crossbar);
    });

    sports.traverse(child => {
      child.userData = { buildingId: 'bldg-sports', isBuilding: true };
    });

    ctx.scene.add(sports);
    ctx.buildingMeshes.set('bldg-sports', sports);
    ctx.createBuildingLabel('bldg-sports', "MAKAUT SPORT'S GROUND", [-65, 8, -40]);
  }
}
