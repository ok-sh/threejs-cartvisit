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
    const updateCameraPosition = setupKeyboardControls(camera, controls);
    
    setupLights(scene);
    scene.add(groupCubes);
    
    // Animation
    const rotationTimeline = gsap.timeline({
        repeat: -1
    });
    
    
    rotationTimeline.from(groupCubes.rotation, {
        duration: 100,
        y: Math.PI * 2,
        ease: "none",
        repeat: -1
    });


    
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
        
        lastTime = currentTime;
        
        updateCameraPosition();
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Add sound toggle event listener with animation speed change
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', async () => {
            await soundManager.toggle();
            // Change animation speed based on sound state
            if (!soundManager.isPlaying) {
                rotationTimeline.timeScale(1) // Normal speed when sound is paused
                console.log('Normal speed playing');
            } else {
                rotationTimeline.timeScale(18); 
                console.log('Faster speed');
            }
        });
    }
    
    animate(0);
}

init(); 