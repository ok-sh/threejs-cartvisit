import * as THREE from 'three';
import gsap from 'gsap';

export function onInteractionStart(event, groupCubes) {
  if (event.type === 'touchstart') {
    event.preventDefault();
  }

  const isLeftClick = (event.type === 'mousedown' && event.which === 1) || event.type === 'touchstart';

  groupCubes.children.forEach((cube) => {
    const scaleFactor = isLeftClick ? 1.1 : 0.9;
    
    gsap.to(cube.scale, {
      x: cube.scale.x * scaleFactor,
      y: cube.scale.y * scaleFactor,
      z: cube.scale.z * scaleFactor,
      duration: 0.5,
    });

    if (cube.material && cube.material.color) {
      const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
      const pastelColor = randomColor.lerp(new THREE.Color(1, 1, 1), 0.3);

      gsap.to(cube.material.color, {
        r: pastelColor.r,
        g: pastelColor.g,
        b: pastelColor.b,
        duration: 0.5,
      });
    }
  });
}

export function onResize(camera, renderer) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
} 