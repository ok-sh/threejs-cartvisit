import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createObjects() {
  const groupCubes = new THREE.Group();
  const cubeSize = 3;
  const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const material = new THREE.MeshMatcapMaterial({ color: 0x4e8397 });
  const radius = 900;
  const totalCubes = 600;
  const randomCubeCount = 200;
  const clearRadius = 100; // Radius of clear space around robot

  // Add objects on the sphere's surface
  for (let i = 0; i < totalCubes; i++) {
    const object = new THREE.Mesh(geometry, material);
    const theta = Math.acos(1 - (2 * (i + 0.5)) / totalCubes);
    const phi = Math.PI * (1 + Math.sqrt(5)) * i;

    object.position.x = radius * Math.sin(theta) * Math.cos(phi);
    object.position.y = radius * Math.sin(theta) * Math.sin(phi);
    object.position.z = radius * Math.cos(theta);
    object.lookAt(0, 0, 0);

    groupCubes.add(object);
  }

  // Add random objects inside the sphere
  for (let i = 0; i < randomCubeCount; i++) {
    const object = new THREE.Mesh(geometry, material.clone());
    let validPosition = false;
    let attempts = 0;
    
    // Keep trying to find a valid position
    while (!validPosition && attempts < 100) {
      const randomRadius = clearRadius + (Math.random() * (radius - clearRadius));
      const randomTheta = Math.acos(2 * Math.random() - 1);
      const randomPhi = Math.random() * 2 * Math.PI;

      object.position.x = randomRadius * Math.sin(randomTheta) * Math.cos(randomPhi);
      object.position.y = randomRadius * Math.sin(randomTheta) * Math.sin(randomPhi);
      object.position.z = randomRadius * Math.cos(randomTheta);

      // Check if position is far enough from center
      const distanceFromCenter = Math.sqrt(
        object.position.x * object.position.x +
        object.position.y * object.position.y +
        object.position.z * object.position.z
      );

      if (distanceFromCenter > clearRadius) {
        validPosition = true;
      }
      attempts++;
    }

    if (validPosition) {
      groupCubes.add(object);
    }
  }

  // Create a promise to load the robot
  const robotPromise = new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load('/assets/models/robot/scene.gltf', (gltf) => {
      const robot = gltf.scene;
      console.log('Robot model loaded successfully');
      
      // Scale robot to match scene scale
      const scale = 10;
      robot.scale.set(scale, scale, scale);
      
      // Set up animations
      const mixer = new THREE.AnimationMixer(robot);
      const animations = gltf.animations;
      console.log('Available animations:', animations.length);
      
      if (animations && animations.length > 0) {
        // Play all animations
        animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.play();
        });
        
        // Store the mixer on the robot for updates
        robot.mixer = mixer;
      }
      
      resolve(robot);
    }, 
    // Progress callback
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Error callback
    (error) => {
      console.error('Error loading robot:', error);
      resolve(null); // Resolve with null in case of error
    });
  });

  return { groupCubes, robotPromise };
} 