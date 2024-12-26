import * as THREE from 'three';

export function setupScene() {
  const scene = new THREE.Scene();
  const container = document.querySelector('.model-container');
  
  // Add error checking
  if (!container) {
    console.error('Could not find .model-container element');
    return;
  }
  
  return { scene, container };
} 