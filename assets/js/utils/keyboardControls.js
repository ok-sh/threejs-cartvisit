import * as THREE from 'three';

export function setupKeyboardControls(camera) {
  const moveSpeed = 2.0;
  const keysPressed = {};

  window.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
      event.preventDefault();
    }
  });

  window.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
  });

  function updateCamera() {
    // Create a normalized direction vector for forward movement
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.normalize();

    // Create a normalized right vector
    const right = new THREE.Vector3();
    right.crossVectors(direction, camera.up).normalize();

    // Movement speed this frame
    const currentSpeed = moveSpeed;

    // Forward/Backward
    if (keysPressed['ArrowUp'] || keysPressed['w']) {
      camera.translateZ(-currentSpeed);
    }
    if (keysPressed['ArrowDown'] || keysPressed['s']) {
      camera.translateZ(currentSpeed);
    }

    // Left/Right
    if (keysPressed['ArrowLeft'] || keysPressed['a']) {
      camera.translateX(-currentSpeed);
    }
    if (keysPressed['ArrowRight'] || keysPressed['d']) {
      camera.translateX(currentSpeed);
    }

    // Up/Down
    if (keysPressed[' ']) { // Space key
      camera.translateY(currentSpeed);
    }
    if (keysPressed['Shift']) {
      camera.translateY(-currentSpeed);
    }
  }

  return updateCamera;
} 