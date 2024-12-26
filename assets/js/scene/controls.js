import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function setupControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.maxDistance = 100000;
  controls.maxPolarAngle = Math.PI;
  
  return controls;
} 