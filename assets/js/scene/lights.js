import * as THREE from 'three';

export function setupLights(scene) {
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, 500, 0);
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(spotLight);
  scene.add(ambientLight);
} 