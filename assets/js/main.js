import { setupScene } from './scene/setup.js';
import { setupCamera } from './scene/camera.js';
import { setupLights } from './scene/lights.js';
import { setupRenderer } from './scene/renderer.js';
import { setupControls } from './scene/controls.js';
import { createObjects } from './objects/objects.js';
import { onInteractionStart, onResize } from './utils/eventHandlers.js';
import { setupKeyboardControls } from './utils/keyboardControls.js';
import { setupInfoBox } from './utils/infoBox.js';
import * as THREE from 'three';
import gsap from 'gsap';

function init() {
  const { scene, container } = setupScene();
  const camera = setupCamera(scene);
  const renderer = setupRenderer(container);
  const controls = setupControls(camera, renderer);
  const groupCubes = createObjects();
  const updateCameraPosition = setupKeyboardControls(camera);
  
  setupLights(scene);
  scene.add(groupCubes);
  
  // Animation
  gsap.from(groupCubes.rotation, { duration: 100, y: Math.PI * 2, repeat: -1 });
  
  // Event listeners
  window.addEventListener('mousedown', (e) => onInteractionStart(e, groupCubes));
  window.addEventListener('touchstart', (e) => onInteractionStart(e, groupCubes), { passive: false });
  window.addEventListener('resize', () => onResize(camera, renderer));
  
  setupInfoBox();
  
  let lastTime = 0;
  // Animation loop
  function animate(currentTime) {
    requestAnimationFrame(animate);
    
    // Calculate delta time
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    updateCameraPosition();
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate(0);
}

init(); 