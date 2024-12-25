import * as THREE from 'three';

export function setupScene() {
  const scene = new THREE.Scene();
  const container = document.querySelector('.model-container');
  return { scene, container };
} 