import * as THREE from 'three';
import { CAMPUS_BUILDINGS, type BuildingData } from '../data/campusData';
import { RoadNetworkBuilder } from './RoadNetworkBuilder';
import { EnvironmentBuilder } from './builders/EnvironmentBuilder';
import { CrescentComplexBuilder } from './builders/CrescentComplexBuilder';
import { ZoneBuildingsBuilder } from './builders/ZoneBuildingsBuilder';
import { SkyDomeBuilder } from './builders/SkyDomeBuilder';
import type { BuilderContext } from './builders/types';

export class CampusScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private skyDome: SkyDomeBuilder;
  
  private container: HTMLElement;
  private buildingMeshes: Map<string, THREE.Group> = new Map();
  private labelSprites: THREE.Sprite[] = [];
  private interactiveTargets: THREE.Object3D[] = [];
  private isPointerDragging = false;
  public labelsVisible = true;
  public currentTheme: 'day' | 'night' = 'day';
  
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private hoveredBuildingId: string | null = null;
  public selectedBuildingId: string | null = null;

  // Visual Nav Path
  private pathGroup = new THREE.Group();
  private pathTubeMesh: THREE.Mesh | null = null;
  private pathTextureOffset = 0;
  private pathTexture: THREE.CanvasTexture | null = null;

  // Lighting & Theme
  private hemiLight!: THREE.HemisphereLight;
  private sunLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;
  private nightLightsGroup = new THREE.Group();

  // Animated elements
  private fountainSprayMesh: THREE.Mesh | null = null;
  private radioBeaconLight: THREE.PointLight | null = null;

  // Callbacks
  public onBuildingClick?: (building: BuildingData) => void;
  public onBuildingHover?: (building: BuildingData | null) => void;
  public onDoubleTapGround?: (pos: THREE.Vector3) => void;

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Scene & Environment
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#dbeafe');
    this.scene.fog = new THREE.FogExp2('#cbd5e1', 0.00075);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(42, aspect, 1, 1400);
    this.camera.position.set(-60, 260, 260);
    this.camera.lookAt(-60, 0, 0);

    // 3. Renderer with high dynamic range ACES tone mapping
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // 4. Sky Dome with atmospheric Rayleigh scattering, animated clouds, and night stars
    this.skyDome = new SkyDomeBuilder(this.scene);

    // 5. Lighting with natural outdoor sun & grass bounce
    this.setupLighting();

    // 6. Environment & Grounds
    EnvironmentBuilder.buildGround(this.scene);
    const roadNetwork = RoadNetworkBuilder.buildRoads();
    this.scene.add(roadNetwork);

    const ctx: BuilderContext = {
      scene: this.scene,
      buildingMeshes: this.buildingMeshes,
      createBuildingLabel: this.createBuildingLabel.bind(this)
    };

    const crescent = CrescentComplexBuilder.buildCrescentComplex(ctx);
    this.radioBeaconLight = crescent.radioBeaconLight;

    const zone = ZoneBuildingsBuilder.buildZoneBuildings(ctx);
    this.fountainSprayMesh = zone.fountainSprayMesh;

    EnvironmentBuilder.buildFoliageAndFurniture(this.scene, this.nightLightsGroup);
    this.buildInteractiveTargets();

    // 7. Navigation Path Group
    this.scene.add(this.pathGroup);
    this.createPathTexture();

    // 8. Interaction Events
    this.setupEvents();
  }

  private setupLighting() {
    // Hemispherical bounce: soft blue sky above, warm grass reflection from below
    this.hemiLight = new THREE.HemisphereLight('#dbeafe', '#346b3b', 0.90);
    this.scene.add(this.hemiLight);

    // Warm natural sunlight with tight bias for clean shadows
    this.sunLight = new THREE.DirectionalLight('#fffbeb', 1.45);
    this.sunLight.position.set(130, 230, 105);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 700;
    this.sunLight.shadow.camera.left = -340;
    this.sunLight.shadow.camera.right = 340;
    this.sunLight.shadow.camera.top = 320;
    this.sunLight.shadow.camera.bottom = -320;
    this.sunLight.shadow.bias = -0.00015;
    this.sunLight.shadow.normalBias = 0.04;
    this.scene.add(this.sunLight);

    this.fillLight = new THREE.DirectionalLight('#93c5fd', 0.35);
    this.fillLight.position.set(-150, 90, -100);
    this.scene.add(this.fillLight);

    this.scene.add(this.nightLightsGroup);
    this.nightLightsGroup.visible = false;
  }

  public getLabelSprites(): THREE.Sprite[] {
    return this.labelSprites;
  }

  public buildInteractiveTargets() {
    this.interactiveTargets = [];
    for (const group of this.buildingMeshes.values()) {
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          this.interactiveTargets.push(child);
        }
      });
    }
    this.labelSprites.forEach((sprite) => {
      this.interactiveTargets.push(sprite);
    });
  }

  public toggleLabels(visible?: boolean): boolean {
    this.labelsVisible = visible !== undefined ? visible : !this.labelsVisible;
    this.labelSprites.forEach((sprite) => {
      sprite.visible = this.labelsVisible;
    });
    return this.labelsVisible;
  }

  public setTheme(theme: 'day' | 'night') {
    this.currentTheme = theme;
    this.skyDome.setTheme(theme);

    if (theme === 'night') {
      this.scene.background = new THREE.Color('#070b14');
      if (this.scene.fog) {
        this.scene.fog.color = new THREE.Color('#070b14');
        (this.scene.fog as THREE.FogExp2).density = 0.0012;
      }
      this.hemiLight.color.set('#1e293b');
      this.hemiLight.groundColor.set('#0a0f1d');
      this.hemiLight.intensity = 0.32;

      this.sunLight.color.set('#60a5fa');
      this.sunLight.intensity = 0.28;

      this.fillLight.color.set('#3b82f6');
      this.fillLight.intensity = 0.15;

      this.nightLightsGroup.visible = true;
    } else {
      this.scene.background = new THREE.Color('#dbeafe');
      if (this.scene.fog) {
        this.scene.fog.color = new THREE.Color('#cbd5e1');
        (this.scene.fog as THREE.FogExp2).density = 0.00075;
      }
      this.hemiLight.color.set('#dbeafe');
      this.hemiLight.groundColor.set('#346b3b');
      this.hemiLight.intensity = 0.90;

      this.sunLight.color.set('#fffbeb');
      this.sunLight.intensity = 1.45;

      this.fillLight.color.set('#93c5fd');
      this.fillLight.intensity = 0.35;

      this.nightLightsGroup.visible = false;
    }
  }

  private createBuildingLabel(buildingId: string, text: string, pos: [number, number, number]) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.roundRect(16, 16, 480, 96, 28);
    ctx.fill();

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: true
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(...pos);
    sprite.scale.set(16, 4, 1);
    sprite.userData = { buildingId, isLabel: true };

    this.scene.add(sprite);
    this.labelSprites.push(sprite);
  }

  private createPathTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, 128, 16);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, 2, 64, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(16, 5, 32, 6);

    this.pathTexture = new THREE.CanvasTexture(canvas);
    this.pathTexture.wrapS = THREE.RepeatWrapping;
    this.pathTexture.wrapT = THREE.RepeatWrapping;
  }

  public drawNavigationPath(coordinates: [number, number, number][]) {
    this.clearNavigationPath();
    if (coordinates.length < 2) return;

    const points = coordinates.map(([x, , z]) => new THREE.Vector3(x, 0.38, z));
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.15);
    // Size the tube and its dash pattern by the route's length, not its number of points:
    // routes follow the road polylines now, so the point count varies a lot per meter.
    const routeLength = curve.getLength();
    const tubeGeo = new THREE.TubeGeometry(curve, Math.max(16, Math.ceil(routeLength / 2)), 0.45, 8, false);

    if (this.pathTexture) {
      this.pathTexture.repeat.set(Math.max(2, Math.round(routeLength / 9)), 1);
    }

    const tubeMat = new THREE.MeshBasicMaterial({
      map: this.pathTexture,
      color: '#38bdf8',
      transparent: true,
      opacity: 0.95
    });

    this.pathTubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    this.pathGroup.add(this.pathTubeMesh);

    const startPos = coordinates[0];
    const endPos = coordinates[coordinates.length - 1];

    const createPin = (pos: [number, number, number], color: string) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(pos[0], 0.6, pos[2]);

      const pinSphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 16, 16),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6 })
      );
      pinSphere.position.y = 3.2;
      pinGroup.add(pinSphere);

      const pinCone = new THREE.Mesh(
        new THREE.ConeGeometry(1.2, 2.6, 16),
        new THREE.MeshStandardMaterial({ color })
      );
      pinCone.rotation.x = Math.PI;
      pinCone.position.y = 1.6;
      pinGroup.add(pinCone);

      this.pathGroup.add(pinGroup);
    };

    createPin(startPos, '#22c55e');
    createPin(endPos, '#ef4444');
  }

  public clearNavigationPath() {
    while (this.pathGroup.children.length > 0) {
      const obj = this.pathGroup.children[0];
      this.pathGroup.remove(obj);
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }
    this.pathTubeMesh = null;
  }

  private setupEvents() {
    const dom = this.renderer.domElement;
    dom.style.cursor = 'grab';

    // Prevent context menu on canvas so right-click 3D rotation is uninterrupted
    dom.addEventListener('contextmenu', (e) => e.preventDefault());

    dom.addEventListener('pointermove', (e) => {
      if (this.isPointerDragging) return; // Skip raycasting during camera drag/orbit

      const rect = dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveTargets, true);

      let foundId: string | null = null;
      for (const hit of intersects) {
        if (hit.object.userData && hit.object.userData.isBuilding) {
          foundId = hit.object.userData.buildingId;
          break;
        }
      }

      if (foundId !== this.hoveredBuildingId) {
        this.hoveredBuildingId = foundId;
        dom.style.cursor = foundId ? 'pointer' : 'grab';

        if (this.onBuildingHover) {
          const bldg = foundId ? CAMPUS_BUILDINGS.find(b => b.id === foundId) ?? null : null;
          this.onBuildingHover(bldg);
        }
      }
    });

    let pointerDownPos = { x: 0, y: 0, time: 0 };
    let lastTapTime = 0;
    let lastTapPos = { x: 0, y: 0 };

    dom.addEventListener('pointerdown', (e) => {
      this.isPointerDragging = true;
      if (!this.hoveredBuildingId) {
        dom.style.cursor = 'grabbing';
      }
      pointerDownPos = { x: e.clientX, y: e.clientY, time: performance.now() };
    });

    dom.addEventListener('pointerup', (e) => {
      this.isPointerDragging = false;
      dom.style.cursor = this.hoveredBuildingId ? 'pointer' : 'grab';
      if (e.button !== 0) return;

      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      const elapsed = performance.now() - pointerDownPos.time;

      // Ignore drags/orbits: only accept if movement is small (< 8px) and short (< 600ms)
      if (Math.hypot(dx, dy) > 8 || elapsed > 600) {
        return;
      }

      const rect = dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveTargets, true);

      // Check if clicked a building or label
      for (const hit of intersects) {
        if (hit.object.userData && (hit.object.userData.isBuilding || hit.object.userData.isLabel)) {
          const id = hit.object.userData.buildingId;
          const bldg = CAMPUS_BUILDINGS.find(b => b.id === id);
          if (bldg && this.onBuildingClick) {
            this.selectedBuildingId = id;
            this.onBuildingClick(bldg);
          }
          return;
        }
      }

      // Check for double-tap on touch devices
      const now = performance.now();
      const timeSinceLastTap = now - lastTapTime;
      const distFromLastTap = Math.hypot(e.clientX - lastTapPos.x, e.clientY - lastTapPos.y);

      if (timeSinceLastTap < 350 && distFromLastTap < 25) {
        lastTapTime = 0;
        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const hitPoint = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(groundPlane, hitPoint)) {
          if (this.onDoubleTapGround) {
            this.onDoubleTapGround(hitPoint);
          }
          return;
        }
      }
      lastTapTime = now;
      lastTapPos = { x: e.clientX, y: e.clientY };
    });

    // Desktop double-click to zoom and center on any ground position
    dom.addEventListener('dblclick', (e) => {
      const rect = dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hitPoint = new THREE.Vector3();

      if (this.raycaster.ray.intersectPlane(groundPlane, hitPoint)) {
        if (this.onDoubleTapGround) {
          this.onDoubleTapGround(hitPoint);
        }
      }
    });

    window.addEventListener('resize', () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  public update(time = performance.now()) {
    this.skyDome.update(time, this.camera);

    if (this.pathTexture && this.pathTubeMesh) {
      this.pathTextureOffset -= 0.015;
      this.pathTexture.offset.x = this.pathTextureOffset;
    }

    if (this.fountainSprayMesh) {
      const scale = 1.0 + Math.sin(time * 0.006) * 0.12;
      this.fountainSprayMesh.scale.set(scale, 1.0 + Math.cos(time * 0.008) * 0.15, scale);
      this.fountainSprayMesh.rotation.y += 0.01;
    }

    if (this.radioBeaconLight) {
      this.radioBeaconLight.intensity = (this.currentTheme === 'night' ? 2.5 : 1.0) + Math.sin(time * 0.007) * 0.9;
    }

    // Distance-based Level-of-Detail for 3D building labels
    if (this.labelsVisible) {
      const camPos = this.camera.position;
      for (const sprite of this.labelSprites) {
        const dist = camPos.distanceTo(sprite.position);
        if (dist > 380) {
          sprite.visible = false;
        } else if (dist > 250) {
          sprite.visible = true;
          sprite.material.opacity = Math.max(0.15, 1.0 - (dist - 250) / 130);
        } else {
          sprite.visible = true;
          sprite.material.opacity = 1.0;
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
