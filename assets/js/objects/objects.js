import * as THREE from 'three';

export function createObjects() {
  const groupCubes = new THREE.Group();
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshMatcapMaterial({ color: 0x4e8397 });
  const radius = 700;
  const totalCubes = 500;
  const randomCubeCount = 150;

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
    const object = new THREE.Mesh(geometry, material);
    const randomRadius = Math.random() * radius;
    const randomTheta = Math.acos(2 * Math.random() - 1);
    const randomPhi = Math.random() * 2 * Math.PI;

    object.position.x = randomRadius * Math.sin(randomTheta) * Math.cos(randomPhi);
    object.position.y = randomRadius * Math.sin(randomTheta) * Math.sin(randomPhi);
    object.position.z = randomRadius * Math.cos(randomTheta);

    groupCubes.add(object);
  }

  return groupCubes;
} 