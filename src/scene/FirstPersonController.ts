import * as THREE from 'three';
import { Tween, Group, Easing } from '@tweenjs/tween.js';
import type { CameraController } from './CameraController';

export interface TeleportLocation {
  name: string;
  position: [number, number, number];
  yaw: number;
}

export const STREET_VIEW_SPAWNS: Record<string, TeleportLocation> = {
  gate: {
    name: 'Main Gate (NH-12)',
    position: [142, 1.7, 41],
    yaw: -Math.PI / 2 // Facing West into campus
  },
  plaza: {
    name: 'Central Fountain Plaza',
    position: [76, 1.7, 36],
    yaw: -Math.PI / 2
  },
  crescent: {
    name: 'Twin Crescent Forecourt',
    position: [12, 1.7, 10],
    yaw: -Math.PI / 2
  },
  karigari: {
    name: 'Cafe Karigari & Food Zone',
    position: [102, 1.7, 32],
    yaw: 0
  },
  biotech: {
    name: 'BioTech Building Portico',
    position: [-23, 1.7, 105],
    yaw: Math.PI / 2
  },
  sports: {
    name: 'Sports Ground Track',
    position: [-65, 1.7, -15],
    yaw: -Math.PI / 2
  }
};

export class FirstPersonController {
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;
  private cameraController: CameraController;

  public isActive = false;
  private tweenGroup = new Group();
  private isTransitioning = false;

  // Camera orientation
  public yaw = -Math.PI / 2; // Horizontal angle in radians
  public pitch = 0;          // Vertical angle in radians

  // Movement & physics
  public position = new THREE.Vector3(142, 1.7, 41);
  private velocity = new THREE.Vector3();
  private keysDown = new Set<string>();

  // Head bob
  private bobTimer = 0;
  private isMoving = false;
  private isSprinting = false;

  // Touch & Mouse drag
  private isDraggingLook = false;
  private lastPointerPos = { x: 0, y: 0 };
  public virtualJoystickMove = { x: 0, y: 0 }; // [-1..1] for mobile joystick

