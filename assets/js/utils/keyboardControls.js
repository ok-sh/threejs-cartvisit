import * as THREE from 'three';

export function setupKeyboardControls(camera, controls) {
  const moveSpeed = 3.0;
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
    // Get the camera's forward and right vectors
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    
    camera.getWorldDirection(forward);
    right.crossVectors(forward, camera.up).normalize();
    
    // Calculate movement based on pressed keys
    const movement = new THREE.Vector3(0, 0, 0);

    // Forward/Backward
    if (keysPressed['ArrowUp'] || keysPressed['w']) {
      movement.add(forward.clone().multiplyScalar(moveSpeed));
    }
    if (keysPressed['ArrowDown'] || keysPressed['s']) {
      movement.add(forward.clone().multiplyScalar(-moveSpeed));
    }

    // Left/Right
    if (keysPressed['ArrowLeft'] || keysPressed['a']) {
      movement.add(right.clone().multiplyScalar(-moveSpeed));
    }
    if (keysPressed['ArrowRight'] || keysPressed['d']) {
      movement.add(right.clone().multiplyScalar(moveSpeed));
    }

    // Up/Down
    if (keysPressed[' ']) { // Space key
      movement.y += moveSpeed;
    }
    if (keysPressed['Control'] || keysPressed['ctrl']) {
      movement.y -= moveSpeed;
    }

    // Apply movement using controls
    if (movement.length() > 0) {
      controls.target.add(movement);
      camera.position.add(movement);
      controls.update();
    }
  }

  return updateCamera;
} 