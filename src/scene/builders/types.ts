import * as THREE from 'three';

export interface BuilderContext {
  scene: THREE.Scene;
  buildingMeshes: Map<string, THREE.Group>;
  createBuildingLabel: (buildingId: string, text: string, pos: [number, number, number]) => void;
}
