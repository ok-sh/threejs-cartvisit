import * as THREE from 'three';

export function setupCamera(scene) {
  const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight);
  camera.position.set(0, 0, -10);
  camera.lookAt(0, 0, 0);
  
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  
  scene.add(camera);
  return camera;
} 