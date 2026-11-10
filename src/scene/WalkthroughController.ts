import * as THREE from 'three';
import type { CameraController } from './CameraController';
import type { RouteResult } from '../utils/pathfinding';

export interface WalkthroughState {
  progress: number; // 0 to 1
  distanceCoveredMeters: number;
  totalDistanceMeters: number;
  currentInstruction: string;
  isPlaying: boolean;
  speedMultiplier: number;
}

export class WalkthroughController {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraController: CameraController;

  private walkerGroup = new THREE.Group();
  private walkerLight: THREE.PointLight;
  private pulseRing: THREE.Mesh;
  private avatarSphere: THREE.Mesh;

  private curve: THREE.CatmullRomCurve3 | null = null;
  private currentRoute: RouteResult | null = null;
  
  public isActive = false;
  public isPlaying = false;
  public progress = 0;
  public speedMultiplier: 1 | 2 | 4 = 1;

  public onProgress?: (state: WalkthroughState) => void;
  public onComplete?: () => void;

  private previousControlsEnabled = true;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, cameraController: CameraController) {
    this.scene = scene;
    this.camera = camera;
    this.cameraController = cameraController;

    // Build the visual 3D walker avatar
    const sphereGeo = new THREE.SphereGeometry(0.85, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      emissive: '#0284c7',
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.1
    });
    this.avatarSphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.avatarSphere.position.y = 1.6;
    this.walkerGroup.add(this.avatarSphere);

    // Directional Pointer Cone
    const arrowGeo = new THREE.ConeGeometry(0.45, 1.2, 8);
    const arrowMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', emissive: '#d97706', emissiveIntensity: 0.6 });
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
    arrowMesh.rotation.x = Math.PI / 2;
    arrowMesh.position.set(0, 1.6, 1.2);
    this.walkerGroup.add(arrowMesh);

    // Pulse Ring on Ground
    const ringGeo = new THREE.RingGeometry(1.2, 1.6, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    this.pulseRing = new THREE.Mesh(ringGeo, ringMat);
    this.pulseRing.rotation.x = -Math.PI / 2;
    this.pulseRing.position.y = 0.08;
    this.walkerGroup.add(this.pulseRing);

    // Local Glow Light
    this.walkerLight = new THREE.PointLight('#38bdf8', 1.8, 16);
    this.walkerLight.position.y = 2.0;
    this.walkerGroup.add(this.walkerLight);
  }

  public start(route: RouteResult) {
    if (!route.pathCoordinates || route.pathCoordinates.length < 2) return;

    this.currentRoute = route;
    const points = route.pathCoordinates.map(([x, , z]) => new THREE.Vector3(x, 0.4, z));
    this.curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.15);

    this.progress = 0;
    this.isPlaying = true;
    this.isActive = true;
    this.speedMultiplier = 1;

    // Temporarily take over orbit controls
    this.previousControlsEnabled = this.cameraController.controls.enabled;
    this.cameraController.controls.enabled = false;

    if (!this.walkerGroup.parent) {
      this.scene.add(this.walkerGroup);
    }

    // Set initial position
    this.updatePositionAndCamera(0, true);
    this.notifyProgress();
  }

  public pause() {
    this.isPlaying = false;
    this.notifyProgress();
  }

  public resume() {
    if (!this.isActive) return;
    this.isPlaying = true;
    this.notifyProgress();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public setSpeed(speed: 1 | 2 | 4) {
    this.speedMultiplier = speed;
    this.notifyProgress();
  }

  public seek(t: number) {
    if (!this.isActive || !this.curve) return;
    this.progress = Math.max(0, Math.min(1, t));
    this.updatePositionAndCamera(this.progress, true);
    this.notifyProgress();
  }

  public stop() {
    this.isActive = false;
    this.isPlaying = false;

    if (this.walkerGroup.parent) {
      this.scene.remove(this.walkerGroup);
    }

    this.cameraController.controls.enabled = this.previousControlsEnabled;
    this.curve = null;
    this.currentRoute = null;
  }

  public update(deltaTimeSeconds: number, timeMs: number) {
    if (!this.isActive || !this.curve || !this.currentRoute) return;

    // Pulse ring animation
    const ringScale = 1.0 + Math.sin(timeMs * 0.008) * 0.22;
    this.pulseRing.scale.set(ringScale, ringScale, ringScale);
    this.avatarSphere.position.y = 1.6 + Math.sin(timeMs * 0.006) * 0.18;

    if (this.isPlaying) {
      // Walking speed ~ 4.5 km/h = 1.25 m/s.
      // Curve total distance in meters = currentRoute.totalDistanceMeters.
      const totalMeters = Math.max(10, this.currentRoute.totalDistanceMeters);
      const walkingSpeedMetersPerSec = 4.2 * this.speedMultiplier;
      const progressDelta = (walkingSpeedMetersPerSec / totalMeters) * deltaTimeSeconds;

      this.progress += progressDelta;

      if (this.progress >= 1) {
        this.progress = 1;
        this.isPlaying = false;
        this.updatePositionAndCamera(1, false);
        this.notifyProgress();
        if (this.onComplete) {
          this.onComplete();
        }
        return;
      }

      this.updatePositionAndCamera(this.progress, false);
      this.notifyProgress();
    }
  }

  private updatePositionAndCamera(t: number, instant = false) {
    if (!this.curve) return;

    const pos = this.curve.getPointAt(t);
    const tangent = this.curve.getTangentAt(Math.min(0.999, t)).normalize();

    this.walkerGroup.position.copy(pos);
    
    // Rotate walker group to match travel direction
    const angle = Math.atan2(tangent.x, tangent.z);
    this.walkerGroup.rotation.y = angle;

    // Cinematic Third-Person Tracking Camera
    // Position camera behind and elevated from the walker
    const camOffsetDist = 16;
    const camElevation = 9;
    const targetOffsetDist = 7;

    const desiredCamPos = new THREE.Vector3(
      pos.x - tangent.x * camOffsetDist,
      pos.y + camElevation,
      pos.z - tangent.z * camOffsetDist
    );

    const desiredLookTarget = new THREE.Vector3(
      pos.x + tangent.x * targetOffsetDist,
      pos.y + 1.8,
      pos.z + tangent.z * targetOffsetDist
    );

    if (instant) {
      this.camera.position.copy(desiredCamPos);
      this.cameraController.controls.target.copy(desiredLookTarget);
      this.camera.lookAt(desiredLookTarget);
    } else {
      const lerpSpeed = 0.08;
      this.camera.position.lerp(desiredCamPos, lerpSpeed);
      this.cameraController.controls.target.lerp(desiredLookTarget, lerpSpeed);
      this.camera.lookAt(this.cameraController.controls.target);
    }
  }

  private getCurrentInstruction(): string {
    if (!this.currentRoute || !this.currentRoute.instructions.length) return '';
    const numInstructions = this.currentRoute.instructions.length;
    const index = Math.min(numInstructions - 1, Math.floor(this.progress * numInstructions));
    return this.currentRoute.instructions[index]?.text || '';
  }

  private notifyProgress() {
    if (!this.onProgress || !this.currentRoute) return;
    const distCovered = Math.round(this.progress * this.currentRoute.totalDistanceMeters);
    this.onProgress({
      progress: this.progress,
      distanceCoveredMeters: distCovered,
      totalDistanceMeters: this.currentRoute.totalDistanceMeters,
      currentInstruction: this.getCurrentInstruction(),
      isPlaying: this.isPlaying,
      speedMultiplier: this.speedMultiplier
    });
  }
}