  // Events & callbacks
  public onStateChange?: (active: boolean) => void;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement, cameraController: CameraController) {
    this.camera = camera;
    this.domElement = domElement;
    this.cameraController = cameraController;

    this.setupInputListeners();
  }

  public enter(spawnKey = 'gate'): Promise<void> {
    if (this.isActive) return Promise.resolve();

    this.isActive = true;
    this.isTransitioning = true;
    this.cameraController.controls.enabled = false;

    const spawn = STREET_VIEW_SPAWNS[spawnKey] || STREET_VIEW_SPAWNS.gate;
    this.position.set(spawn.position[0], spawn.position[1], spawn.position[2]);
    this.yaw = spawn.yaw;
    this.pitch = -0.05;

    if (this.onStateChange) this.onStateChange(true);

    return new Promise((resolve) => {
      this.tweenGroup.removeAll();

      const startPos = this.camera.position.clone();
      const endPos = this.position.clone();

      const startTarget = this.cameraController.controls.target.clone();
      const endTarget = endPos.clone().add(new THREE.Vector3(Math.cos(this.yaw) * 10, 0, Math.sin(this.yaw) * 10));

      const tweenPos = new Tween(startPos, this.tweenGroup)
        .to(endPos, 1100)
        .easing(Easing.Cubic.InOut)
        .onUpdate(() => {
          this.camera.position.copy(startPos);
        });

      const tweenTarget = new Tween(startTarget, this.tweenGroup)
        .to(endTarget, 1100)
        .easing(Easing.Cubic.InOut)
        .onUpdate(() => {
          this.camera.lookAt(startTarget);
        })
        .onComplete(() => {
          this.isTransitioning = false;
          this.updateCameraRotation();
          resolve();
        });

      tweenPos.start();
      tweenTarget.start();
    });
  }

  public exit(): Promise<void> {
    if (!this.isActive) return Promise.resolve();

    this.isActive = false;
    this.isTransitioning = true;
    this.keysDown.clear();
    this.virtualJoystickMove = { x: 0, y: 0 };

    if (this.onStateChange) this.onStateChange(false);

    return new Promise((resolve) => {
      this.tweenGroup.removeAll();

      const startPos = this.camera.position.clone();
      const currentTarget = this.position.clone();

      // Return to elevated orbit view looking down at where the user was walking
      const endPos = currentTarget.clone().add(new THREE.Vector3(0, 48, 56));

      const tween = new Tween(startPos, this.tweenGroup)
        .to(endPos, 900)
        .easing(Easing.Cubic.Out)
        .onUpdate(() => {
          this.camera.position.copy(startPos);
          this.camera.lookAt(currentTarget);
        })
        .onComplete(() => {
          this.cameraController.controls.target.copy(currentTarget);
          this.cameraController.controls.enabled = true;
          this.cameraController.controls.update();
          this.isTransitioning = false;
          resolve();
        });

      tween.start();
    });
  }

  public teleportTo(spawnKey: string) {
    const spawn = STREET_VIEW_SPAWNS[spawnKey];
    if (!spawn) return;

    this.position.set(spawn.position[0], spawn.position[1], spawn.position[2]);
    this.yaw = spawn.yaw;
    this.pitch = 0;
    this.camera.position.copy(this.position);
    this.updateCameraRotation();
  }

  private setupInputListeners() {
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      this.keysDown.add(e.key.toLowerCase());

      if (e.key === 'Escape') {
        this.exit();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (!this.isActive) return;
      this.keysDown.delete(e.key.toLowerCase());
    });

    // Mouse / Touch Look
    this.domElement.addEventListener('pointerdown', (e) => {
      if (!this.isActive || this.isTransitioning) return;
      this.isDraggingLook = true;
      this.lastPointerPos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isActive || !this.isDraggingLook || this.isTransitioning) return;

      const deltaX = e.clientX - this.lastPointerPos.x;
      const deltaY = e.clientY - this.lastPointerPos.y;
      this.lastPointerPos = { x: e.clientX, y: e.clientY };

      const sensitivity = 0.0032;
      this.yaw -= deltaX * sensitivity;
      this.pitch -= deltaY * sensitivity;

      // Clamp vertical pitch to prevent flipping upside down (-80 deg to +80 deg)
      const maxPitch = (Math.PI / 2) * 0.88;
      this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

      this.updateCameraRotation();
    });

    window.addEventListener('pointerup', () => {
      this.isDraggingLook = false;
    });

    window.addEventListener('pointercancel', () => {
      this.isDraggingLook = false;
    });
  }

  private updateCameraRotation() {
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.x = this.pitch;
    euler.y = this.yaw;
    this.camera.quaternion.setFromEuler(euler);
  }

  public update(deltaSeconds: number, timeMs: number) {
    this.tweenGroup.update(timeMs);
    if (!this.isActive || this.isTransitioning) return;

    // Determine movement direction vector
    let moveForward = 0;
    let moveRight = 0;

    if (this.keysDown.has('w') || this.keysDown.has('arrowup')) moveForward += 1;
    if (this.keysDown.has('s') || this.keysDown.has('arrowdown')) moveForward -= 1;
    if (this.keysDown.has('a') || this.keysDown.has('arrowleft')) moveRight -= 1;
    if (this.keysDown.has('d') || this.keysDown.has('arrowright')) moveRight += 1;

    // Apply mobile virtual joystick input if present
    if (Math.abs(this.virtualJoystickMove.y) > 0.1) {
      moveForward -= this.virtualJoystickMove.y;
    }
    if (Math.abs(this.virtualJoystickMove.x) > 0.1) {
      moveRight += this.virtualJoystickMove.x;
    }

    this.isSprinting = this.keysDown.has('shift');
    const baseSpeed = this.isSprinting ? 12.0 : 6.0;

    const inputVector = new THREE.Vector2(moveRight, moveForward);
    this.isMoving = inputVector.lengthSq() > 0.01;

    if (this.isMoving) {
      inputVector.normalize();
    }

    // Direction vectors based on yaw
    const forwardVec = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const rightVec = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    const targetVelocity = new THREE.Vector3()
      .addScaledVector(forwardVec, inputVector.y * baseSpeed)
      .addScaledVector(rightVec, inputVector.x * baseSpeed);

    // Smooth inertia
    this.velocity.lerp(targetVelocity, 0.25);

    // Apply movement
    this.position.addScaledVector(this.velocity, deltaSeconds);

    // Campus boundary safety clamping
    this.position.x = Math.max(-320, Math.min(160, this.position.x));
    this.position.z = Math.max(-230, Math.min(200, this.position.z));

    // Realistic walking head bob
    if (this.isMoving) {
      this.bobTimer += deltaSeconds * (this.isSprinting ? 16 : 10);
      const bobOffset = Math.sin(this.bobTimer) * (this.isSprinting ? 0.08 : 0.04);
      this.camera.position.set(this.position.x, 1.7 + bobOffset, this.position.z);
    } else {
      this.camera.position.set(this.position.x, 1.7, this.position.z);
    }

    this.updateCameraRotation();
  }
}
