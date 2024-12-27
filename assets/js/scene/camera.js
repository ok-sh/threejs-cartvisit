import * as THREE from 'three';

export function setupCamera(scene) {
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.set(0, 0, 100);
  
  scene.add(camera);
  return camera;
} 