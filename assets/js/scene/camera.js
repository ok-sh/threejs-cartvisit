import * as THREE from 'three';

export function setupCamera(scene) {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
  );
  
  // Position camera higher and further back for third-person view
  camera.position.set(0, 0, 0);
  camera.lookAt(0, 0, 0);
  
  scene.add(camera);
  return camera;
} 