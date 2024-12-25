import { setupScene } from './scene/setup.js';
import { setupCamera } from './scene/camera.js';
import { setupLights } from './scene/lights.js';
import { setupRenderer } from './scene/renderer.js';
import { setupControls } from './scene/controls.js';
import { createObjects } from './objects/objects.js';
import { onInteractionStart, onResize } from './utils/eventHandlers.js';
import gsap from 'gsap';

function init() {
  const { scene, container } = setupScene();
  const camera = setupCamera(scene);
  const renderer = setupRenderer(container);
  const controls = setupControls(camera, renderer);
  const groupCubes = createObjects();
  
  setupLights(scene);
  scene.add(groupCubes);
  
  // Animation
  gsap.from(groupCubes.rotation, { duration: 100, y: Math.PI * 2, repeat: -1 });
  
  // Event listeners
  window.addEventListener('mousedown', (e) => onInteractionStart(e, groupCubes));
  window.addEventListener('touchstart', (e) => onInteractionStart(e, groupCubes), { passive: false });
  window.addEventListener('resize', () => onResize(camera, renderer));
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
}

init(); 