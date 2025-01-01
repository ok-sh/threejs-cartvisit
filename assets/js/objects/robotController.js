import * as THREE from 'three';
import gsap from 'gsap';
import { isWithinSphereBoundary } from '../utils/boundaries.js';

export const createRobotController = (robot, camera) => {
    let hasMovedFirstTime = false;
    let initialRobotPosition = null;
    let isMoving = false;
    let movementTimeout = null;

    const initializePosition = () => {
        if (!robot) return;
        
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        
        const initialPosition = new THREE.Vector3();
        initialPosition.copy(camera.position);
        initialPosition.z -= 50;
        initialPosition.y -= 5;
        
        robot.position.copy(initialPosition);
        
        const robotToCamera = new THREE.Vector3().subVectors(camera.position, robot.position);
        const initialAngle = Math.atan2(robotToCamera.x, robotToCamera.z);
        robot.rotation.y = initialAngle;

        initialRobotPosition = robot.position.clone();
    };

    const updateMovementState = (cameraPosition, controlsTarget, lastCameraPosition, lastControlsTarget) => {
        if (!hasMovedFirstTime && 
            (!lastCameraPosition.equals(cameraPosition) || !lastControlsTarget.equals(controlsTarget))) {
            hasMovedFirstTime = true;
        }

        if (!cameraPosition.equals(lastCameraPosition) || !lastControlsTarget.equals(controlsTarget)) {
            isMoving = true;
            if (movementTimeout) clearTimeout(movementTimeout);
            movementTimeout = setTimeout(() => {
                isMoving = false;
            }, 1000);
        }
    };

    const calculateMovementDirection = (keysPressed) => {
        const movementDirection = new THREE.Vector3();
        
        if (keysPressed['ArrowUp'] || keysPressed['w']) {
            movementDirection.z = -1;
        } else if (keysPressed['ArrowDown'] || keysPressed['s']) {
            movementDirection.z = 1;
        }
        
        if (keysPressed['ArrowLeft'] || keysPressed['a']) {
            movementDirection.x = -1;
        } else if (keysPressed['ArrowRight'] || keysPressed['d']) {
            movementDirection.x = 1;
        }
        
        return movementDirection;
    };

    const calculateRotationAndTilt = (movementDirection) => {
        let targetRotation = robot.rotation.y;
        let targetTiltX = 0;
        let targetTiltZ = 0;
        
        if (movementDirection.x !== 0 || movementDirection.z !== 0) {
            targetRotation = Math.atan2(movementDirection.x, movementDirection.z);
            
            let angleDiff = targetRotation - robot.rotation.y;
            angleDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI;
            
            if (Math.abs(angleDiff) < Math.PI / 4 || Math.abs(angleDiff) > 3 * Math.PI / 4) {
                targetTiltX = movementDirection.z * 0.5;
            } else {
                if (angleDiff > 0) {
                    targetTiltZ = -0.5;
                } else {
                    targetTiltZ = 0.5;
                }
            }
        }
        
        return { targetRotation, targetTiltX, targetTiltZ };
    };

    const animateRobot = (position, rotationY, tiltX, tiltZ) => {
        gsap.to(robot.position, {
            x: position.x,
            y: position.y,
            z: position.z,
            duration: 0.2,
            ease: "power1.out"
        });
        
        gsap.to(robot.rotation, {
            x: tiltX,
            y: rotationY,
            z: tiltZ,
            duration: 0.2,
            ease: "power2.out"
        });
    };

    const handleStationaryState = () => {
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        
        const frontPosition = new THREE.Vector3();
        frontPosition.copy(camera.position);
        frontPosition.z -= 50;
        frontPosition.y = camera.position.y - 5;
        
        if (!isWithinSphereBoundary(frontPosition)) {
            frontPosition.normalize().multiplyScalar(850);
            frontPosition.y = Math.min(Math.max(frontPosition.y, -850), 850);
        }
        
        animateRobot(frontPosition, 0, 0, 0);
    };

    const handleMovingState = (keysPressed) => {
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        
        const targetPosition = new THREE.Vector3();
        targetPosition.copy(camera.position);
        targetPosition.add(cameraDirection.multiplyScalar(50));
        targetPosition.y = camera.position.y - 5;
        
        if (!isWithinSphereBoundary(targetPosition)) {
            targetPosition.normalize().multiplyScalar(850);
            targetPosition.y = Math.min(Math.max(targetPosition.y, -850), 850);
        }
        
        const movementDirection = calculateMovementDirection(keysPressed);
        const { targetRotation, targetTiltX, targetTiltZ } = calculateRotationAndTilt(movementDirection);

        animateRobot(targetPosition, targetRotation, targetTiltX, targetTiltZ);
    };

    const updatePosition = (keysPressed) => {
        if (!robot) return;

        if (!hasMovedFirstTime) {
            robot.position.copy(initialRobotPosition);
            return;
        }

        const movementDirection = calculateMovementDirection(keysPressed);
        
        if (movementDirection.x === 0 && movementDirection.z === 0 && !isMoving) {
            handleStationaryState();
        } else {
            handleMovingState(keysPressed);
        }
    };

    const updateAnimation = (deltaTime) => {
        if (robot && robot.mixer) {
            robot.mixer.update(deltaTime);
        }
    };

    return {
        initializePosition,
        updateMovementState,
        updatePosition,
        updateAnimation
    };
}; 