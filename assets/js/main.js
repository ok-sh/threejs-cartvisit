import { setupScene } from './scene/setup.js';
import { setupCamera } from './scene/camera.js';
import { setupLights } from './scene/lights.js';
import { setupRenderer } from './scene/renderer.js';
import { setupControls } from './scene/controls.js';
import { createObjects } from './objects/objects.js';
import { onInteractionStart, onResize, onMouseMove } from './utils/eventHandlers.js';
import { setupKeyboardControls } from './utils/keyboardControls.js';
import { setupInfoBox } from './utils/infoBox.js';
import { soundManager } from './utils/sound.js';
import gsap from 'gsap';

function init() {
    const modelContainer = document.querySelector('.model-container');
    const { scene } = setupScene();
    const camera = setupCamera(scene);
    const renderer = setupRenderer(modelContainer);
    const controls = setupControls(camera, renderer);
    const groupCubes = createObjects();
    const updateCameraPosition = setupKeyboardControls(camera);
    
    setupLights(scene);
    scene.add(groupCubes);
    
    // Animation
    gsap.from(groupCubes.rotation, { duration: 100, y: Math.PI * 2, repeat: -1 });
    
    // Event listeners
    const canvas = renderer.domElement;
    
    // Remove window event listeners for mouse/touch events
    canvas.addEventListener('mousedown', (e) => onInteractionStart(e, camera, groupCubes));
    canvas.addEventListener('touchstart', (e) => onInteractionStart(e, camera, groupCubes), { passive: false });
    canvas.addEventListener('mousemove', (e) => onMouseMove(e, camera, groupCubes));
    canvas.addEventListener('touchmove', (e) => onMouseMove(e, camera, groupCubes), { passive: false });
    
    // Keep window resize event
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
    
    // Add sound toggle event listener
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => soundManager.toggle());
    }
    
    animate(0);
}

init(); 