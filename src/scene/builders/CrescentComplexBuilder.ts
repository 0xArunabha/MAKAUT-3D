import * as THREE from 'three';
import type { BuilderContext } from './types';

export interface CrescentComplexResult {
  radioBeaconLight: THREE.PointLight;
}

export class CrescentComplexBuilder {
  public static buildCrescentComplex(ctx: BuilderContext): CrescentComplexResult {
    this.setupMainGate(ctx);
    const radioBeaconLight = this.setupTwinCrescentComplex(ctx);
    return { radioBeaconLight };
  }

  private static setupMainGate(ctx: BuilderContext): void {
    // =========================================================================
    // MAKAUT MAIN GATE (WBUT) ON NH-12 (Centroid [156, 0, 41])
    // Comprehensive Authentic Reconstruction from Ground Photos (Front & Back Views):
    // 1. Dual Curved Blue Box Girders (Front at X=+0.85, Rear at X=-0.85) with open pergola gap
    // 2. 7 Transverse Cross-Rafter Pergola Beams with recessed soffit downlight fixtures
    // 3. 3D Cutout Block Lettering on top rim: "MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B."
    //    Front beam subtitle face: "FORMERLY, WEST BENGAL UNIVERSITY OF TECHNOLOGY"
    // 4. Two Tall Vertical Blade Pylons with angled fin caps puncturing through the arch
    //    Inner faces feature 4 vertical rectangular slit windows with white reveals
    // 5. Left "W" (WBUT) Chevron Monument with diagonal blue beams, horizontal louvers/brick infill, & University Crest
    // 6. Security Guard Cabin (Detailed Front & Back):
    //    - Front: 4-pane white observation window, notice boards, blue drip eave
    //    - Roof: Black cylindrical Sintex water tank with PVC piping
    //    - Back (Photo 1 inside view): Rear door, grilled window, rainwater downpipes
    // 7. Structural Steel Sliding Gate with 6 bays of crisp white diagonal 'X' & diamond rhombus panels
    // 8. Interior Campus Side (Photo 1): Galvanized street lighting mast with dolphin waste receptacle
    // 9. Exterior NH-12 Side (Photo 2 & 3): Ceremonial inaugural banner, blue wall with security barbed wire brackets
    // =========================================================================
    const gateGroup = new THREE.Group();
    gateGroup.position.set(156, 0, 41);
    gateGroup.rotation.y = -0.15;
    gateGroup.name = 'bldg-gate';

    // Specialized Authentic Materials
    const gateRoyalBlue = new THREE.MeshStandardMaterial({ color: '#1d4ed8', roughness: 0.38, metalness: 0.25 });
    const gateSkyBlue = new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.45, metalness: 0.1 });
    const gatePaleBlue = new THREE.MeshStandardMaterial({ color: '#93c5fd', roughness: 0.6 });
    const gateWhite = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.35 });
    const gateDarkGlass = new THREE.MeshStandardMaterial({ color: '#0a192f', roughness: 0.1, metalness: 0.9 });
    const concreteMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.85 });
    const steelMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.5, metalness: 0.8 });
    const galvSteelMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.4, metalness: 0.7 });
    const blackMat = new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.8 });
    const lightGlowMat = new THREE.MeshBasicMaterial({ color: '#fef08a' });

    const zMin = -11.0;
    const zMax = 6.2;
    const roadCenterZ = -2.3;
    const steps = 36;

    // =========================================================================
    // 1. DUAL CURVED BLUE BOX GIRDERS (Front & Rear) WITH PERGOLA CROSS-RAFTERS
    // Clear open gap between front & rear girders as visible in Photo 1, 2 & 3!
    // =========================================================================
    const createGirderGeometry = () => {
      const shape = new THREE.Shape();

      // Bottom curved edge
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const z = zMin + t * (zMax - zMin);
        const u = (z - roadCenterZ) / 8.2;
        const y = 6.6 + u * u * 2.1;
        if (i === 0) shape.moveTo(z, y);
        else shape.lineTo(z, y);
      }

      // Left cantilevered upturned horn tip
      shape.lineTo(zMax + 0.9, 10.5);
      shape.lineTo(zMax + 0.3, 11.3);

      // Top curved edge (reverse)
      for (let i = steps; i >= 0; i--) {
        const t = i / steps;
        const z = zMin + t * (zMax - zMin);
        const u = (z - roadCenterZ) / 8.2;
        const y = 8.3 + u * u * 1.7;
        shape.lineTo(z, y);
      }

      // Right cantilevered upturned horn tip
      shape.lineTo(zMin - 0.3, 11.3);
      shape.lineTo(zMin - 0.9, 10.5);
      shape.closePath();

      const geom = new THREE.ExtrudeGeometry(shape, {
        depth: 0.45,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 1
      });
      geom.translate(0, 0, -0.225);
      geom.rotateY(-Math.PI / 2);
      return geom;
    };

    // Front Girder (Facing NH-12 at X = +0.85)
    const frontGirderMesh = new THREE.Mesh(createGirderGeometry(), gateRoyalBlue);
    frontGirderMesh.position.set(0.85, 0, 0);
    frontGirderMesh.castShadow = true;
    frontGirderMesh.receiveShadow = true;
    gateGroup.add(frontGirderMesh);

    // Rear Girder (Facing Campus Interior at X = -0.85)
    const rearGirderMesh = new THREE.Mesh(createGirderGeometry(), gateRoyalBlue);
    rearGirderMesh.position.set(-0.85, 0, 0);
    rearGirderMesh.castShadow = true;
    rearGirderMesh.receiveShadow = true;
    gateGroup.add(rearGirderMesh);

    // White rim trims along upper curved contours
    const createRimTrim = (xOffset: number) => {
      const trimShape = new THREE.Shape();
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const z = zMin + t * (zMax - zMin);
        const u = (z - roadCenterZ) / 8.2;
        const y = 8.25 + u * u * 1.7;
        if (i === 0) trimShape.moveTo(z, y);
        else trimShape.lineTo(z, y);
      }
      for (let i = steps; i >= 0; i--) {
        const t = i / steps;
        const z = zMin + t * (zMax - zMin);
        const u = (z - roadCenterZ) / 8.2;
        const y = 8.45 + u * u * 1.7;
        trimShape.lineTo(z, y);
      }
      trimShape.closePath();

      const geom = new THREE.ExtrudeGeometry(trimShape, { depth: 0.52, bevelEnabled: false });
      geom.translate(0, 0, -0.26);
      geom.rotateY(-Math.PI / 2);
      geom.translate(xOffset, 0, 0);
      return new THREE.Mesh(geom, gateWhite);
    };

    gateGroup.add(createRimTrim(0.85));
    gateGroup.add(createRimTrim(-0.85));

    // 1.2 7 Transverse Cross-Rafter Pergola Beams with Recessed Downlights
    const numRafters = 7;
    for (let r = 0; r < numRafters; r++) {
      const rt = (r + 0.5) / numRafters;
      const rz = zMin + 1.8 + rt * (zMax - zMin - 3.6);
      const ru = (rz - roadCenterZ) / 8.2;
      const ry = 7.4 + ru * ru * 1.8;

      const rafter = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.35, 0.35), gateRoyalBlue);
      rafter.position.set(0, ry, rz);
      rafter.castShadow = true;
      gateGroup.add(rafter);

      // Recessed circular soffit downlight under each rafter
      const lightFitting = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 12), blackMat);
      lightFitting.position.set(0, ry - 0.18, rz);
      gateGroup.add(lightFitting);

      const lightLens = new THREE.Mesh(new THREE.CircleGeometry(0.1, 12), lightGlowMat);
      lightLens.rotation.x = Math.PI / 2;
      lightLens.position.set(0, ry - 0.21, rz);
      gateGroup.add(lightLens);
    }

    // 1.3 AUTHENTIC GATE TYPOGRAPHY & STANDING 3D CUTOUT LETTERS
    // Photorealistic replication from ground photos (media_1788913697543.jpg & media_1788913588557.png):
    // 1. Standing 3D Block Letters crown standing tall on the front arch rim:
    //    "MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B." (visible from exterior and interior)
    // 2. Front Beam Face Subtitle:
    //    "FORMERLY, WEST BENGAL UNIVERSITY OF TECHNOLOGY"
    // 3. Rear Girder Face (facing campus interior):
    //    "MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B." & "HARINGHATA MAIN CAMPUS"

    // Helper to generate a curved vertical quad-strip mesh along the arch
    const createCurvedRibbon = (
      xPos: number,
      zStart: number, // Z coordinate where U=0 is located
      zEnd: number,   // Z coordinate where U=1 is located
      yBottomFn: (z: number) => number,
      heightFn: (z: number) => number,
      material: THREE.Material
    ) => {
      const geom = new THREE.BufferGeometry();
      const segments = 48;
      const positions: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const z = zStart + t * (zEnd - zStart);
        const yBot = yBottomFn(z);
        const yTop = yBot + heightFn(z);

        positions.push(xPos, yBot, z);
        uvs.push(t, 0);

        positions.push(xPos, yTop, z);
        uvs.push(t, 1);
      }

      for (let i = 0; i < segments; i++) {
        const v00 = i * 2;
        const v01 = i * 2 + 1;
        const v10 = (i + 1) * 2;
        const v11 = (i + 1) * 2 + 1;

        indices.push(v00, v10, v11);
        indices.push(v00, v11, v01);
      }

      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geom.setIndex(indices);
      geom.computeVertexNormals();

      return new THREE.Mesh(geom, material);
    };

    // -------------------------------------------------------------------------
    // A. STANDING 3D CUTOUT BLOCK LETTERS ON TOP OF ARCH RIM
    // Stands vertically from Y = 8.45 + u^2*1.7 up to +1.28m, silhouetted against the sky
    // -------------------------------------------------------------------------
    const standingCanvas = document.createElement('canvas');
    standingCanvas.width = 2048;
    standingCanvas.height = 256;
    const stCtx = standingCanvas.getContext('2d')!;

    // Transparent background
    stCtx.clearRect(0, 0, 2048, 256);

    // University Logo Crest Circle on far left
    stCtx.fillStyle = '#1e3a8a';
    stCtx.beginPath();
    stCtx.arc(110, 130, 60, 0, Math.PI * 2);
    stCtx.fill();
    stCtx.strokeStyle = '#ffffff';
    stCtx.lineWidth = 7;
    stCtx.stroke();
    stCtx.strokeStyle = '#f59e0b';
    stCtx.lineWidth = 3;
    stCtx.stroke();
    stCtx.fillStyle = '#f59e0b';
    stCtx.beginPath();
    stCtx.arc(110, 130, 30, 0, Math.PI * 2);
    stCtx.fill();

    // Bold 3D Letters: "MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B."
    stCtx.font = 'bold 64px "Arial Black", "Impact", "Arial", sans-serif';
    stCtx.textAlign = 'center';
    stCtx.textBaseline = 'middle';

    // Dark solid drop outline for 3D depth and sky contrast
    stCtx.lineJoin = 'round';
    stCtx.strokeStyle = '#020617';
    stCtx.lineWidth = 14;
    stCtx.strokeText('MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B.', 1110, 130);

    // Secondary deep royal blue bevel
    stCtx.strokeStyle = '#1d4ed8';
    stCtx.lineWidth = 8;
    stCtx.strokeText('MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B.', 1110, 130);

    // Brilliant white cutout letter face
    stCtx.fillStyle = '#ffffff';
    stCtx.fillText('MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B.', 1110, 130);

    // Subtle highlight on letter top edge
    stCtx.fillStyle = '#f8fafc';
    stCtx.fillText('MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B.', 1110, 127);

    const standingTexture = new THREE.CanvasTexture(standingCanvas);
    standingTexture.minFilter = THREE.LinearFilter;

    const standingMat = new THREE.MeshStandardMaterial({
      map: standingTexture,
      transparent: true,
      alphaTest: 0.12,
      side: THREE.DoubleSide,
      roughness: 0.25,
      metalness: 0.15,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.35
    });

    // Front face standing on front girder rim (facing NH-12, Z: +4.8 -> -9.8)
    const standingFront = createCurvedRibbon(
      0.86,
      4.8,
      -9.8,
      (z) => {
        const u = (z - roadCenterZ) / 8.2;
        return 8.45 + u * u * 1.7;
      },
      () => 1.28,
      standingMat
    );
    gateGroup.add(standingFront);

    // Rear face of standing letters (for interior campus view, readable left-to-right from -Z to +Z)
    const standingRearCanvas = document.createElement('canvas');
    standingRearCanvas.width = 2048;
    standingRearCanvas.height = 256;
    const strCtx = standingRearCanvas.getContext('2d')!;
    strCtx.clearRect(0, 0, 2048, 256);

    strCtx.font = 'bold 64px "Arial Black", "Impact", "Arial", sans-serif';
    strCtx.textAlign = 'center';
    strCtx.textBaseline = 'middle';
    strCtx.lineJoin = 'round';
    strCtx.strokeStyle = '#020617';
    strCtx.lineWidth = 14;
    strCtx.strokeText('MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B.', 938, 130);
    strCtx.strokeStyle = '#1d4ed8';
    strCtx.lineWidth = 8;
    strCtx.strokeText('MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B.', 938, 130);
    strCtx.fillStyle = '#ffffff';
    strCtx.fillText('MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B.', 938, 130);
    strCtx.fillStyle = '#f8fafc';
    strCtx.fillText('MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B.', 938, 127);

    // Logo Crest on far right for reverse view
    strCtx.fillStyle = '#1e3a8a';
    strCtx.beginPath();
    strCtx.arc(1938, 130, 60, 0, Math.PI * 2);
    strCtx.fill();
    strCtx.strokeStyle = '#ffffff';
    strCtx.lineWidth = 7;
    strCtx.stroke();
    strCtx.strokeStyle = '#f59e0b';
    strCtx.lineWidth = 3;
    strCtx.stroke();
    strCtx.fillStyle = '#f59e0b';
    strCtx.beginPath();
    strCtx.arc(1938, 130, 30, 0, Math.PI * 2);
    strCtx.fill();

    const standingRearTexture = new THREE.CanvasTexture(standingRearCanvas);
    standingRearTexture.minFilter = THREE.LinearFilter;
    const standingRearMat = new THREE.MeshStandardMaterial({
      map: standingRearTexture,
      transparent: true,
      alphaTest: 0.12,
      side: THREE.DoubleSide,
      roughness: 0.25,
      metalness: 0.15,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.35
    });

    const standingRear = createCurvedRibbon(
      0.84,
      -9.8,
      4.8,
      (z) => {
        const u = (z - roadCenterZ) / 8.2;
        return 8.45 + u * u * 1.7;
      },
      () => 1.28,
      standingRearMat
    );
    gateGroup.add(standingRear);

    // -------------------------------------------------------------------------
    // B. FRONT BEAM FACE SUBTITLE (Facing NH-12 at X = 1.14)
    // "FORMERLY, WEST BENGAL UNIVERSITY OF TECHNOLOGY"
    // -------------------------------------------------------------------------
    const subtitleCanvas = document.createElement('canvas');
    subtitleCanvas.width = 2048;
    subtitleCanvas.height = 128;
    const subCtx = subtitleCanvas.getContext('2d')!;
    subCtx.clearRect(0, 0, 2048, 128);

    subCtx.font = 'bold 46px "Arial Black", "Arial", sans-serif';
    subCtx.textAlign = 'center';
    subCtx.textBaseline = 'middle';
    subCtx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    subCtx.shadowBlur = 10;
    subCtx.shadowOffsetY = 4;
    subCtx.strokeStyle = 'rgba(2, 6, 23, 0.8)';
    subCtx.lineWidth = 6;
    subCtx.strokeText('FORMERLY, WEST BENGAL UNIVERSITY OF TECHNOLOGY', 1024, 64);
    subCtx.fillStyle = '#ffffff';
    subCtx.fillText('FORMERLY, WEST BENGAL UNIVERSITY OF TECHNOLOGY', 1024, 64);

    const subtitleTexture = new THREE.CanvasTexture(subtitleCanvas);
    subtitleTexture.minFilter = THREE.LinearFilter;
    const subtitleMat = new THREE.MeshStandardMaterial({
      map: subtitleTexture,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.35,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.25
    });

    const frontSubtitleMesh = createCurvedRibbon(
      1.14,
      2.6,
      -7.2,
      (z) => {
        const u = (z - roadCenterZ) / 8.2;
        return 7.05 + u * u * 1.9;
      },
      () => 0.82,
      subtitleMat
    );
    gateGroup.add(frontSubtitleMesh);

    // -------------------------------------------------------------------------
    // C. REAR GIRDER BEAM FACE SIGN (Facing Campus Interior at X = -1.14)
    // "MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B."
    // "HARINGHATA MAIN CAMPUS"
    // -------------------------------------------------------------------------
    const rearBeamCanvas = document.createElement('canvas');
    rearBeamCanvas.width = 2048;
    rearBeamCanvas.height = 256;
    const rbCtx = rearBeamCanvas.getContext('2d')!;
    rbCtx.clearRect(0, 0, 2048, 256);

    rbCtx.font = 'bold 56px "Arial Black", "Impact", sans-serif';
    rbCtx.textAlign = 'center';
    rbCtx.textBaseline = 'middle';
    rbCtx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    rbCtx.shadowBlur = 10;
    rbCtx.shadowOffsetY = 4;
    rbCtx.strokeStyle = 'rgba(2, 6, 23, 0.85)';
    rbCtx.lineWidth = 8;
    rbCtx.strokeText('MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B.', 1024, 85);
    rbCtx.fillStyle = '#ffffff';
    rbCtx.fillText('MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, W.B.', 1024, 85);

    rbCtx.font = 'bold 36px "Arial", sans-serif';
    rbCtx.fillStyle = '#fef08a'; // Bright yellow-gold
    rbCtx.fillText('HARINGHATA MAIN CAMPUS', 1024, 175);

    const rearBeamTexture = new THREE.CanvasTexture(rearBeamCanvas);
    rearBeamTexture.minFilter = THREE.LinearFilter;
    const rearBeamMat = new THREE.MeshStandardMaterial({
      map: rearBeamTexture,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.35,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.25
    });

    const rearBeamMesh = createCurvedRibbon(
      -1.14,
      -9.2,
      4.6,
      (z) => {
        const u = (z - roadCenterZ) / 8.2;
        return 6.95 + u * u * 1.9;
      },
      () => 1.15,
      rearBeamMat
    );
    gateGroup.add(rearBeamMesh);

    // =========================================================================
    // 2. THE TWO TALL VERTICAL BLADE PYLONS WITH RECTANGULAR SLIT WINDOWS
    // Puncture through the arch with angled architectural top fins
    // =========================================================================
    const createBladePylon = (pz: number, slitsFacingZ: number) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(0, 0, pz);

      // Foundation concrete plinth
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.6, 2.0), concreteMat);
      plinth.position.y = 0.3;
      pGroup.add(plinth);

      // Main structural pier body
      const pylonBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 9.6, 1.6), gateRoyalBlue);
      pylonBody.position.y = 5.1;
      pylonBody.castShadow = true;
      pylonBody.receiveShadow = true;
      pGroup.add(pylonBody);

      // Angled architectural fin top (extending above the arch to Y = 11.2m)
      const finShape = new THREE.Shape();
      finShape.moveTo(-1.2, 9.9);
      finShape.lineTo(1.2, 9.9);
      finShape.lineTo(0.6, 11.4);
      finShape.lineTo(-1.2, 10.6);
      finShape.closePath();

      const finGeom = new THREE.ExtrudeGeometry(finShape, { depth: 1.5, bevelEnabled: false });
      finGeom.translate(0, 0, -0.75);
      finGeom.rotateY(Math.PI / 2);
      const finMesh = new THREE.Mesh(finGeom, gateRoyalBlue);
      pGroup.add(finMesh);

      // 4 Vertical rectangular slit windows with white reveals (Seen in Photo 1 & 2!)
      const numSlits = 4;
      for (let s = 0; s < numSlits; s++) {
        const sy = 4.4 + s * 1.3;

        // Slit white frame reveal
        const slitFrame = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.05, 0.28), gateWhite);
        slitFrame.position.set(0, sy, slitsFacingZ * 0.72);
        pGroup.add(slitFrame);

        // Slit dark void
        const slitVoid = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.95, 0.30), gateDarkGlass);
        slitVoid.position.set(0, sy, slitsFacingZ * 0.72);
        pGroup.add(slitVoid);
      }

      return pGroup;
    };

    const leftPylon = createBladePylon(3.2, -1); // Left pylon, slits face road (-Z)
    gateGroup.add(leftPylon);

    const rightPylon = createBladePylon(-7.8, 1); // Right pylon, slits face road (+Z)
    gateGroup.add(rightPylon);

    // =========================================================================
    // 3. THE "W" (WBUT) CHEVRON MONUMENT (Left Side: Z = 5.5 to 12.5)
    // Diagonal chevron beams, horizontal louvers/brickwork pattern & University Crest
    // =========================================================================
    const wMonumentGroup = new THREE.Group();
    wMonumentGroup.position.set(0, 0, 8.8);

    // Foundation plinth
    const wPlinth = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 7.2), concreteMat);
    wPlinth.position.y = 0.4;
    wPlinth.castShadow = true;
    wMonumentGroup.add(wPlinth);

    // Lower sky-blue pedestal wall
    const wBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 6.8), gateSkyBlue);
    wBase.position.y = 1.5;
    wBase.castShadow = true;
    wMonumentGroup.add(wBase);

    // Infill panel with horizontal louvers / brick pattern behind the "W" (Seen in Photo 2 & 3!)
    const louverPanel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.8, 5.8), gatePaleBlue);
    louverPanel.position.set(0, 4.8, 0);
    wMonumentGroup.add(louverPanel);

    // Horizontal louver slats
    const numLouvers = 12;
    for (let l = 0; l < numLouvers; l++) {
      const ly = 2.4 + l * 0.45;
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 5.7), gateWhite);
      slat.position.set(0, ly, 0);
      wMonumentGroup.add(slat);
    }

    // Outer triangular chevron framing legs in MAKAUT Royal Blue
    const chevronLegL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7.6, 0.65), gateRoyalBlue);
    chevronLegL.position.set(0, 5.2, -2.2);
    chevronLegL.rotation.x = -0.34;
    chevronLegL.castShadow = true;
    wMonumentGroup.add(chevronLegL);

    const chevronLegR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7.6, 0.65), gateRoyalBlue);
    chevronLegR.position.set(0, 5.2, 2.2);
    chevronLegR.rotation.x = 0.34;
    chevronLegR.castShadow = true;
    wMonumentGroup.add(chevronLegR);

    // Inner "W" chevron struts in Sky Blue and White
    const wStrutL = new THREE.Mesh(new THREE.BoxGeometry(0.85, 5.6, 0.5), gateSkyBlue);
    wStrutL.position.set(0, 4.4, -1.1);
    wStrutL.rotation.x = 0.36;
    wStrutL.castShadow = true;
    wMonumentGroup.add(wStrutL);

    const wStrutR = new THREE.Mesh(new THREE.BoxGeometry(0.85, 5.6, 0.5), gateSkyBlue);
    wStrutR.position.set(0, 4.4, 1.1);
    wStrutR.rotation.x = -0.36;
    wStrutR.castShadow = true;
    wMonumentGroup.add(wStrutR);

    // University Crest Shield on the monument
    const crestCanvas = document.createElement('canvas');
    crestCanvas.width = 512;
    crestCanvas.height = 512;
    const cCtx = crestCanvas.getContext('2d')!;

    cCtx.fillStyle = '#1e3a8a';
    cCtx.beginPath();
    cCtx.moveTo(256, 32);
    cCtx.lineTo(440, 110);
    cCtx.lineTo(440, 310);
    cCtx.quadraticCurveTo(440, 460, 256, 490);
    cCtx.quadraticCurveTo(72, 460, 72, 310);
    cCtx.lineTo(72, 110);
    cCtx.closePath();
    cCtx.fill();

    cCtx.lineWidth = 16;
    cCtx.strokeStyle = '#f59e0b';
    cCtx.stroke();
    cCtx.lineWidth = 6;
    cCtx.strokeStyle = '#ffffff';
    cCtx.stroke();

    cCtx.fillStyle = '#f59e0b';
    cCtx.beginPath();
    cCtx.arc(256, 220, 75, 0, Math.PI * 2);
    cCtx.fill();

    cCtx.fillStyle = '#1e3a8a';
    cCtx.beginPath();
    cCtx.arc(256, 220, 48, 0, Math.PI * 2);
    cCtx.fill();

    cCtx.fillStyle = '#ea580c';
    cCtx.beginPath();
    cCtx.moveTo(256, 140);
    cCtx.quadraticCurveTo(275, 175, 256, 210);
    cCtx.quadraticCurveTo(237, 175, 256, 140);
    cCtx.fill();

    cCtx.fillStyle = '#ffffff';
    cCtx.fillRect(230, 225, 24, 18);
    cCtx.fillRect(258, 225, 24, 18);

    cCtx.fillStyle = '#f59e0b';
    cCtx.fillRect(128, 340, 256, 52);
    cCtx.strokeStyle = '#ffffff';
    cCtx.lineWidth = 3;
    cCtx.strokeRect(128, 340, 256, 52);

    cCtx.fillStyle = '#0f172a';
    cCtx.font = 'bold 36px "Arial Black", sans-serif';
    cCtx.textAlign = 'center';
    cCtx.textBaseline = 'middle';
    cCtx.fillText('MAKAUT', 256, 366);

    const crestTexture = new THREE.CanvasTexture(crestCanvas);
    const crestMat = new THREE.MeshStandardMaterial({ map: crestTexture, roughness: 0.3, metalness: 0.4 });

    const shieldFront = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.0), crestMat);
    shieldFront.position.set(0.65, 5.4, 0);
    shieldFront.rotation.y = Math.PI / 2;
    wMonumentGroup.add(shieldFront);

    // Dark Polished Granite Foundation Monument Plaque (Ground Photo 3: media_1788913251920.png)
    // Mounted on the front face of wBase facing NH-12
    const plaqueCanvas = document.createElement('canvas');
    plaqueCanvas.width = 2048;
    plaqueCanvas.height = 512;
    const plCtx = plaqueCanvas.getContext('2d')!;

    // Polished dark slate granite background
    plCtx.fillStyle = '#090d16';
    plCtx.fillRect(0, 0, 2048, 512);

    // Subtle stone luster
    const stoneGrad = plCtx.createLinearGradient(0, 0, 2048, 512);
    stoneGrad.addColorStop(0, 'rgba(30, 41, 59, 0.4)');
    stoneGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.1)');
    stoneGrad.addColorStop(1, 'rgba(30, 41, 59, 0.4)');
    plCtx.fillStyle = stoneGrad;
    plCtx.fillRect(0, 0, 2048, 512);

    // Gold engraved decorative frame
    plCtx.lineWidth = 8;
    plCtx.strokeStyle = '#d97706';
    plCtx.strokeRect(24, 24, 2000, 464);
    plCtx.lineWidth = 3;
    plCtx.strokeStyle = '#fef08a';
    plCtx.strokeRect(36, 36, 1976, 440);

    // English Primary Header (Gold Engraved)
    plCtx.fillStyle = '#fef08a';
    plCtx.font = 'bold 50px "Cinzel", "Times New Roman", "Arial", serif';
    plCtx.textAlign = 'center';
    plCtx.textBaseline = 'middle';
    plCtx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    plCtx.shadowBlur = 6;
    plCtx.shadowOffsetY = 3;
    plCtx.fillText('MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY, WEST BENGAL', 1024, 110);

    // Bengali Inscription (White Engraved)
    plCtx.fillStyle = '#ffffff';
    plCtx.font = 'bold 44px "Noto Sans Bengali", "Segoe UI", sans-serif';
    plCtx.fillText('মৌলানা আবুল কালাম আজাদ প্রযুক্তি বিশ্ববিদ্যালয়, পশ্চিমবঙ্গ', 1024, 205);

    // Subtitle (Gold Engraved)
    plCtx.fillStyle = '#fbbf24';
    plCtx.font = 'bold 34px "Arial", sans-serif';
    plCtx.fillText('(FORMERLY KNOWN AS WEST BENGAL UNIVERSITY OF TECHNOLOGY - WBUT)', 1024, 295);

    // Campus Location & Estd
    plCtx.fillStyle = '#94a3b8';
    plCtx.font = 'bold 28px "Arial", sans-serif';
    plCtx.fillText('HARINGHATA MAIN CAMPUS  •  GOVT. OF WEST BENGAL  •  ESTD. 2000', 1024, 385);

    const plaqueTexture = new THREE.CanvasTexture(plaqueCanvas);
    plaqueTexture.minFilter = THREE.LinearFilter;
    const plaqueMat = new THREE.MeshStandardMaterial({
      map: plaqueTexture,
      roughness: 0.25,
      metalness: 0.35
    });

    const plaqueMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.05, 5.8), plaqueMat);
    plaqueMesh.position.set(1.05, 1.5, 0);
    plaqueMesh.castShadow = true;
    wMonumentGroup.add(plaqueMesh);

    // 4 Brass mounting rosettes at corners of plaque
    const brassMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.2, metalness: 0.8 });
    [
      [-2.75, 1.85],
      [2.75, 1.85],
      [-2.75, 1.15],
      [2.75, 1.15]
    ].forEach(([bz, by]) => {
      const rosette = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 12), brassMat);
      rosette.rotation.z = Math.PI / 2;
      rosette.position.set(1.10, by, bz);
      wMonumentGroup.add(rosette);
    });

    gateGroup.add(wMonumentGroup);

    // =========================================================================
    // 4. THE SECURITY GUARD CABIN (Detailed Front & Back Views)
    // Front view: 4-pane sliding window, bulletin board, blue drip eave
    // Back view (Photo 1 inside campus): Rear security door, grilled window, downpipe
    // Roof: Black cylindrical Sintex water tank with PVC pipes
    // =========================================================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0.2, 0, 5.0);

    // Main booth body in MAKAUT Sky Blue
    const cabinBody = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.4, 3.2), gateSkyBlue);
    cabinBody.position.y = 1.7;
    cabinBody.castShadow = true;
    cabinBody.receiveShadow = true;
    cabinGroup.add(cabinBody);

    // White cantilevered roof slab with drip overhang
    const cabinRoof = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.3, 3.6), gateWhite);
    cabinRoof.position.y = 3.55;
    cabinRoof.castShadow = true;
    cabinGroup.add(cabinRoof);

    // Black cylindrical Sintex water tank on roof with PVC pipe (Seen in Photo 1, 2, 3!)
    const waterTank = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 1.2, 16), blackMat);
    waterTank.position.set(0.8, 4.3, -0.4);
    waterTank.castShadow = true;
    cabinGroup.add(waterTank);

    const tankPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8), galvSteelMat);
    tankPipe.position.set(0.2, 4.25, -0.4);
    cabinGroup.add(tankPipe);

    // FRONT (+X side facing NH-12 driveway):
    // Large 4-pane white observation window
    const frontWinFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.5, 2.6), gateWhite);
    frontWinFrame.position.set(2.11, 1.95, -0.1);
    cabinGroup.add(frontWinFrame);

    const frontWinGlass = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.35, 2.45), gateDarkGlass);
    frontWinGlass.position.set(2.11, 1.95, -0.1);
    cabinGroup.add(frontWinGlass);

    // White window mullions dividing the 4 sliding panes
    [-0.6, 0, 0.6].forEach(wz => {
      const mul = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.35, 0.05), gateWhite);
      mul.position.set(2.12, 1.95, -0.1 + wz);
      cabinGroup.add(mul);
    });

    // Small blue drip canopy eave above window
    const winEave = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 2.8), gateRoyalBlue);
    winEave.position.set(2.28, 2.8, -0.1);
    winEave.rotation.z = -0.18;
    cabinGroup.add(winEave);

    // White notice papers / bulletin boards posted beside the window
    const noticeBoard = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 0.9),
      new THREE.MeshStandardMaterial({ color: '#fef3c7', roughness: 0.9 })
    );
    noticeBoard.position.set(2.12, 1.9, 1.2);
    noticeBoard.rotation.y = Math.PI / 2;
    cabinGroup.add(noticeBoard);

    // BACK (-X side facing campus interior - Seen in Photo 1!):
    // Rear security entrance door
    const rearDoor = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.2, 0.95), gateRoyalBlue);
    rearDoor.position.set(-2.11, 1.15, -0.6);
    cabinGroup.add(rearDoor);

    const doorHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.04), galvSteelMat);
    doorHandle.position.set(-2.18, 1.15, -0.3);
    cabinGroup.add(doorHandle);

    // Rear grilled window (seen in Photo 1 next to door)
    const rearWinFrame = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, 0.9), gateWhite);
    rearWinFrame.position.set(-2.11, 2.0, 0.6);
    cabinGroup.add(rearWinFrame);

    const rearWinGlass = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.95, 0.75), gateDarkGlass);
    rearWinGlass.position.set(-2.11, 2.0, 0.6);
    cabinGroup.add(rearWinGlass);

    // Security grill bars
    [-0.22, 0, 0.22].forEach(gz => {
      const grill = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.95, 4), galvSteelMat);
      grill.position.set(-2.18, 2.0, 0.6 + gz);
      cabinGroup.add(grill);
    });

    // Rainwater downpipe running down the rear corner (seen in Photo 1!)
    const downpipe = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.4, 8), concreteMat);
    downpipe.position.set(-2.05, 1.7, 1.48);
    cabinGroup.add(downpipe);

    gateGroup.add(cabinGroup);

    // =========================================================================
    // 5. SLIDING STEEL SECURITY GATE WITH 'X' & DIAMOND RHOMBUS PANELS
    // Spanning the 9-meter roadway opening between the two main pylons (Photo 1 & 2)
    // =========================================================================
    const gateMeshGroup = new THREE.Group();
    gateMeshGroup.position.set(0, 0, 0);

    // Ground embedded steel sliding track
    const gateTrack = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 12.0), steelMat);
    gateTrack.position.set(0, 0.03, -2.5);
    gateTrack.receiveShadow = true;
    gateMeshGroup.add(gateTrack);

    // 6 Decorative Gate Bays spanning from Z = -6.8 to Z = +2.2
    const gateBayW = 1.45;
    const gateH = 2.1;
    const numBays = 6;
    const gateStartz = -6.5;

    for (let b = 0; b < numBays; b++) {
      const bz = gateStartz + b * gateBayW + gateBayW / 2;

      // Outer blue structural box frame
      const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(0.08, gateH, gateBayW), gateRoyalBlue);
      outerFrame.position.set(0, gateH / 2 + 0.1, bz);
      outerFrame.castShadow = true;
      gateMeshGroup.add(outerFrame);

      // Inner white decorative square border
      const innerBorder = new THREE.Mesh(new THREE.BoxGeometry(0.1, gateH - 0.2, gateBayW - 0.2), gateWhite);
      innerBorder.position.set(0, gateH / 2 + 0.1, bz);
      gateMeshGroup.add(innerBorder);

      const innerCut = new THREE.Mesh(new THREE.BoxGeometry(0.12, gateH - 0.35, gateBayW - 0.35), gateRoyalBlue);
      innerCut.position.set(0, gateH / 2 + 0.1, bz);
      gateMeshGroup.add(innerCut);

      // Diagonal 'X' struts in crisp white
      const strutLength = Math.hypot(gateH - 0.35, gateBayW - 0.35);
      const strutAngle = Math.atan2(gateH - 0.35, gateBayW - 0.35);

      const xStrut1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, strutLength, 0.06), gateWhite);
      xStrut1.position.set(0, gateH / 2 + 0.1, bz);
      xStrut1.rotation.x = strutAngle;
      gateMeshGroup.add(xStrut1);

      const xStrut2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, strutLength, 0.06), gateWhite);
      xStrut2.position.set(0, gateH / 2 + 0.1, bz);
      xStrut2.rotation.x = -strutAngle;
      gateMeshGroup.add(xStrut2);

      // Centered white diamond rhombus frame (`[X]` with diamond)
      const diamond = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.55, 0.55), gateWhite);
      diamond.position.set(0, gateH / 2 + 0.1, bz);
      diamond.rotation.x = Math.PI / 4;
      gateMeshGroup.add(diamond);

      const diamondCut = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.42, 0.42), gateRoyalBlue);
      diamondCut.position.set(0, gateH / 2 + 0.1, bz);
      diamondCut.rotation.x = Math.PI / 4;
      gateMeshGroup.add(diamondCut);

      // Top security picket spikes
      [-0.4, 0, 0.4].forEach(px => {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.25, 4), galvSteelMat);
        spike.position.set(0, gateH + 0.22, bz + px);
        gateMeshGroup.add(spike);
      });
    }

    gateGroup.add(gateMeshGroup);

    // =========================================================================
    // 6. CAMPUS INTERIOR SIDE INFRASTRUCTURE (Photo 1 Inside View)
    // Modern galvanized street lighting mast & iconic dolphin waste receptacle
    // =========================================================================
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-2.8, 0, 3.6);

    // Galvanized tubular octagonal street light pole
    const lightPole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 7.2, 8), galvSteelMat);
    lightPole.position.y = 3.6;
    lightPole.castShadow = true;
    lampGroup.add(lightPole);

    // Angled outreach arm
    const lightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 6), galvSteelMat);
    lightArm.position.set(0.6, 7.3, -0.4);
    lightArm.rotation.z = -Math.PI / 4;
    lampGroup.add(lightArm);

    // Modern LED cobra-head luminaire fixture
    const luminaire = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.35), galvSteelMat);
    luminaire.position.set(1.25, 7.8, -0.4);
    lampGroup.add(luminaire);

    const ledLens = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.25), lightGlowMat);
    ledLens.position.set(1.25, 7.72, -0.4);
    lampGroup.add(ledLens);

    // Dolphin-shaped decorative waste bin at the pole base (Authentic from Photo 1!)
    const dolphinGroup = new THREE.Group();
    dolphinGroup.position.set(0.65, 0, 0.2);

    // Pedestal stand in terracotta/wood
    const dPedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.28, 0.5, 12),
      new THREE.MeshStandardMaterial({ color: '#9a3412', roughness: 0.8 })
    );
    dPedestal.position.y = 0.25;
    dolphinGroup.add(dPedestal);

    // Dolphin sculpture body in blue-grey
    const dolphinMat = new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.5, metalness: 0.2 });
    const dBody = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.85, 12), dolphinMat);
    dBody.position.y = 0.85;
    dBody.rotation.z = 0.22;
    dolphinGroup.add(dBody);

    // Dolphin head with open mouth cavity for waste
    const dHead = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), dolphinMat);
    dHead.position.set(0.12, 1.35, 0);
    dolphinGroup.add(dHead);

    const dMouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.14, 0.18),
      new THREE.MeshBasicMaterial({ color: '#09090b' })
    );
    dMouth.position.set(0.24, 1.35, 0);
    dolphinGroup.add(dMouth);

    lampGroup.add(dolphinGroup);
    gateGroup.add(lampGroup);

    // =========================================================================
    // 7. PERIMETER BOUNDARY WALL WITH SECURITY BARBED WIRE BRACKETS
    // Blue boundary wall with concrete coping & angled Y-brackets with wire strands
    // =========================================================================
    const createSecurityWallWithBarbedWire = (startZ: number, endZ: number, xPos: number) => {
      const wGroup = new THREE.Group();
      const wallLen = Math.abs(endZ - startZ);
      const midZ = (startZ + endZ) / 2;

      // Blue masonry wall
      const wall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.2, wallLen), gateRoyalBlue);
      wall.position.set(xPos, 1.1, midZ);
      wall.castShadow = true;
      wGroup.add(wall);

      // White wall coping
      const wallCap = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.12, wallLen + 0.1), gateWhite);
      wallCap.position.set(xPos, 2.26, midZ);
      wGroup.add(wallCap);

      // Angled Y-brackets & 3 security barbed wire strands
      const numPosts = Math.max(2, Math.floor(wallLen / 3.0));
      for (let p = 0; p <= numPosts; p++) {
        const pz = startZ + (p / numPosts) * (endZ - startZ);

        const post = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.7, 0.04), steelMat);
        post.position.set(xPos, 2.65, pz);
        post.rotation.z = 0.25; // Angled outward toward NH-12
        wGroup.add(post);
      }

      // 3 Continuous horizontal barbed wire strands
      [2.45, 2.65, 2.85].forEach(wy => {
        const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, wallLen, 4), galvSteelMat);
        wire.rotation.x = Math.PI / 2;
        wire.position.set(xPos + 0.08, wy, midZ);
        wGroup.add(wire);
      });

      return wGroup;
    };

    // Right boundary wall extending towards north
    gateGroup.add(createSecurityWallWithBarbedWire(-8.8, -16.0, 0));
    // Left boundary wall extending towards south
    gateGroup.add(createSecurityWallWithBarbedWire(12.2, 18.0, 0));

    // =========================================================================
    // 8. CEREMONIAL INAUGURAL BANNER & ADMISSIONS BILLBOARD (Photo 2 & 3)
    // Mounted along the right perimeter fence facing NH-12
    // =========================================================================
    const bannerCanvas = document.createElement('canvas');
    bannerCanvas.width = 1024;
    bannerCanvas.height = 512;
    const bCtx = bannerCanvas.getContext('2d')!;

    bCtx.fillStyle = '#eff6ff'; // Light sky-blue white
    bCtx.fillRect(0, 0, 1024, 512);

    bCtx.fillStyle = '#1d4ed8'; // Royal blue header
    bCtx.font = 'bold 34px "Arial Black", sans-serif';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.fillText('MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY', 512, 55);

    bCtx.font = 'bold 26px "Arial", sans-serif';
    bCtx.fillText('Main Campus, Haringhata, Nadia, West Bengal', 512, 105);

    // Decorative blue divider line
    bCtx.fillStyle = '#2563eb';
    bCtx.fillRect(96, 135, 832, 6);

    bCtx.fillStyle = '#0f172a';
    bCtx.font = 'bold 38px "Arial Black", sans-serif';
    bCtx.fillText('INAUGURATED BY', 512, 190);

    bCtx.fillStyle = '#be185d'; // Magenta prominent title
    bCtx.font = 'bold 54px "Arial Black", sans-serif';
    bCtx.fillText('MAMATA BANERJEE', 512, 260);

    bCtx.font = 'bold 28px "Arial", sans-serif';
    bCtx.fillStyle = '#334155';
    bCtx.fillText("Hon'ble Chief Minister, West Bengal", 512, 320);

    bCtx.fillStyle = '#1e3a8a';
    bCtx.font = 'bold 24px "Arial", sans-serif';
    bCtx.fillText('In the August Presence of Eminent Dignitaries & Academic Council', 512, 385);

    // Border
    bCtx.lineWidth = 14;
    bCtx.strokeStyle = '#1d4ed8';
    bCtx.strokeRect(0, 0, 1024, 512);

    const bannerTexture = new THREE.CanvasTexture(bannerCanvas);
    const bannerMat = new THREE.MeshStandardMaterial({ map: bannerTexture, roughness: 0.4 });

    const bannerMesh = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 3.2), bannerMat);
    bannerMesh.position.set(0.35, 2.3, -12.4);
    bannerMesh.rotation.y = Math.PI / 2;
    bannerMesh.castShadow = true;
    gateGroup.add(bannerMesh);

    // Steel support frame behind banner
    [-15.4, -9.4].forEach(bz => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.0, 8), steelMat);
      post.position.set(0.1, 2.0, bz);
      post.castShadow = true;
      gateGroup.add(post);
    });

    // Potted plants and flowerbeds along the guard cabin base (Photo 2 & 3)
    const potMat = new THREE.MeshStandardMaterial({ color: '#c2410c', roughness: 0.7 });
    const flowerMat = new THREE.MeshStandardMaterial({ color: '#ea580c', roughness: 0.6 });
    const plantMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.8 });

    [-1.2, -0.4, 0.4, 1.2].forEach(px => {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 0.35, 10), potMat);
      pot.position.set(px, 0.18, 3.5);
      gateGroup.add(pot);

      const plant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 1), plantMat);
      plant.position.set(px, 0.45, 3.5);
      gateGroup.add(plant);

      const flower = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), flowerMat);
      flower.position.set(px, 0.62, 3.5);
      gateGroup.add(flower);
    });

    // Entrance approach concrete roadway with central lane stripe
    const roadApron = new THREE.Mesh(
      new THREE.PlaneGeometry(16.0, 10.0),
      new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.85 })
    );
    roadApron.rotation.x = -Math.PI / 2;
    roadApron.position.set(0, 0.02, -2.5);
    roadApron.receiveShadow = true;
    gateGroup.add(roadApron);

    // White center road divider lines
    [-5, -1, 3].forEach(rx => {
      const stripe = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 0.22),
        new THREE.MeshBasicMaterial({ color: '#f8fafc', side: THREE.DoubleSide })
      );
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(rx, 0.03, -2.5);
      gateGroup.add(stripe);
    });

    gateGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-gate', isBuilding: true };
    });

    ctx.scene.add(gateGroup);
    ctx.buildingMeshes.set('bldg-gate', gateGroup);
    ctx.createBuildingLabel('bldg-gate', 'MAKAUT MAIN GATE (WBUT)', [156, 14.5, 41]);
  }

  private static setupTwinCrescentComplex(ctx: BuilderContext): THREE.PointLight {
    // =========================================================================
    // Authentic MAKAUT Signature Color Palette (From Real Ground Photos)
    // =========================================================================
    const skyBlueMat = new THREE.MeshStandardMaterial({ color: '#6ba3d6', roughness: 0.65 });
    const royalBlueMat = new THREE.MeshStandardMaterial({ color: '#1d4ed8', roughness: 0.45, metalness: 0.2 });
    const navyTrimMat = new THREE.MeshStandardMaterial({ color: '#1e40af', roughness: 0.5 });
    const crispWhiteMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.85 });
    const floorSlabMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.8 });
    const darkParapetMat = new THREE.MeshStandardMaterial({ color: '#1e3a8a', roughness: 0.7 });
    const darkGlassMat = new THREE.MeshStandardMaterial({
      color: '#0a192f',
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.94
    });
    const atriumGlassMat = new THREE.MeshStandardMaterial({
      color: '#0284c7',
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.88
    });
    const goldLedMat = new THREE.MeshBasicMaterial({ color: '#f59e0b' });
    const mechMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.6, metalness: 0.5 });
    const fanMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.3, metalness: 0.8 });
    const tankMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.6 });
    const plazaMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.9 });
    const yellowPaverMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.9 });

    // =========================================================================
    // 0. Interconnecting Paved Promenade & Central Plaza
    // =========================================================================
    const plaza = new THREE.Mesh(new THREE.PlaneGeometry(90, 100), plazaMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(-18, 0.04, 12);
    plaza.receiveShadow = true;
    ctx.scene.add(plaza);

    // Diagonal paver walkway leading east toward the Fountain Plaza loop road
    const eastWalkway = new THREE.Mesh(new THREE.PlaneGeometry(44, 7), yellowPaverMat);
    eastWalkway.rotation.x = -Math.PI / 2;
    eastWalkway.rotation.z = -0.15;
    eastWalkway.position.set(30, 0.05, 20);
    eastWalkway.receiveShadow = true;
    ctx.scene.add(eastWalkway);

    // =========================================================================
    // 1. North Crescent: MAKAUT Administrative Building (Centroid [-6, 0, -32])
    // Authentic Photo: Signature Sky Blue (#6ba3d6), 4-story glass atrium, white core
    // =========================================================================
    const adminGroup = new THREE.Group();
    adminGroup.position.set(-6, 0, -32);
    adminGroup.name = 'bldg-admin-north';

    const adminRadius = 42;
    const adminSegments = 12;
    const adminStartAngle = -0.78;
    const adminEndAngle = 0.22;

    for (let i = 0; i < adminSegments; i++) {
      const t = i / (adminSegments - 1);
      const angle = adminStartAngle + t * (adminEndAngle - adminStartAngle);
      const x = Math.sin(angle) * adminRadius;
      const z = -Math.cos(angle) * (adminRadius * 0.46) + 12;

      const segH = 16.0;
      // Main 4-story body slice in authentic Sky Blue
      const seg = new THREE.Mesh(new THREE.BoxGeometry(5.2, segH, 13.5), skyBlueMat);
      seg.position.set(x, segH / 2 + 0.1, z);
      seg.rotation.y = -angle;
      seg.castShadow = true;
      seg.receiveShadow = true;
      adminGroup.add(seg);

      // Royal Blue cornice band along roofline
      const band = new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.0, 13.7), royalBlueMat);
      band.position.set(x, segH + 0.5, z);
      band.rotation.y = -angle;
      band.castShadow = true;
      adminGroup.add(band);

      // Parapet
      const parapet = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.5, 13.8), darkParapetMat);
      parapet.position.set(x, segH + 1.25, z);
      parapet.rotation.y = -angle;
      adminGroup.add(parapet);

      // --- MASSIVE 4-STORY RECESSED GLASS CURTAIN WALL ATRIUM (Center slices 3-7) ---
      // (Prominently visible in ground photo media_1788908753011.png!)
      if (i >= 3 && i <= 7) {
        const curtainGlass = new THREE.Mesh(new THREE.BoxGeometry(4.8, 14.0, 0.4), darkGlassMat);
        curtainGlass.position.set(x, 8.5, z - 6.2);
        curtainGlass.rotation.y = -angle;
        adminGroup.add(curtainGlass);

        // Vertical Royal Blue atrium mullions
        [-1.8, 0, 1.8].forEach(mx => {
          const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.25, 14.2, 0.6), royalBlueMat);
          mullion.position.set(x + mx * Math.cos(-angle), 8.5, z - 6.2 + mx * Math.sin(-angle));
          mullion.rotation.y = -angle;
          adminGroup.add(mullion);
        });
      } else {
        // Individual punched windows with Navy trim frames
        for (let f = 1; f <= 4; f++) {
          const winFrame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.8, 13.8), navyTrimMat);
          winFrame.position.set(x, f * 3.4 - 0.2, z);
          winFrame.rotation.y = -angle;
          adminGroup.add(winFrame);

          const win = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 13.9), darkGlassMat);
          win.position.set(x, f * 3.4 - 0.2, z);
          win.rotation.y = -angle;
          adminGroup.add(win);
        }
      }
    }

    // White End Elevator/Stair Tower Core (West end, visible in photo 1 & 2)
    const adminWhiteTower = new THREE.Mesh(new THREE.BoxGeometry(9.0, 20.0, 8.0), crispWhiteMat);
    adminWhiteTower.position.set(-28, 10.0, -18);
    adminWhiteTower.castShadow = true;
    adminGroup.add(adminWhiteTower);

    // Rooftop Cylindrical Water Tanks on Admin Building
    [-10, 8].forEach(tx => {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.2, 16), tankMat);
      tank.position.set(tx, 19.5, -6);
      tank.castShadow = true;
      adminGroup.add(tank);
    });

    // South-East Facing Main Entrance Portico with Yellow LED Display Sign
    const adminPortico = new THREE.Mesh(new THREE.BoxGeometry(11, 4.8, 5.0), crispWhiteMat);
    adminPortico.position.set(4, 2.4, 4);
    adminPortico.castShadow = true;
    adminGroup.add(adminPortico);

    const adminCanopy = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.6, 6.5), royalBlueMat);
    adminCanopy.position.set(4, 5.0, 4.8);
    adminCanopy.castShadow = true;
    adminGroup.add(adminCanopy);

    // Glowing Yellow LED Electronic Sign above entrance (seen in photo 3!)
    const adminLed = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.7, 0.2), goldLedMat);
    adminLed.position.set(4, 4.2, 7.35);
    adminGroup.add(adminLed);

    adminGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-admin-north', isBuilding: true };
    });
    ctx.scene.add(adminGroup);
    ctx.buildingMeshes.set('bldg-admin-north', adminGroup);
    ctx.createBuildingLabel('bldg-admin-north', 'MAKAUT ADMINISTRATIVE BUILDING', [-6, 24, -32]);

    // =========================================================================
    // 2. Central Core: MAKAUT Central Library & 90.0 MHz FM Radio Station (Centroid [-12, 0, 8])
    // Authentic Photos (1, 2, 3): 5-STORY INVERTED-TAPER JEWEL, V-SHAPED FACETED GLASS PROW,
    // OUTWARD-ANGLED ROYAL BLUE EXOSKELETON PIERS, CILL & SPANDREL BANDS, RIBBON WINDOWS,
    // CRENELLATED SLOTTED PARAPET, OPEN STEEL TRUSS, 8-FAN HVAC CHILLERS & 22m FM MAST
    // =========================================================================
    const libraryGroup = new THREE.Group();
    libraryGroup.position.set(-12, 0, 8);
    libraryGroup.rotation.y = -0.46; // Angled -26 degrees matching satellite
    libraryGroup.name = 'bldg-library';

    // Dedicated Central Library Materials
    const libRoyalBlueMat = royalBlueMat; // #1d4ed8
    const libWhiteMat = crispWhiteMat; // #f8fafc
    const libDarkGlassMat = darkGlassMat; // #0a192f
    const libAtriumGlassMat = atriumGlassMat; // #0284c7
    const libSlabMat = floorSlabMat; // #e2e8f0
    const libMullionMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4, metalness: 0.6 });
    const libInteriorGlowMat = new THREE.MeshBasicMaterial({ color: '#fef08a', transparent: true, opacity: 0.22 });
    const libSteelTrussMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.35, metalness: 0.8 });
    const libPaverRed = new THREE.MeshStandardMaterial({ color: '#991b1b', roughness: 0.85 });
    const libPaverYellow = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.85 });
    const libLawnMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.9 });
    const libCurbWhite = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.6 });
    const libCurbBlack = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.6 });
    const libGraniteMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.25, metalness: 0.3 });
    const libNoticeBoardMat = new THREE.MeshStandardMaterial({ color: '#1d4ed8', roughness: 0.5 });
    const libBannerMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8 });
    const libPalmTrunkMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9 });
    const libPalmFrondMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.75 });

    // 5 Tiered Inverted Taper Floors (Each floor expands wider as it rises!)
    const libFloorHeights = [4.0, 3.4, 3.4, 3.4, 3.6];
    let libCurY = 0;

    for (let f = 0; f < 5; f++) {
      const h = libFloorHeights[f];
      const floorY = libCurY;
      const s = f * 1.15; // Outward flare expansion factor

      // Key vertices at floor f (Inverted taper crystal geometry)
      const apexX = 13.5 + s * 1.25;
      const apexZ = 0;
      const nwX = 2.0 + s * 0.6;
      const nwZ = -11.0 - s * 1.1;
      const swX = 2.0 + s * 0.6;
      const swZ = 11.0 + s * 1.1;
      const nrX = -13.0 - s * 1.1;
      const nrZ = -9.0 - s * 0.7;
      const srX = -13.0 - s * 1.1;
      const srZ = 9.0 + s * 0.7;
      const wrX = -14.5 - s * 1.2;
      const wrZ = 0;

      // 1. Floor Slab Band (White/light grey horizontal concrete shelf)
      const slabShape = new THREE.Shape();
      slabShape.moveTo(apexX + 0.4, apexZ);
      slabShape.lineTo(nwX + 0.3, nwZ - 0.4);
      slabShape.lineTo(nrX - 0.3, nrZ - 0.4);
      slabShape.lineTo(wrX - 0.4, wrZ);
      slabShape.lineTo(srX - 0.3, srZ + 0.4);
      slabShape.lineTo(swX + 0.3, swZ + 0.4);
      slabShape.closePath();

      const slabGeo = new THREE.ExtrudeGeometry(slabShape, { depth: 0.4, bevelEnabled: false });
      const slabMesh = new THREE.Mesh(slabGeo, libSlabMat);
      slabMesh.rotation.x = Math.PI / 2;
      slabMesh.position.y = floorY + 0.4;
      slabMesh.castShadow = true;
      slabMesh.receiveShadow = true;
      libraryGroup.add(slabMesh);

      // 2. Interior Core Reading Hall Volume
      const coreShape = new THREE.Shape();
      coreShape.moveTo(apexX, apexZ);
      coreShape.lineTo(nwX, nwZ);
      coreShape.lineTo(nrX, nrZ);
      coreShape.lineTo(wrX, wrZ);
      coreShape.lineTo(srX, srZ);
      coreShape.lineTo(swX, swZ);
      coreShape.closePath();

      const coreGeo = new THREE.ExtrudeGeometry(coreShape, { depth: h - 0.4, bevelEnabled: false });
      const coreMesh = new THREE.Mesh(coreGeo, libDarkGlassMat);
      coreMesh.rotation.x = Math.PI / 2;
      coreMesh.position.y = floorY + h;
      coreMesh.castShadow = true;
      libraryGroup.add(coreMesh);

      // 3. Central Faceted Dark Cyan Glass Prow Atrium
      const prowGlass = new THREE.Mesh(new THREE.BoxGeometry(1.6, h - 0.4, 2.8), libAtriumGlassMat);
      prowGlass.position.set(apexX - 0.5, floorY + h / 2 + 0.2, 0);
      libraryGroup.add(prowGlass);

      // Slanted Royal Blue prow apex column
      const prowCol = new THREE.Mesh(new THREE.BoxGeometry(0.8, h, 0.8), libRoyalBlueMat);
      prowCol.position.set(apexX + 0.1, floorY + h / 2 + 0.2, 0);
      prowCol.rotation.y = Math.PI / 4;
      prowCol.castShadow = true;
      libraryGroup.add(prowCol);

      // Horizontal prow mullion bars
      for (let m = 1; m <= 3; m++) {
        const mul = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.15, 2.9), libMullionMat);
        mul.position.set(apexX - 0.5, floorY + (m / 4) * h, 0);
        libraryGroup.add(mul);
      }

      // Interior warm reading hall luminescence behind the glass prow
      const prowGlow = new THREE.Mesh(new THREE.BoxGeometry(1.2, h - 0.6, 2.4), libInteriorGlowMat);
      prowGlow.position.set(apexX - 0.7, floorY + h / 2 + 0.2, 0);
      libraryGroup.add(prowGlow);

      // Helper to build a facade wing with outward-angled piers, spandrels & ribbon windows
      const buildWing = (startX: number, startZ: number, endX: number, endZ: number, numBays: number) => {
        const dx = endX - startX;
        const dz = endZ - startZ;
        const wingLen = Math.sqrt(dx * dx + dz * dz);
        const bayLen = wingLen / numBays;

        for (let b = 0; b <= numBays; b++) {
          const t = b / numBays;
          const px = startX + dx * t;
          const pz = startZ + dz * t;

          // Outward-slanted Royal Blue structural exoskeleton pier
          const pierGroup = new THREE.Group();
          pierGroup.position.set(px, floorY + h / 2 + 0.2, pz);
          pierGroup.lookAt(endX, floorY + h / 2 + 0.2, endZ);

          const pier = new THREE.Mesh(new THREE.BoxGeometry(0.85, h, 0.68), libRoyalBlueMat);
          pier.castShadow = true;
          pierGroup.add(pier);
          libraryGroup.add(pierGroup);

          if (b < numBays) {
            const tMid = (b + 0.5) / numBays;
            const mx = startX + dx * tMid;
            const mz = startZ + dz * tMid;

            const bayGroup = new THREE.Group();
            bayGroup.position.set(mx, floorY + 0.4, mz);
            bayGroup.lookAt(endX, floorY + 0.4, endZ);

            // Royal Blue lower spandrel beam
            const spandrelH = 0.85;
            const spandrel = new THREE.Mesh(new THREE.BoxGeometry(0.4, spandrelH, bayLen - 0.35), libRoyalBlueMat);
            spandrel.position.set(0, spandrelH / 2, 0);
            bayGroup.add(spandrel);

            // Crisp White accent band
            const whiteBandH = 0.35;
            const whiteBand = new THREE.Mesh(new THREE.BoxGeometry(0.45, whiteBandH, bayLen - 0.35), libWhiteMat);
            whiteBand.position.set(0, spandrelH + whiteBandH / 2, 0);
            bayGroup.add(whiteBand);

            // Continuous ribbon window
            const winH = h - spandrelH - whiteBandH - 0.6;
            const win = new THREE.Mesh(new THREE.BoxGeometry(0.3, winH, bayLen - 0.45), libDarkGlassMat);
            win.position.set(0, spandrelH + whiteBandH + winH / 2, 0);
            bayGroup.add(win);

            // 3 Vertical Aluminum window mullions per bay
            for (let m = 1; m <= 3; m++) {
              const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.36, winH, 0.08), libMullionMat);
              mullion.position.set(0, spandrelH + whiteBandH + winH / 2, (m / 4 - 0.5) * (bayLen - 0.5));
              bayGroup.add(mullion);
            }

            // Warm interior reading hall illumination panel
            const glow = new THREE.Mesh(new THREE.BoxGeometry(0.1, winH - 0.2, bayLen - 0.6), libInteriorGlowMat);
            glow.position.set(-0.25, spandrelH + whiteBandH + winH / 2, 0);
            bayGroup.add(glow);

            libraryGroup.add(bayGroup);
          }
        }
      };

      // 4. North-East Facade Wing (5 bays, from apex to NW tip)
      buildWing(apexX, apexZ, nwX, nwZ, 5);

      // 5. South-East Facade Wing (5 bays, from apex to SW tip)
      buildWing(apexX, apexZ, swX, swZ, 5);

      // 6. North Flank Facade (4 bays, from NW tip to North Rear)
      buildWing(nwX, nwZ, nrX, nrZ, 4);

      // 7. South Flank Facade (4 bays, from SW tip to South Rear)
      buildWing(swX, swZ, srX, srZ, 4);

      // 8. Rear West Facades
      buildWing(nrX, nrZ, wrX, wrZ, 3);
      buildWing(wrX, wrZ, srX, srZ, 3);

      libCurY += h;
    }

    const totalLibH = libCurY; // ~17.8m

    // --- ROOFTOP SLOTTED CROWNING PARAPET (Clearly visible in photos 1, 2, 3!) ---
    const parapetH = 2.0;
    const topS = 4 * 1.15;
    const topApexX = 13.5 + topS * 1.25;
    const topNwX = 2.0 + topS * 0.6;
    const topNwZ = -11.0 - topS * 1.1;
    const topSwX = 2.0 + topS * 0.6;
    const topSwZ = 11.0 + topS * 1.1;
    const topNrX = -13.0 - topS * 1.1;
    const topNrZ = -9.0 - topS * 0.7;
    const topSrX = -13.0 - topS * 1.1;
    const topSrZ = 9.0 + topS * 0.7;
    const topWrX = -14.5 - topS * 1.2;

    const buildCrenellatedParapet = (startX: number, startZ: number, endX: number, endZ: number, numSlots: number) => {
      const dx = endX - startX;
      const dz = endZ - startZ;
      const wingLen = Math.sqrt(dx * dx + dz * dz);
      const pierWidth = (wingLen / numSlots) * 0.58;

      for (let s = 0; s < numSlots; s++) {
        const t = (s + 0.5) / numSlots;
        const parapetBay = new THREE.Group();
        parapetBay.position.set(startX + dx * t, totalLibH + parapetH / 2, startZ + dz * t);
        parapetBay.lookAt(endX, totalLibH + parapetH / 2, endZ);

        const parapetPier = new THREE.Mesh(new THREE.BoxGeometry(0.5, parapetH, pierWidth), libRoyalBlueMat);
        parapetPier.castShadow = true;
        parapetBay.add(parapetPier);
        libraryGroup.add(parapetBay);
      }

      // Continuous Royal Blue capping rail on top
      const railGroup = new THREE.Group();
      railGroup.position.set(startX + dx * 0.5, totalLibH + parapetH + 0.15, startZ + dz * 0.5);
      railGroup.lookAt(endX, totalLibH + parapetH + 0.15, endZ);

      const capRail = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.35, wingLen + 0.3), libRoyalBlueMat);
      capRail.castShadow = true;
      railGroup.add(capRail);
      libraryGroup.add(railGroup);
    };

    buildCrenellatedParapet(topApexX, 0, topNwX, topNwZ, 10);
    buildCrenellatedParapet(topApexX, 0, topSwX, topSwZ, 10);
    buildCrenellatedParapet(topNwX, topNwZ, topNrX, topNrZ, 7);
    buildCrenellatedParapet(topSwX, topSwZ, topSrX, topSrZ, 7);
    buildCrenellatedParapet(topNrX, topNrZ, topWrX, 0, 6);
    buildCrenellatedParapet(topWrX, 0, topSrX, topSrZ, 6);

    // --- ROOFTOP OPEN STEEL LATTICE SIGNAGE TRUSS (Visible above prow in photos 1, 2, 3!) ---
    const trussGroup = new THREE.Group();
    trussGroup.position.set(topApexX - 3.5, totalLibH, 0);

    const trussLegGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.4, 8);
    [-4.0, 4.0].forEach(tx => {
      [-0.8, 0.8].forEach(tz => {
        const leg = new THREE.Mesh(trussLegGeo, libSteelTrussMat);
        leg.position.set(tx, 1.7, tz);
        trussGroup.add(leg);
      });
    });

    [0.6, 3.3].forEach(ty => {
      [-0.8, 0.8].forEach(tz => {
        const chord = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 8.4, 8), libSteelTrussMat);
        chord.rotation.z = Math.PI / 2;
        chord.position.set(0, ty, tz);
        trussGroup.add(chord);
      });
    });

    for (let bay = -3; bay <= 3; bay += 2) {
      const diag1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.4, 6), libSteelTrussMat);
      diag1.rotation.z = Math.PI / 4;
      diag1.position.set(bay, 1.95, 0.8);
      trussGroup.add(diag1);

      const diag2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.4, 6), libSteelTrussMat);
      diag2.rotation.z = -Math.PI / 4;
      diag2.position.set(bay, 1.95, 0.8);
      trussGroup.add(diag2);
    }
    libraryGroup.add(trussGroup);

    // --- FRONT PROW ILLUMINATED AMBER LED SIGN (At Prow Apex, as seen in Photo 3) ---
    const groundApexX = 13.5;
    const frontSignHousing = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.75, 5.4), libMullionMat);
    frontSignHousing.position.set(groundApexX + 0.1, 4.2, 0);
    libraryGroup.add(frontSignHousing);

    const frontSignFace = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.65, 5.2), goldLedMat);
    frontSignFace.position.set(groundApexX + 0.2, 4.2, 0);
    libraryGroup.add(frontSignFace);

    const frontSignGlow = new THREE.PointLight('#f59e0b', 1.2, 12);
    frontSignGlow.position.set(groundApexX + 0.8, 3.8, 0);
    libraryGroup.add(frontSignGlow);

    // =========================================================================
    // AUTHENTIC LIBRARY ENTRANCE GATES ON THIS FACE (North Flank Facade)
    // Directly on the face shown in user screenshots media_1788910332860.png
    // "in the fold's rightmost starting is 1st door for normal entry
    //  and after 1.5 meters of that gate left side is the fire exit door"
    // =========================================================================
    // North flank runs from [nwX=2.0, nwZ=-11.0] (left/front) to [nrX=-13.0, nrZ=-9.0] (right/rear)
    // Outward normal unit vector pointing into north plaza: nx = -0.132, nz = -0.991
    const flankNormX = -0.132;
    const flankNormZ = -0.991;

    // 1. Normal Entry Gate (On the right of this face, near rear / behind tree)
    const northEntryX = -10.5;
    const northEntryZ = -9.33;
    const northEntryGroup = new THREE.Group();
    northEntryGroup.position.set(northEntryX, 0, northEntryZ);
    northEntryGroup.lookAt(northEntryX + flankNormX, 0, northEntryZ + flankNormZ);

    // Royal Blue & Dark Slate Architectural Portal Frame
    const nEntryPortal = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.9, 0.42), libRoyalBlueMat);
    nEntryPortal.position.set(0, 1.45, 0);
    nEntryPortal.castShadow = true;
    northEntryGroup.add(nEntryPortal);

    // Double glass automatic entrance doors
    const nEntryGlass = new THREE.Mesh(new THREE.BoxGeometry(1.85, 2.45, 0.14), libAtriumGlassMat);
    nEntryGlass.position.set(0, 1.35, 0.15);
    northEntryGroup.add(nEntryGlass);

    // Stainless steel vertical pull handles
    const handleMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.8, roughness: 0.2 });
    [-0.14, 0.14].forEach(hx => {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), handleMat);
      handle.position.set(hx, 1.25, 0.26);
      northEntryGroup.add(handle);
    });

    // Illuminated "LIBRARY ENTRANCE / প্রবেশ" Signboard above door
    const nEntrySignBox = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.42, 0.12), libMullionMat);
    nEntrySignBox.position.set(0, 2.85, 0.25);
    northEntryGroup.add(nEntrySignBox);

    const nEntrySignFace = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 0.06), new THREE.MeshBasicMaterial({ color: '#38bdf8' }));
    nEntrySignFace.position.set(0, 2.85, 0.32);
    northEntryGroup.add(nEntrySignFace);

    // Weather protection canopy over entrance
    const nEntryCanopy = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.15, 1.3), libRoyalBlueMat);
    nEntryCanopy.position.set(0, 3.1, 0.65);
    nEntryCanopy.castShadow = true;
    northEntryGroup.add(nEntryCanopy);

    // Warm welcoming lobby spotlight
    const nEntrySpot = new THREE.PointLight('#fef08a', 1.5, 12);
    nEntrySpot.position.set(0, 2.7, 0.6);
    northEntryGroup.add(nEntrySpot);

    // Low entrance threshold / landing pad
    const nEntryLanding = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.15, 1.8), libSlabMat);
    nEntryLanding.position.set(0, 0.075, 0.9);
    nEntryLanding.receiveShadow = true;
    northEntryGroup.add(nEntryLanding);

    libraryGroup.add(northEntryGroup);

    // 2. Fire Exit Door (Exactly 1.5 meters to the left along the same wall)
    const northFireX = -9.01;
    const northFireZ = -9.53;
    const northFireGroup = new THREE.Group();
    northFireGroup.position.set(northFireX, 0, northFireZ);
    northFireGroup.lookAt(northFireX + flankNormX, 0, northFireZ + flankNormZ);

    // Industrial Fire Door Frame
    const nFireFrame = new THREE.Mesh(new THREE.BoxGeometry(1.35, 2.55, 0.32), libMullionMat);
    nFireFrame.position.set(0, 1.28, 0);
    northFireGroup.add(nFireFrame);

    // Safety Red Industrial Door Leaf
    const nFireDoorLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.3, 0.12), new THREE.MeshStandardMaterial({ color: '#b91c1c', roughness: 0.5 }));
    nFireDoorLeaf.position.set(0, 1.22, 0.12);
    northFireGroup.add(nFireDoorLeaf);

    // Horizontal Stainless Steel Panic Push Bar
    const nPanicBar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), handleMat);
    nPanicBar.rotation.z = Math.PI / 2;
    nPanicBar.position.set(0, 1.05, 0.22);
    northFireGroup.add(nPanicBar);

    // Illuminated Green Emergency Fire Exit Sign: "FIRE EXIT / জরুরি নির্গমন"
    const nFireSign = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.32, 0.1), new THREE.MeshBasicMaterial({ color: '#22c55e' }));
    nFireSign.position.set(0, 2.65, 0.22);
    northFireGroup.add(nFireSign);

    const nFireSignLight = new THREE.PointLight('#22c55e', 1.0, 6);
    nFireSignLight.position.set(0, 2.65, 0.35);
    northFireGroup.add(nFireSignLight);

    // Concrete fire exit threshold landing
    const nFireLanding = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, 1.3), libSlabMat);
    nFireLanding.position.set(0, 0.07, 0.65);
    nFireLanding.receiveShadow = true;
    northFireGroup.add(nFireLanding);

    libraryGroup.add(northFireGroup);



    // --- MASSIVE ROOFTOP HVAC CENTRAL CHILLER PLANT ---
    const chillerPlinth = new THREE.Mesh(new THREE.BoxGeometry(15, 1.3, 9.5), mechMat);
    chillerPlinth.position.set(-1.0, totalLibH + 0.65, 0);
    chillerPlinth.castShadow = true;
    libraryGroup.add(chillerPlinth);

    // 8 Circular Cooling Condenser Fans in an authentic 2x4 grid
    for (let fx = -5.2; fx <= 5.2; fx += 3.5) {
      for (let fz = -2.8; fz <= 2.8; fz += 5.6) {
        const fanCasing = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.25, 0.65, 18), fanMat);
        fanCasing.position.set(fx - 1.0, totalLibH + 1.6, fz);
        fanCasing.castShadow = true;
        libraryGroup.add(fanCasing);

        const fanCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.75, 10), mechMat);
        fanCenter.position.set(fx - 1.0, totalLibH + 1.65, fz);
        libraryGroup.add(fanCenter);

        for (let b = 0; b < 4; b++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.2), libSteelTrussMat);
          blade.rotation.y = (b * Math.PI) / 2;
          blade.position.set(fx - 1.0, totalLibH + 1.6, fz);
          libraryGroup.add(blade);
        }

        const guardRing = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.04, 6, 16), libSteelTrussMat);
        guardRing.rotation.x = Math.PI / 2;
        guardRing.position.set(fx - 1.0, totalLibH + 1.95, fz);
        libraryGroup.add(guardRing);
      }
    }

    // Dual silver insulated refrigerant header pipes
    [-0.7, 0.7].forEach(dz => {
      const ductPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 14.5, 12), libSteelTrussMat);
      ductPipe.rotation.z = Math.PI / 2;
      ductPipe.position.set(-1.0, totalLibH + 1.7, dz);
      libraryGroup.add(ductPipe);
    });

    [-4.2, 4.2].forEach(cz => {
      const compCabinet = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.8, 1.2), mechMat);
      compCabinet.position.set(-6.5, totalLibH + 1.5, cz);
      libraryGroup.add(compCabinet);
    });

    // --- MAKAUT 90.0 MHz FM RADIO TRANSMISSION LATTICE MAST ---
    const mastGroup = new THREE.Group();
    mastGroup.position.set(4.0, totalLibH, -7.5);

    const mastPedestal = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 2.4), mechMat);
    mastPedestal.position.y = 0.4;
    mastGroup.add(mastPedestal);

    const mastGeo = new THREE.CylinderGeometry(0.2, 0.55, 22, 4);
    const mastMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.4, metalness: 0.8 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.y = 11.4;
    mastGroup.add(mast);

    [4.5, 9.5, 14.5, 19.5].forEach(wy => {
      const whiteBand = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.35, 1.8, 4), libWhiteMat);
      whiteBand.position.y = wy;
      mastGroup.add(whiteBand);
    });

    const guyGeo = new THREE.CylinderGeometry(0.02, 0.02, 16.5, 4);
    [
      [3.0, 3.0],
      [-3.0, 3.0],
      [3.0, -3.0],
      [-3.0, -3.0]
    ].forEach(([gx, gz]) => {
      const guy = new THREE.Mesh(guyGeo, libSteelTrussMat);
      guy.position.set(gx / 2, 7.5, gz / 2);
      guy.lookAt(gx, 0.4, gz);
      guy.rotation.x += Math.PI / 2;
      mastGroup.add(guy);
    });

    const dish = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: '#f8fafc', metalness: 0.6, roughness: 0.3 })
    );
    dish.rotation.x = Math.PI / 2;
    dish.rotation.y = 0.6;
    dish.position.set(0, 16.5, 0);
    mastGroup.add(dish);

    const beaconSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 8, 8),
      new THREE.MeshBasicMaterial({ color: '#ff0000' })
    );
    beaconSphere.position.set(0, 22.5, 0);
    mastGroup.add(beaconSphere);

    const radioBeaconLight = new THREE.PointLight('#ef4444', 2.2, 40);
    radioBeaconLight.position.set(0, 22.6, 0);
    mastGroup.add(radioBeaconLight);

    libraryGroup.add(mastGroup);

    // --- ROOFTOP ELEVATOR & STAIR PENTHOUSE CORE (West Section) ---
    const penthouse = new THREE.Mesh(new THREE.BoxGeometry(8.5, 3.2, 7.5), libWhiteMat);
    penthouse.position.set(-8.5, totalLibH + 1.6, 0);
    penthouse.castShadow = true;
    libraryGroup.add(penthouse);

    const penthouseCornice = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.4, 7.8), libRoyalBlueMat);
    penthouseCornice.position.set(-8.5, totalLibH + 3.3, 0);
    libraryGroup.add(penthouseCornice);

    [-2.2, 2.2].forEach(tx => {
      [-1.8, 1.8].forEach(tz => {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.8, 12), fanMat);
        tank.position.set(-8.5 + tx, totalLibH + 4.3, tz);
        tank.castShadow = true;
        libraryGroup.add(tank);
      });
    });

    const lightningSpike = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 3.5, 6), new THREE.MeshStandardMaterial({ color: '#b45309', metalness: 0.9 }));
    lightningSpike.position.set(-8.5, totalLibH + 5.2, 0);
    libraryGroup.add(lightningSpike);

    // --- FORECOURT LANDSCAPING, SIGNAGE & MICRO-ARCHITECTURE (Authentic from Photo 3!) ---
    // 1. Two-Tone Paved Walkway Apron (Connecting entrance to road)
    const forecourtApron = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), libPaverYellow);
    forecourtApron.rotation.x = -Math.PI / 2;
    forecourtApron.position.set(groundApexX + 11.0, 0.05, 0);
    forecourtApron.receiveShadow = true;
    libraryGroup.add(forecourtApron);

    const paverBorderN = new THREE.Mesh(new THREE.PlaneGeometry(16.4, 1.2), libPaverRed);
    paverBorderN.rotation.x = -Math.PI / 2;
    paverBorderN.position.set(groundApexX + 11.0, 0.06, -6.0);
    libraryGroup.add(paverBorderN);

    const paverBorderS = new THREE.Mesh(new THREE.PlaneGeometry(16.4, 1.2), libPaverRed);
    paverBorderS.rotation.x = -Math.PI / 2;
    paverBorderS.position.set(groundApexX + 11.0, 0.06, 6.0);
    libraryGroup.add(paverBorderS);

    // 2. Front Lawn Quadrangle between paved apron and road
    const frontLawnN = new THREE.Mesh(new THREE.PlaneGeometry(15, 8.5), libLawnMat);
    frontLawnN.rotation.x = -Math.PI / 2;
    frontLawnN.position.set(groundApexX + 11.0, 0.03, -11.0);
    frontLawnN.receiveShadow = true;
    libraryGroup.add(frontLawnN);

    const frontLawnS = new THREE.Mesh(new THREE.PlaneGeometry(15, 8.5), libLawnMat);
    frontLawnS.rotation.x = -Math.PI / 2;
    frontLawnS.position.set(groundApexX + 11.0, 0.03, 11.0);
    frontLawnS.receiveShadow = true;
    libraryGroup.add(frontLawnS);

    // Black & White striped safety kerbing around lawn
    for (let cb = 0; cb < 12; cb++) {
      const curbMat = cb % 2 === 0 ? libCurbWhite : libCurbBlack;
      const curbSegmentN = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.2, 0.35), curbMat);
      curbSegmentN.position.set(groundApexX + 3.8 + cb * 1.25, 0.1, -6.8);
      libraryGroup.add(curbSegmentN);

      const curbSegmentS = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.2, 0.35), curbMat);
      curbSegmentS.position.set(groundApexX + 3.8 + cb * 1.25, 0.1, 6.8);
      libraryGroup.add(curbSegmentS);
    }

    // 3. Two Signature Palm Trees in Front Lawn (Seen in photos 1 & 3!)
    const buildPalmTree = (x: number, z: number) => {
      const palm = new THREE.Group();
      palm.position.set(x, 0, z);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 7.0, 10), libPalmTrunkMat);
      trunk.position.y = 3.5;
      trunk.castShadow = true;
      palm.add(trunk);

      for (let i = 0; i < 10; i++) {
        const frondAngle = (i / 10) * Math.PI * 2;
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.5, 3.2, 5), libPalmFrondMat);
        frond.position.set(Math.cos(frondAngle) * 1.3, 6.8, Math.sin(frondAngle) * 1.3);
        frond.rotation.x = Math.PI / 3;
        frond.rotation.y = frondAngle;
        palm.add(frond);
      }
      return palm;
    };

    libraryGroup.add(buildPalmTree(groundApexX + 9.0, -10.5));
    libraryGroup.add(buildPalmTree(groundApexX + 9.0, 10.5));

    // 4. Modern Cylindrical Pathway Bollards (White illuminated tops)
    [-5.6, 5.6].forEach(bz => {
      [groundApexX + 4.5, groundApexX + 10.5, groundApexX + 16.5].forEach(bx => {
        const bollardPost = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.85, 12), libMullionMat);
        bollardPost.position.set(bx, 0.42, bz);
        libraryGroup.add(bollardPost);

        const bollardLuminaire = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.15, 12), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
        bollardLuminaire.position.set(bx, 0.88, bz);
        libraryGroup.add(bollardLuminaire);
      });
    });

    // 5. Polished Dark Granite Student Seating Benches (Seen with students in photo 3!)
    [-4.8, 4.8].forEach(bz => {
      const benchBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 2.6), libGraniteMat);
      benchBase.position.set(groundApexX + 12.0, 0.25, bz);
      benchBase.castShadow = true;
      libraryGroup.add(benchBase);

      const benchBack = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 2.6), libGraniteMat);
      benchBack.position.set(groundApexX + 12.0 - (bz > 0 ? -0.5 : 0.5), 0.7, bz);
      libraryGroup.add(benchBack);
    });

    // 6. Blue University Notice Board ("CAMPUS DIRECTORY")
    const noticeBoardGroup = new THREE.Group();
    noticeBoardGroup.position.set(groundApexX + 6.0, 0, -8.5);

    [-0.8, 0.8].forEach(px => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8), libSteelTrussMat);
      post.position.set(px, 1.1, 0);
      noticeBoardGroup.add(post);
    });

    const blueBoard = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.3, 0.08), libNoticeBoardMat);
    blueBoard.position.set(0, 1.6, 0);
    noticeBoardGroup.add(blueBoard);

    const whiteNotice = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 0.09), libBannerMat);
    whiteNotice.position.set(0, 1.6, 0);
    noticeBoardGroup.add(whiteNotice);

    libraryGroup.add(noticeBoardGroup);

    // 7. Large Anti-Ragging Awareness Metal Banner Truss (Seen in photo 3!)
    const bannerGroup = new THREE.Group();
    bannerGroup.position.set(groundApexX + 16.5, 0, -11.0);

    [-2.2, 2.2].forEach(bx => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8), libSteelTrussMat);
      pole.position.set(bx, 1.6, 0);
      bannerGroup.add(pole);
    });

    const banner = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.6, 0.06), libBannerMat);
    banner.position.set(0, 2.1, 0);
    bannerGroup.add(banner);

    [1.3, 2.9].forEach(cy => {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.8, 8), libSteelTrussMat);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(0, cy, 0);
      bannerGroup.add(bar);
    });

    libraryGroup.add(bannerGroup);

    libraryGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-library', isBuilding: true };
    });
    ctx.scene.add(libraryGroup);
    ctx.buildingMeshes.set('bldg-library', libraryGroup);
    ctx.createBuildingLabel('bldg-library', 'CENTRAL LIBRARY & FM 90.0', [-12, 25, 8]);

    // =========================================================================
    // 3. South Crescent: Academic Building (Centered at [-14.8, 0, 42])
    // Perfectly aligned with the north-south axis of the BioTech Circular Loop approach road (X = -14.8)!
    // Authentic Google Maps Photo (Tanushree Pan, Mar 2022 - media_1788912277428.png):
    // - 5-Story Sweeping Symmetrical Crescent in authentic MAKAUT Sky Blue (#6ba3d6)
    // - 4 Grand White Classical Cylindrical Colonnade Columns with circular bases & capitals
    // - Continuous Reflective Cyan-Blue Curtain Walls with Dark Bronze Mullions (Not black/boxed!)
    // - Solid Central Pylons with Two Vertically Stacked White Recessed Niches
    // - Sky Blue Parapet with Continuous White Slotted Dentil Balustrade (No heavy navy lid!)
    // - Central Elevated Rooftop Penthouse Core aligned on entrance centerline
    // - Ground Floor Recessed Lab Windows with White Sills
    // - University Entrance: White Mural Backdrop with Terracotta Door Leaf
    // - North Arcade & Sloped Skylight Canopy
    // =========================================================================
    const acadGroup = new THREE.Group();
    acadGroup.position.set(-14.8, 0, 42); // Axial alignment with BioTech Circular Loop approach road (X = -14.78)!
    acadGroup.name = 'bldg-acad-south';

    const halfAngleSpan = 0.52; // Symmetrical crescent sweep from -0.52 to +0.52 rad (~30 degrees each wing)
    const segH = 18.5; // 5 floors
    const numCurveSteps = 48; // Silky smooth unbroken crescent arc
    const rxOut = 55.0;
    const rzOut = 20.5;
    const rxIn = 42.0;
    const rzIn = 7.5;

    // Specialized Authentic Materials from Photo media_1788912277428.png
    const acadSkyBlue = new THREE.MeshStandardMaterial({ color: '#6ba3d6', roughness: 0.65 });
    const acadWhiteCol = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.45 });
    const acadBronzeMullion = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.5, metalness: 0.6 });
    const acadTerracottaDoor = new THREE.MeshStandardMaterial({ color: '#c2410c', roughness: 0.45 });
    // Reflective sky-blue curtain glass with subtle luminescence so it never renders pitch-black!
    const acadCurtainGlass = new THREE.MeshStandardMaterial({
      color: '#1a6b9e',
      emissive: '#0a385c',
      emissiveIntensity: 0.38,
      roughness: 0.16,
      metalness: 0.48
    });

    // 3.1 Smooth Extruded Crescent Body in MAKAUT Sky Blue (Symmetrical & perfectly centered)
    const acadShape = new THREE.Shape();
    // Outer curve (South, convex side facing BioTech loop)
    for (let i = 0; i <= numCurveSteps; i++) {
      const t = i / numCurveSteps;
      const angle = -halfAngleSpan + t * (2 * halfAngleSpan);
      const u = Math.sin(angle) * rxOut;
      const v = Math.cos(angle) * rzOut;
      if (i === 0) acadShape.moveTo(u, v);
      else acadShape.lineTo(u, v);
    }
    // Inner curve (North, concave side facing Library Concourse)
    for (let i = numCurveSteps; i >= 0; i--) {
      const t = i / numCurveSteps;
      const angle = -halfAngleSpan + t * (2 * halfAngleSpan);
      const u = Math.sin(angle) * rxIn;
      const v = Math.cos(angle) * rzIn;
      acadShape.lineTo(u, v);
    }
    acadShape.closePath();

    const acadGeom = new THREE.ExtrudeGeometry(acadShape, { depth: segH, bevelEnabled: false });
    acadGeom.rotateX(Math.PI / 2);
    acadGeom.translate(0, segH, 0);
    acadGeom.computeVertexNormals();

    const acadBody = new THREE.Mesh(acadGeom, acadSkyBlue);
    acadBody.castShadow = true;
    acadBody.receiveShadow = true;
    acadGroup.add(acadBody);

    // 3.2 Authentic Sky Blue Parapet with White Dentil Balustrade (Photo: Matches Sky Blue body!)
    const roofShape = new THREE.Shape();
    for (let i = 0; i <= numCurveSteps; i++) {
      const t = i / numCurveSteps;
      const angle = -halfAngleSpan + t * (2 * halfAngleSpan);
      const u = Math.sin(angle) * (rxOut + 0.25);
      const v = Math.cos(angle) * (rzOut + 0.25);
      if (i === 0) roofShape.moveTo(u, v);
      else roofShape.lineTo(u, v);
    }
    for (let i = numCurveSteps; i >= 0; i--) {
      const t = i / numCurveSteps;
      const angle = -halfAngleSpan + t * (2 * halfAngleSpan);
      const u = Math.sin(angle) * (rxIn - 0.25);
      const v = Math.cos(angle) * (rzIn - 0.25);
      roofShape.lineTo(u, v);
    }
    roofShape.closePath();

    // Sky Blue Parapet Wall
    const parapetGeom = new THREE.ExtrudeGeometry(roofShape, { depth: 1.4, bevelEnabled: false });
    parapetGeom.rotateX(Math.PI / 2);
    parapetGeom.translate(0, segH + 1.4, 0);
    parapetGeom.computeVertexNormals();
    const parapet = new THREE.Mesh(parapetGeom, acadSkyBlue);
    parapet.castShadow = true;
    acadGroup.add(parapet);

    // Continuous White Top Coping Rail
    const railGeom = new THREE.ExtrudeGeometry(roofShape, { depth: 0.22, bevelEnabled: false });
    railGeom.rotateX(Math.PI / 2);
    railGeom.translate(0, segH + 1.62, 0);
    const rail = new THREE.Mesh(railGeom, acadWhiteCol);
    acadGroup.add(rail);

    // Helper: Compute tangent position and outward normal on outer curve
    const getOuterTransform = (angle: number, radialOffset: number = 0) => {
      const rx = rxOut + radialOffset;
      const rz = rzOut + radialOffset;
      const x = Math.sin(angle) * rx;
      const z = Math.cos(angle) * rz;

      const nx = Math.sin(angle) / rx;
      const nz = Math.cos(angle) / rz;
      const rotY = Math.atan2(nx, nz);

      return { x, z, rotY };
    };

    // White Slotted Dentils along the curved roofline (seen in photo media_1788912277428.png)
    const numDentils = 42;
    for (let d = 0; d < numDentils; d++) {
      const dt = (d + 0.5) / numDentils;
      const dAngle = -halfAngleSpan + 0.04 + dt * (2 * halfAngleSpan - 0.08);
      const { x, z, rotY } = getOuterTransform(dAngle, 0.26);

      const dentil = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.2), acadWhiteCol);
      dentil.position.set(x, segH + 1.05, z);
      dentil.rotation.y = rotY;
      acadGroup.add(dentil);
    }

    // Ground Floor Horizontal Cornice / Belt Course (separating Ground from Floor 2)
    const beltCourseShape = new THREE.Shape();
    for (let i = 0; i <= numCurveSteps; i++) {
      const t = i / numCurveSteps;
      const angle = -halfAngleSpan + t * (2 * halfAngleSpan);
      const u = Math.sin(angle) * (rxOut + 0.3);
      const v = Math.cos(angle) * (rzOut + 0.3);
      if (i === 0) beltCourseShape.moveTo(u, v);
      else beltCourseShape.lineTo(u, v);
    }
    for (let i = numCurveSteps; i >= 0; i--) {
      const t = i / numCurveSteps;
      const angle = -halfAngleSpan + t * (2 * halfAngleSpan);
      const u = Math.sin(angle) * (rxOut - 0.1);
      const v = Math.cos(angle) * (rzOut - 0.1);
      beltCourseShape.lineTo(u, v);
    }
    beltCourseShape.closePath();

    const beltGeom = new THREE.ExtrudeGeometry(beltCourseShape, { depth: 0.35, bevelEnabled: false });
    beltGeom.rotateX(Math.PI / 2);
    beltGeom.translate(0, 4.3, 0);
    const beltCourse = new THREE.Mesh(beltGeom, acadWhiteCol);
    acadGroup.add(beltCourse);

    // 3.3 Symmetrical Reflective Curtain Wall Glazing Zones
    const curtainZones = [
      // Left Colonnade Wing: angle -0.42 to -0.14
      { startA: -0.42, endA: -0.14, numBays: 4 },
      // Center Glass Bay: centered at 0 from angle -0.075 to +0.075
      { startA: -0.075, endA: 0.075, numBays: 3 },
      // Right Colonnade Wing: angle +0.14 to +0.42
      { startA: 0.14, endA: 0.42, numBays: 4 }
    ];

    const curtainH = 13.5; // Spans Floors 2 to 5 (Y = 4.4m to 17.9m)
    const curtainY = 11.15;

    curtainZones.forEach(({ startA, endA, numBays }) => {
      const totalSpan = endA - startA;
      for (let b = 0; b < numBays; b++) {
        const midA = startA + ((b + 0.5) / numBays) * totalSpan;
        const spanAngle = totalSpan / numBays;
        const bayW = spanAngle * rxOut * 1.06;

        const { x, z, rotY } = getOuterTransform(midA, 0.08);

        const glassBay = new THREE.Group();
        glassBay.position.set(x, 0, z);
        glassBay.rotation.y = rotY;

        // Reflective Cyan-Blue Curtain Glass
        const glassPane = new THREE.Mesh(new THREE.BoxGeometry(bayW + 0.1, curtainH, 0.2), acadCurtainGlass);
        glassPane.position.set(0, curtainY, 0);
        glassBay.add(glassPane);

        // Dark Bronze Vertical Mullions
        [-bayW / 4, 0, bayW / 4].forEach(mx => {
          const mul = new THREE.Mesh(new THREE.BoxGeometry(0.09, curtainH, 0.25), acadBronzeMullion);
          mul.position.set(mx, curtainY, 0.02);
          glassBay.add(mul);
        });

        // Dark Bronze Horizontal Floor Transoms (Floors 2, 3, 4, 5)
        [curtainY - 3.4, curtainY, curtainY + 3.4].forEach(ty => {
          const transom = new THREE.Mesh(new THREE.BoxGeometry(bayW + 0.1, 0.14, 0.24), acadBronzeMullion);
          transom.position.set(0, ty, 0.02);
          glassBay.add(transom);
        });

        acadGroup.add(glassBay);
      }
    });

    // 3.4 THE 4 GRAND WHITE CLASSICAL COLUMNS (Symmetrically positioned)
    // 2 columns across the Left Wing curtain wall, 2 columns across the Right Wing curtain wall!
    const columnAngles = [
      -0.34, // Column 1: Left Wing Outer
      -0.21, // Column 2: Left Wing Inner
      +0.21, // Column 3: Right Wing Inner
      +0.34  // Column 4: Right Wing Outer
    ];

    const colRadius = 0.44;
    const colBaseRadius = 0.62;
    const colH = 12.8;

    columnAngles.forEach(cAngle => {
      const { x, z, rotY } = getOuterTransform(cAngle, 0.7); // Stands proud in front of glass

      const columnGroup = new THREE.Group();
      columnGroup.position.set(x, 0, z);
      columnGroup.rotation.y = rotY;

      // 1. Circular Molded Classical Base Pedestal
      const baseLower = new THREE.Mesh(new THREE.CylinderGeometry(colBaseRadius, colBaseRadius, 0.25, 24), acadWhiteCol);
      baseLower.position.y = 4.42;
      baseLower.castShadow = true;
      columnGroup.add(baseLower);

      const baseUpper = new THREE.Mesh(new THREE.CylinderGeometry(colBaseRadius * 0.85, colBaseRadius, 0.25, 24), acadWhiteCol);
      baseUpper.position.y = 4.67;
      columnGroup.add(baseUpper);

      // 2. Tall Classical Cylindrical Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(colRadius * 0.92, colRadius, colH, 24), acadWhiteCol);
      shaft.position.y = 4.8 + colH / 2;
      shaft.castShadow = true;
      columnGroup.add(shaft);

      // 3. Flared Classical Capital
      const capitalNeck = new THREE.Mesh(new THREE.CylinderGeometry(colRadius * 1.15, colRadius * 0.92, 0.22, 24), acadWhiteCol);
      capitalNeck.position.y = 4.8 + colH + 0.11;
      columnGroup.add(capitalNeck);

      const capitalAbacus = new THREE.Mesh(new THREE.BoxGeometry(colBaseRadius * 1.6, 0.28, colBaseRadius * 1.6), acadWhiteCol);
      capitalAbacus.position.y = 4.8 + colH + 0.36;
      capitalAbacus.castShadow = true;
      columnGroup.add(capitalAbacus);

      acadGroup.add(columnGroup);
    });

    // 3.5 Central Structural Pylons with Stacked White Recessed Niches (Symmetric at ±0.11 rad)
    const pylonAngles = [-0.11, +0.11];
    pylonAngles.forEach(pAngle => {
      const { x, z, rotY } = getOuterTransform(pAngle, 0.05);

      const pylonGroup = new THREE.Group();
      pylonGroup.position.set(x, 0, z);
      pylonGroup.rotation.y = rotY;

      // TWO STACKED WHITE RECESSED RECTANGULAR NICHES:
      // Lower Niche (Floors 2-3): Y ≈ 7.2m
      const nicheLowerFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 4.4, 0.15), acadWhiteCol);
      nicheLowerFrame.position.set(0, 7.2, 0.05);
      pylonGroup.add(nicheLowerFrame);

      const nicheLowerInner = new THREE.Mesh(new THREE.BoxGeometry(1.4, 4.0, 0.16), acadSkyBlue);
      nicheLowerInner.position.set(0, 7.2, 0.06);
      pylonGroup.add(nicheLowerInner);

      // Upper Niche (Floors 4-5): Y ≈ 14.2m
      const nicheUpperFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 4.4, 0.15), acadWhiteCol);
      nicheUpperFrame.position.set(0, 14.2, 0.05);
      pylonGroup.add(nicheUpperFrame);

      const nicheUpperInner = new THREE.Mesh(new THREE.BoxGeometry(1.4, 4.0, 0.16), acadSkyBlue);
      nicheUpperInner.position.set(0, 14.2, 0.06);
      pylonGroup.add(nicheUpperInner);

      acadGroup.add(pylonGroup);
    });

    // 3.6 Central Elevated Rooftop Penthouse Core (Centered at theta = 0)
    const centerT = getOuterTransform(0, -6.0);
    const pentW = 10.2;
    const pentH = 3.6;
    const pentD = 8.0;

    const acadPenthouse = new THREE.Mesh(new THREE.BoxGeometry(pentW, pentH, pentD), acadSkyBlue);
    acadPenthouse.position.set(centerT.x, segH + pentH / 2 + 0.8, centerT.z);
    acadPenthouse.rotation.y = centerT.rotY;
    acadPenthouse.castShadow = true;
    acadGroup.add(acadPenthouse);

    const pentCap = new THREE.Mesh(new THREE.BoxGeometry(pentW + 0.4, 0.35, pentD + 0.4), acadWhiteCol);
    pentCap.position.set(centerT.x, segH + pentH + 0.95, centerT.z);
    pentCap.rotation.y = centerT.rotY;
    acadGroup.add(pentCap);

    // 3.7 Ground Floor Facade & University Entrance (Centered at theta = 0)
    // Under Left Wing: Recessed horizontal classroom/lab windows with white sill lines
    [-0.34, -0.21].forEach(wAngle => {
      const { x, z, rotY } = getOuterTransform(wAngle, 0.08);
      const winGroup = new THREE.Group();
      winGroup.position.set(x, 0, z);
      winGroup.rotation.y = rotY;

      const sill = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.25, 0.3), acadWhiteCol);
      sill.position.set(0, 1.1, 0.05);
      winGroup.add(sill);

      const winGlass = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.7, 0.2), acadCurtainGlass);
      winGlass.position.set(0, 2.1, 0.02);
      winGroup.add(winGlass);

      [-1.8, 0, 1.8].forEach(wx => {
        const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.7, 0.24), acadBronzeMullion);
        mullion.position.set(wx, 2.1, 0.03);
        winGroup.add(mullion);
      });

      acadGroup.add(winGroup);
    });

    // Under Right Wing: Recessed horizontal classroom/lab windows with white sill lines
    [+0.21, +0.34].forEach(wAngle => {
      const { x, z, rotY } = getOuterTransform(wAngle, 0.08);
      const winGroup = new THREE.Group();
      winGroup.position.set(x, 0, z);
      winGroup.rotation.y = rotY;

      const sill = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.25, 0.3), acadWhiteCol);
      sill.position.set(0, 1.1, 0.05);
      winGroup.add(sill);

      const winGlass = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.7, 0.2), acadCurtainGlass);
      winGlass.position.set(0, 2.1, 0.02);
      winGroup.add(winGlass);

      [-1.8, 0, 1.8].forEach(wx => {
        const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.7, 0.24), acadBronzeMullion);
        mullion.position.set(wx, 2.1, 0.03);
        winGroup.add(mullion);
      });

      acadGroup.add(winGroup);
    });

    // Center Entrance under Center Bay at theta = 0 (Directly on BioTech loop axis!)
    const entranceT = getOuterTransform(0, 0.08);
    const entranceGroup = new THREE.Group();
    entranceGroup.position.set(entranceT.x, 0, entranceT.z);
    entranceGroup.rotation.y = entranceT.rotY;

    // 1. White Mural Wall Backdrop (Seen clearly in media_1788912277428.png)
    const muralWall = new THREE.Mesh(new THREE.BoxGeometry(8.2, 3.6, 0.2), acadWhiteCol);
    muralWall.position.set(0, 1.8, 0.05);
    entranceGroup.add(muralWall);

    // Decorative artistic mural elements on the white wall
    const artColors = ['#0284c7', '#d97706', '#16a34a', '#dc2626', '#475569'];
    [-2.6, -1.8, 1.8, 2.6].forEach((ax, idx) => {
      [1.2, 2.2, 2.8].forEach((ay, idy) => {
        const artDot = new THREE.Mesh(
          new THREE.BoxGeometry(0.35, 0.35, 0.06),
          new THREE.MeshStandardMaterial({ color: artColors[(idx + idy) % artColors.length], roughness: 0.5 })
        );
        artDot.position.set(ax + (idy % 2) * 0.2, ay, 0.16);
        entranceGroup.add(artDot);
      });
    });

    // 2. Terracotta / Orange Center Entrance Door (Photo: media_1788912277428.png)
    const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, 0.12), acadTerracottaDoor);
    doorLeaf.position.set(0, 1.3, 0.14);
    doorLeaf.castShadow = true;
    entranceGroup.add(doorLeaf);

    // Glass vision slit in the door
    const doorVision = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.4, 0.14), acadCurtainGlass);
    doorVision.position.set(0, 1.6, 0.15);
    entranceGroup.add(doorVision);

    // Stainless steel push bar
    const pushBar = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.06, 0.06),
      new THREE.MeshStandardMaterial({ color: '#f1f5f9', metalness: 0.9, roughness: 0.2 })
    );
    pushBar.position.set(0, 1.15, 0.22);
    entranceGroup.add(pushBar);

    // Granite Entrance Steps
    const entranceSteps = new THREE.Mesh(
      new THREE.BoxGeometry(8.8, 0.2, 2.8),
      new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.85 })
    );
    entranceSteps.position.set(0, 0.1, 1.4);
    entranceSteps.receiveShadow = true;
    entranceGroup.add(entranceSteps);

    acadGroup.add(entranceGroup);

    // 3.8 Curved Flanking Outer Wingtips (Narrow punched rectangular windows)
    // West Wingtip punched windows
    [-0.49, -0.46].forEach(wAngle => {
      const { x, z, rotY } = getOuterTransform(wAngle, 0.08);
      const wGroup = new THREE.Group();
      wGroup.position.set(x, 0, z);
      wGroup.rotation.y = rotY;

      for (let f = 1; f <= 5; f++) {
        const wy = (f - 0.5) * 3.4 + 0.5;
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.25), acadWhiteCol);
        frame.position.set(0, wy, 0);
        wGroup.add(frame);

        const win = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 0.3), acadCurtainGlass);
        win.position.set(0, wy, 0);
        wGroup.add(win);
      }
      acadGroup.add(wGroup);
    });

    // East Wingtip punched windows
    [+0.46, +0.49].forEach(wAngle => {
      const { x, z, rotY } = getOuterTransform(wAngle, 0.08);
      const wGroup = new THREE.Group();
      wGroup.position.set(x, 0, z);
      wGroup.rotation.y = rotY;

      for (let f = 1; f <= 5; f++) {
        const wy = (f - 0.5) * 3.4 + 0.5;
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.25), acadWhiteCol);
        frame.position.set(0, wy, 0);
        wGroup.add(frame);

        const win = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 0.3), acadCurtainGlass);
        win.position.set(0, wy, 0);
        wGroup.add(win);
      }
      acadGroup.add(wGroup);
    });

    // East End Elevator / Stair Tower Core (Crisp White, rising to 22.5m)
    const eastTowerT = getOuterTransform(0.51, -6.0);
    const eastTower = new THREE.Mesh(new THREE.BoxGeometry(8.5, 22.5, 7.5), acadWhiteCol);
    eastTower.position.set(eastTowerT.x, 11.25, eastTowerT.z);
    eastTower.rotation.y = eastTowerT.rotY;
    eastTower.castShadow = true;
    acadGroup.add(eastTower);

    const eastTowerParapet = new THREE.Mesh(new THREE.BoxGeometry(8.8, 1.0, 7.8), acadSkyBlue);
    eastTowerParapet.position.set(eastTowerT.x, 23.0, eastTowerT.z);
    eastTowerParapet.rotation.y = eastTowerT.rotY;
    acadGroup.add(eastTowerParapet);

    // Rooftop water storage tanks
    [-1.8, 1.8].forEach(tx => {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.0, 16), tankMat);
      tank.position.set(eastTowerT.x + tx, 24.2, eastTowerT.z);
      tank.castShadow = true;
      acadGroup.add(tank);
    });

    // 3.9 Inner Concave (North / Concourse) Arcade & Sloped Skylight Canopy
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const angle = -halfAngleSpan + 0.05 + t * (2 * halfAngleSpan - 0.1);
      const colX = Math.sin(angle) * (rxIn - 0.4);
      const colZ = Math.cos(angle) * (rzIn - 0.4);

      const col = new THREE.Mesh(new THREE.BoxGeometry(0.55, 4.2, 0.55), acadWhiteCol);
      col.position.set(colX, 2.1, colZ);
      acadGroup.add(col);
    }

    // Sloped glazed skylight canopy over the eastern half
    for (let i = 5; i <= 10; i++) {
      const t = i / 10;
      const angle = -halfAngleSpan + 0.05 + t * (2 * halfAngleSpan - 0.1);
      const cx = Math.sin(angle) * ((rxIn + rxOut) / 2);
      const cz = Math.cos(angle) * ((rzIn + rzOut) / 2);

      const skyFrame = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.35, 9.0), acadSkyBlue);
      skyFrame.position.set(cx, segH + 1.8, cz);
      skyFrame.rotation.y = -angle;
      skyFrame.rotation.x = -0.30;
      acadGroup.add(skyFrame);

      const skyGlass = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.12, 8.6), atriumGlassMat);
      skyGlass.position.set(cx, segH + 1.95, cz);
      skyGlass.rotation.y = -angle;
      skyGlass.rotation.x = -0.30;
      acadGroup.add(skyGlass);
    }

    // 3.10 Forecourt Paved Walkway & Garden Landscaping Connecting Directly to BioTech
    const walkApron = new THREE.Mesh(
      new THREE.PlaneGeometry(8.5, 20),
      new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.9 })
    );
    walkApron.rotation.x = -Math.PI / 2;
    walkApron.position.set(0, 0.03, rzOut + 10.0);
    walkApron.receiveShadow = true;
    acadGroup.add(walkApron);

    // Front garden hedge & shrubs flanking the entrance (matching photo media_1788912277428.png)
    const gardenMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.85 });
    [-5.8, 5.8].forEach(gx => {
      for (let s = 1; s <= 5; s++) {
        const shrub = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 1), gardenMat);
        shrub.position.set(gx, 0.75, rzOut + s * 2.2);
        shrub.castShadow = true;
        acadGroup.add(shrub);
      }
    });

    acadGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-acad-south', isBuilding: true };
    });
    ctx.scene.add(acadGroup);
    ctx.buildingMeshes.set('bldg-acad-south', acadGroup);
    ctx.createBuildingLabel('bldg-acad-south', 'ACADEMIC BUILDING (MAKAUT)', [-14.8, 29, 52]);

    // =========================================================================
    // 4. Foodlicious Eatery (Active Kiosk West of Admin at [-56, 0, -16])
    // =========================================================================
    const foodGroup = new THREE.Group();
    foodGroup.position.set(-56, 0, -16);
    foodGroup.name = 'bldg-foodlicious';

    const foodWallMat = new THREE.MeshStandardMaterial({ color: '#fef3c7', roughness: 0.75 });
    const foodOrangeMat = new THREE.MeshStandardMaterial({ color: '#ea580c', roughness: 0.5 });
    const foodTimberMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.8 });

    // Paved cafe outdoor terrace
    const foodDeck = new THREE.Mesh(new THREE.PlaneGeometry(20, 16), plazaMat);
    foodDeck.rotation.x = -Math.PI / 2;
    foodDeck.position.set(0, 0.06, 0);
    foodDeck.receiveShadow = true;
    foodGroup.add(foodDeck);

    // Kiosk main body
    const foodBody = new THREE.Mesh(new THREE.BoxGeometry(11, 4.5, 8.5), foodWallMat);
    foodBody.position.y = 2.25;
    foodBody.castShadow = true;
    foodGroup.add(foodBody);

    // Orange canopy awning
    const foodAwning = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.5, 5.0), foodOrangeMat);
    foodAwning.position.set(0, 4.2, 4.8);
    foodAwning.rotation.x = 0.2;
    foodAwning.castShadow = true;
    foodGroup.add(foodAwning);

    // "FOODLICIOUS" signboard band
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(9.0, 1.1, 0.3), foodOrangeMat);
    signBoard.position.set(0, 4.4, 4.3);
    foodGroup.add(signBoard);

    // Glazed order window & pickup counter
    const foodWindow = new THREE.Mesh(new THREE.BoxGeometry(8, 2.2, 0.2), darkGlassMat);
    foodWindow.position.set(0, 2.2, 4.3);
    foodGroup.add(foodWindow);

    // Outdoor Garden Umbrella Tables
    const uMat = new THREE.MeshStandardMaterial({ color: '#ea580c' });
    const uPoleMat = new THREE.MeshStandardMaterial({ color: '#71717a' });

    [[-5.0, 5.5], [0, 6.2], [5.0, 5.5]].forEach(([ux, uz]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8), uPoleMat);
      pole.position.set(ux, 1.4, uz);
      foodGroup.add(pole);

      const umbrella = new THREE.Mesh(new THREE.ConeGeometry(2.0, 0.9, 16), uMat);
      umbrella.position.set(ux, 2.6, uz);
      foodGroup.add(umbrella);

      const table = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.08, 16), foodTimberMat);
      table.position.set(ux, 0.9, uz);
      table.castShadow = true;
      foodGroup.add(table);
    });

    foodGroup.traverse(child => {
      child.userData = { buildingId: 'bldg-foodlicious', isBuilding: true };
    });
    ctx.scene.add(foodGroup);
    ctx.buildingMeshes.set('bldg-foodlicious', foodGroup);
    ctx.createBuildingLabel('bldg-foodlicious', 'FOODLICIOUS (OPEN)', [-56, 8.5, -16]);

    // =========================================================================
    // 5. Southwest Workshop Shed (Blue Corrugated Roof at [-54, 0, 46])
    // =========================================================================
    const shedGroup = new THREE.Group();
    shedGroup.position.set(-54, 0, 46);

    const shedBlueMat = new THREE.MeshStandardMaterial({ color: '#2563eb', roughness: 0.4, metalness: 0.4 });
    const shedWallMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.8 });

    // Shed body
    const shedBody = new THREE.Mesh(new THREE.BoxGeometry(15, 6.0, 12), shedWallMat);
    shedBody.position.y = 3.0;
    shedBody.castShadow = true;
    shedGroup.add(shedBody);

    // Pitched Gable Blue Roof
    const roofLeft = new THREE.Mesh(new THREE.BoxGeometry(15.4, 0.4, 7.5), shedBlueMat);
    roofLeft.position.set(0, 7.2, -3.2);
    roofLeft.rotation.x = 0.38;
    roofLeft.castShadow = true;
    shedGroup.add(roofLeft);

    const roofRight = new THREE.Mesh(new THREE.BoxGeometry(15.4, 0.4, 7.5), shedBlueMat);
    roofRight.position.set(0, 7.2, 3.2);
    roofRight.rotation.x = -0.38;
    roofRight.castShadow = true;
    shedGroup.add(roofRight);

    ctx.scene.add(shedGroup);
    return radioBeaconLight;
  }
}
