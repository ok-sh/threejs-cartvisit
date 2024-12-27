// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
// import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { MapControls } from 'three/examples/jsm/controls/MapControls';

export function setupControls(camera, renderer) {
  // const controls = new TrackballControls(camera, renderer.domElement);
  // const controls = new PointerLockControls(camera, renderer.domElement);
  const controls = new MapControls(camera, renderer.domElement);
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.05;
  // controls.screenSpacePanning = false;
  // controls.maxDistance = 100000;
  // controls.maxPolarAngle = Math.PI;
  
  return controls;
} 