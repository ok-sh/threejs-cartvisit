import * as THREE from 'three';
import gsap from 'gsap';
import { soundManager } from './sound.js';

// Global variables
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED = null;
const DEFAULT_COLOR = new THREE.Color(0x4e8397);
const HOVER_BRIGHTNESS = 1.5; // Multiplier for hover brightness
let score = 0;

export function onMouseMove(event, camera, groupCubes) {
    event.preventDefault();

    // Update mouse coordinates
    if (event.touches && event.touches[0]) {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    } else {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(groupCubes.children, true);

    if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;
        
        if (INTERSECTED !== hoveredObject) {
            if (INTERSECTED) {
                // Restore previous color (base color or clicked color)
                const baseColor = INTERSECTED.userData.clickedColor || DEFAULT_COLOR;
                gsap.to(INTERSECTED.material.color, {
                    r: baseColor.r,
                    g: baseColor.g,
                    b: baseColor.b,
                    duration: 0.3
                });
            }
            
            INTERSECTED = hoveredObject;
            
            // Store current color before hover
            const currentColor = INTERSECTED.userData.clickedColor || DEFAULT_COLOR;
            // Make it brighter for hover effect
            const brighterColor = currentColor.clone().multiplyScalar(HOVER_BRIGHTNESS);
            
            gsap.to(INTERSECTED.material.color, {
                r: brighterColor.r,
                g: brighterColor.g,
                b: brighterColor.b,
                duration: 0.3
            });
        }
    } else {
        if (INTERSECTED) {
            // Restore previous color (base color or clicked color)
            const baseColor = INTERSECTED.userData.clickedColor || DEFAULT_COLOR;
            gsap.to(INTERSECTED.material.color, {
                r: baseColor.r,
                g: baseColor.g,
                b: baseColor.b,
                duration: 0.3
            });
            INTERSECTED = null;
        }
    }
}

export function onInteractionStart(event, camera, groupCubes) {
    if (event.type === 'touchstart') {
        event.preventDefault();
    }

    // Set up raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Get mouse position
    if (event.type === 'touchstart') {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    } else {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(groupCubes.children);
    
    if (intersects.length > 0) {
        const cube = intersects[0].object;
        soundManager.playClick();

        // Animate cube disappearance
        gsap.to(cube.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.3,
            ease: "back.in",
            onComplete: () => {
                groupCubes.remove(cube);
                cube.geometry.dispose();
                cube.material.dispose();
            }
        });

        // Update score
        score += 10;
        const scoreDisplay = document.getElementById('score');
        if (scoreDisplay) {
            scoreDisplay.textContent = `Score: ${score}`;
        }
    }
}

export function onResize(camera, renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
} 