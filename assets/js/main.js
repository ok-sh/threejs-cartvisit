import * as THREE from 'three';
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
import { setupRotationAnimation, updateAnimationSpeed } from './animation/rotationAnimation.js';
import { createRobotController } from './objects/robotController.js';


async function init() {
    const modelContainer = document.querySelector('.model-container');
    const { scene } = setupScene();
    const camera = setupCamera(scene);
    const renderer = setupRenderer(modelContainer);
    const controls = setupControls(camera, renderer);
    const { groupCubes, robotPromise } = createObjects();
    const { updateCamera, getKeysPressed } = setupKeyboardControls(camera, controls);
    
    setupLights(scene);
    scene.add(groupCubes);
    
    // Setup rotation animation
    const rotationTimeline = setupRotationAnimation(groupCubes);
    
    // Load robot and add to scene
    const robot = await robotPromise;
    if (robot) {
        scene.add(robot);
        console.log('Robot loaded and added to scene');
    } else {
        console.error('Failed to load robot');
    }

    // Initialize robot controller
    const robotController = createRobotController(robot, camera);
    robotController.initializePosition();

    // Event listeners
    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', (e) => onInteractionStart(e, camera, groupCubes));
    canvas.addEventListener('touchstart', (e) => onInteractionStart(e, camera, groupCubes), { passive: false });
    canvas.addEventListener('mousemove', (e) => onMouseMove(e, camera, groupCubes));
    canvas.addEventListener('touchmove', (e) => onMouseMove(e, camera, groupCubes), { passive: false });
    window.addEventListener('resize', () => onResize(camera, renderer));
    
    setupInfoBox();
    
    let lastTime = 0;
    let lastCameraPosition = camera.position.clone();
    let lastControlsTarget = controls.target.clone();
    
    // Animation loop
    function animate(currentTime) {
        requestAnimationFrame(animate);
        
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        
        // Update robot controller
        robotController.updateAnimation(deltaTime);
        robotController.updateMovementState(
            camera.position,
            controls.target,
            lastCameraPosition,
            lastControlsTarget
        );
        robotController.updatePosition(getKeysPressed());
        
        // Update last positions
        lastCameraPosition.copy(camera.position);
        lastControlsTarget.copy(controls.target);
        
        updateCamera();
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Add sound toggle event listener
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', async () => {
            await soundManager.toggle();
            updateAnimationSpeed(rotationTimeline, soundManager.isPlaying);
        });
    }
    
    animate(0);
}

init(); 