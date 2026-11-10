import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Tween, Group, Easing } from '@tweenjs/tween.js';
import { PRESET_VIEWS } from '../data/campusData';

export class CameraController {
  public controls: OrbitControls;
  private camera: THREE.PerspectiveCamera;
  private tweenGroup = new Group();
  private isTweening = false;
  public interactionMode: 'pan' | 'rotate' = 'rotate';
  private isTemporaryRotate = false;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.controls = new OrbitControls(camera, domElement);
    
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI / 2.05; // Do not go underground
    this.controls.minDistance = 15;
    this.controls.maxDistance = 550;
    this.controls.target.set(-60, 0, 0);

    // Zoom towards cursor/pointer position instead of only zooming into the center
    this.controls.zoomToCursor = true;
    this.controls.screenSpacePanning = false;
    this.controls.panSpeed = 1.25;
    this.controls.rotateSpeed = 0.85;

    // Apply default intuitive map navigation mode (Left Drag = Pan map)
    this.applyInteractionMode();
  }

  public setInteractionMode(mode: 'pan' | 'rotate') {
    this.interactionMode = mode;
    this.applyInteractionMode();
  }

  public toggleInteractionMode(): 'pan' | 'rotate' {
    this.interactionMode = this.interactionMode === 'pan' ? 'rotate' : 'pan';
    this.applyInteractionMode();
    return this.interactionMode;
  }

  public setTemporaryRotate(active: boolean) {
    this.isTemporaryRotate = active;
    this.applyInteractionMode();
  }

  private applyInteractionMode() {
    const effectiveMode = this.isTemporaryRotate ? 'rotate' : this.interactionMode;
    if (effectiveMode === 'pan') {
      // Primary: PAN (Drag map laterally, Google Maps style)
      // Secondary: ROTATE (3D Orbit)
      // Middle: DOLLY (Zoom)
      this.controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
      };
      // Touch: 1 finger = PAN (Drag map), 2 fingers = PINCH ZOOM & ROTATE
      this.controls.touches = {
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_ROTATE
      };
    } else {
      // Primary: ROTATE (Orbit around focal point)
      // Secondary: PAN
      this.controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
      // Touch: 1 finger = ROTATE, 2 fingers = PINCH ZOOM & PAN
      this.controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
    }
  }

  public panBy(deltaX: number, deltaZ: number) {
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    
    const right = new THREE.Vector3();
    right.crossVectors(forward, this.camera.up).normalize();

    const offset = new THREE.Vector3()
      .addScaledVector(right, deltaX)
      .addScaledVector(forward, deltaZ);

    this.camera.position.add(offset);
    this.controls.target.add(offset);
    this.controls.update();
  }

  public flyTo(
    targetPos: [number, number, number],
    cameraOffset: [number, number, number] = [0, 28, 38],
    duration = 1200
  ): Promise<void> {
    return new Promise((resolve) => {
      // Clean up any in-flight tweens
      this.tweenGroup.removeAll();
      this.isTweening = true;
      this.controls.enabled = false;

      const endTarget = new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2]);
      const endCamPos = new THREE.Vector3(
        targetPos[0] + cameraOffset[0],
        targetPos[1] + cameraOffset[1],
        targetPos[2] + cameraOffset[2]
      );

      const startCamPos = this.camera.position.clone();
      const startTarget = this.controls.target.clone();

      // Camera position tween
      const camTween = new Tween(startCamPos, this.tweenGroup)
        .to(endCamPos, duration)
        .easing(Easing.Cubic.Out)
        .onUpdate(() => {
          this.camera.position.copy(startCamPos);
        });

      // Controls target tween
      const targetTween = new Tween(startTarget, this.tweenGroup)
        .to(endTarget, duration)
        .easing(Easing.Cubic.Out)
        .onUpdate(() => {
          this.controls.target.copy(startTarget);
        })
        .onComplete(() => {
          this.isTweening = false;
          this.controls.enabled = true;
          this.controls.update();
          resolve();
        });

      camTween.start();
      targetTween.start();

      // Safety fallback timeout to guarantee controls are never stuck disabled
      setTimeout(() => {
        if (this.isTweening) {
          this.isTweening = false;
          this.controls.enabled = true;
          this.controls.update();
          resolve();
        }
      }, duration + 300);
    });
  }

  public flyToPreset(presetKey: keyof typeof PRESET_VIEWS): Promise<void> {
    const preset = PRESET_VIEWS[presetKey];
    if (!preset) return Promise.resolve();

    return new Promise((resolve) => {
      this.tweenGroup.removeAll();
      this.isTweening = true;
      this.controls.enabled = false;

      const endCamPos = new THREE.Vector3(...preset.position);
      const endTarget = new THREE.Vector3(...preset.target);

      const startCamPos = this.camera.position.clone();
      const startTarget = this.controls.target.clone();

      const camTween = new Tween(startCamPos, this.tweenGroup)
        .to(endCamPos, 1100)
        .easing(Easing.Cubic.Out)
        .onUpdate(() => {
          this.camera.position.copy(startCamPos);
        });

      const targetTween = new Tween(startTarget, this.tweenGroup)
        .to(endTarget, 1100)
        .easing(Easing.Cubic.Out)
        .onUpdate(() => {
          this.controls.target.copy(startTarget);
        })
        .onComplete(() => {
          this.isTweening = false;
          this.controls.enabled = true;
          this.controls.update();
          resolve();
        });

      camTween.start();
      targetTween.start();

      setTimeout(() => {
        if (this.isTweening) {
          this.isTweening = false;
          this.controls.enabled = true;
          this.controls.update();
          resolve();
        }
      }, 1400);
    });
  }

  public fitRoute(
    coordinates: [number, number, number][],
    duration = 1100
  ): Promise<void> {
    if (!coordinates || coordinates.length < 2) return Promise.resolve();

    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;

    coordinates.forEach(([x, , z]) => {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    });

    const centerX = (minX + maxX) / 2;
    const centerZ = (minZ + maxZ) / 2;
    const spanX = maxX - minX;
    const spanZ = maxZ - minZ;
    const maxSpan = Math.max(spanX, spanZ, 45);

    const targetPos: [number, number, number] = [centerX, 0, centerZ];
    const cameraOffset: [number, number, number] = [
      0,
      Math.max(38, maxSpan * 0.95 + 18),
      Math.max(48, maxSpan * 0.9 + 25)
    ];

    return this.flyTo(targetPos, cameraOffset, duration);
  }

  public getAzimuthalAngle(): number {
    return this.controls.getAzimuthalAngle();
  }

  public resetHeadingNorth(duration = 800): Promise<void> {
    return new Promise((resolve) => {
      this.tweenGroup.removeAll();
      this.isTweening = true;
      this.controls.enabled = false;

      const target = this.controls.target.clone();
      const dist = this.camera.position.distanceTo(target);
      const polar = Math.max(0.2, Math.min(Math.PI / 2.1, this.controls.getPolarAngle()));

      // North heading: camera placed directly South of target (+Z) looking North (-Z)
      const endCamPos = new THREE.Vector3(
        target.x,
        target.y + dist * Math.cos(polar),
        target.z + dist * Math.sin(polar)
      );

      const startCamPos = this.camera.position.clone();

      const camTween = new Tween(startCamPos, this.tweenGroup)
        .to(endCamPos, duration)
        .easing(Easing.Cubic.Out)
        .onUpdate(() => {
          this.camera.position.copy(startCamPos);
          this.controls.target.copy(target);
        })
        .onComplete(() => {
          this.isTweening = false;
          this.controls.enabled = true;
          this.controls.update();
          resolve();
        });

      camTween.start();

      setTimeout(() => {
        if (this.isTweening) {
          this.isTweening = false;
          this.controls.enabled = true;
          this.controls.update();
          resolve();
        }
      }, duration + 200);
    });
  }

  public zoomIn(delta = 22) {
    const dist = this.camera.position.distanceTo(this.controls.target);
    const newDist = Math.max(this.controls.minDistance, dist - delta);
    const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target).normalize();
    this.camera.position.copy(this.controls.target).addScaledVector(dir, newDist);
    this.controls.update();
  }

  public zoomOut(delta = 22) {
    const dist = this.camera.position.distanceTo(this.controls.target);
    const newDist = Math.min(this.controls.maxDistance, dist + delta);
    const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target).normalize();
    this.camera.position.copy(this.controls.target).addScaledVector(dir, newDist);
    this.controls.update();
  }

  public update(time?: number) {
    this.tweenGroup.update(time);
    
    // Auto-recover if all tweens in group have finished
    if (this.isTweening && this.tweenGroup.allStopped()) {
      this.isTweening = false;
      this.controls.enabled = true;
    }

    if (!this.isTweening) {
      this.controls.update();

      // Generous boundaries covering the entire campus terrain, roads, and complexes
      const minX = -440;
      const maxX = 300;
      const minZ = -340;
      const maxZ = 300;

      const clampedX = Math.max(minX, Math.min(maxX, this.controls.target.x));
      const clampedZ = Math.max(minZ, Math.min(maxZ, this.controls.target.z));
      const clampedY = Math.max(0, Math.min(50, this.controls.target.y));

      const shiftX = (clampedX - this.controls.target.x) * 0.25;
      const shiftZ = (clampedZ - this.controls.target.z) * 0.25;
      const shiftY = (clampedY - this.controls.target.y) * 0.25;

      // Shift smoothly so panning stops gracefully without snap stutter
      if (Math.abs(shiftX) > 0.01 || Math.abs(shiftZ) > 0.01 || Math.abs(shiftY) > 0.01) {
        this.controls.target.x += shiftX;
        this.controls.target.y += shiftY;
        this.controls.target.z += shiftZ;
        this.camera.position.x += shiftX;
        this.camera.position.y += shiftY;
        this.camera.position.z += shiftZ;
      }
    }
  }
}

