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
import gsap from 'gsap';

async function init() {
    const modelContainer = document.querySelector('.model-container');
    const { scene } = setupScene();
    const camera = setupCamera(scene);
    const renderer = setupRenderer(modelContainer);
    const controls = setupControls(camera, renderer);
    const { groupCubes, robotPromise } = createObjects();
    let hasMovedFirstTime = false;
    let robot = null;
    const updateCameraPosition = setupKeyboardControls(camera, controls);
    
    setupLights(scene);
    scene.add(groupCubes);
    
    // Load robot and add to scene, but don't move it yet
    robot = await robotPromise;
    if (robot) {
        scene.add(robot);
        console.log('Robot loaded and added to scene');
        
        // Initial position in front of camera
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        console.log('Camera direction:', cameraDirection);
        
        const initialPosition = new THREE.Vector3();
        initialPosition.copy(camera.position);
        initialPosition.z -= 50; // Place robot 50 units in front of camera
        initialPosition.y -= 5;  // Slightly lower than camera
        
        robot.position.copy(initialPosition);
        console.log('Initial robot position:', robot.position);
        
        // Set initial rotation to face camera
        const robotToCamera = new THREE.Vector3().subVectors(camera.position, robot.position);
        const initialAngle = Math.atan2(robotToCamera.x, robotToCamera.z);
        robot.rotation.y = initialAngle;
    } else {
        console.error('Failed to load robot');
    }

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
    let lastCameraPosition = camera.position.clone();
    let lastControlsTarget = controls.target.clone();
    let initialRobotPosition = null;
    let movementTimeout = null;
    let isMoving = false;
    
    // Animation loop
    function animate(currentTime) {
        requestAnimationFrame(animate);
        
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        
        // Update robot animations if available
        if (robot && robot.mixer) {
            robot.mixer.update(deltaTime);
        }
        
        // Store initial robot position
        if (robot && !initialRobotPosition) {
            initialRobotPosition = robot.position.clone();
        }
        
        // Check if camera has moved
        if (!hasMovedFirstTime && 
            (!lastCameraPosition.equals(camera.position) || !lastControlsTarget.equals(controls.target))) {
            hasMovedFirstTime = true;
            console.log('Started robot movement after first camera move');
        }
        
        // Detect if camera is currently moving (either position or orbit controls)
        if (!camera.position.equals(lastCameraPosition) || !lastControlsTarget.equals(controls.target)) {
            isMoving = true;
            // Clear existing timeout
            if (movementTimeout) clearTimeout(movementTimeout);
            // Set new timeout
            movementTimeout = setTimeout(() => {
                isMoving = false;
            }, 500); // Wait 500ms after last movement before considering stopped
        }
        
        // Update last positions
        lastCameraPosition.copy(camera.position);
        lastControlsTarget.copy(controls.target);
        
        // Update robot position and rotation
        if (robot) {
            if (!hasMovedFirstTime) {
                // Keep robot in initial position until movement
                robot.position.copy(initialRobotPosition);
            } else if (isMoving) {
                // Moving behavior - follow camera
                const cameraDirection = new THREE.Vector3();
                camera.getWorldDirection(cameraDirection);
                
                const targetPosition = new THREE.Vector3();
                targetPosition.copy(camera.position);
                targetPosition.add(cameraDirection.multiplyScalar(50)); 
                targetPosition.y = camera.position.y - 1;
                
                gsap.to(robot.position, {
                    x: targetPosition.x,
                    y: targetPosition.y,
                    z: targetPosition.z,
                    duration: 0.02,
                    ease: "power1.out"
                });

                const robotToCamera = new THREE.Vector3().subVectors(camera.position, robot.position);
                const angle = Math.atan2(robotToCamera.x, robotToCamera.z);
                gsap.to(robot.rotation, {
                    y: angle + Math.PI,
                    duration: 0.1,
                    ease: "power1.out"
                });
            } else {
                // Not moving - return to front-facing position
                const cameraDirection = new THREE.Vector3();
                camera.getWorldDirection(cameraDirection);
                
                const frontPosition = new THREE.Vector3();
                frontPosition.copy(camera.position);
                frontPosition.z -= 50;
                frontPosition.y = camera.position.y - 5;
                
                gsap.to(robot.position, {
                    x: frontPosition.x,
                    y: frontPosition.y,
                    z: frontPosition.z,
                    duration: 0.02,
                });

                const robotToCamera = new THREE.Vector3().subVectors(camera.position, robot.position);
                const angle = Math.atan2(robotToCamera.x, robotToCamera.z);
                gsap.to(robot.rotation, {
                    y: angle,
                    duration: 0.02,
                });
            }
        }
        
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