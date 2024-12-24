import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

const scene = new THREE.Scene();
const container = document.querySelector('.model-container');

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight);
camera.position.set(0, 0, -10);
camera.lookAt(0, 0, 0);

const direction = new THREE.Vector3();
camera.getWorldDirection(direction);

scene.add(camera);
// const camHelper = new THREE.CameraHelper(camera);
// scene.add(camHelper);

/**
 * Objects
 */
let groupCubes = new THREE.Group();
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshMatcapMaterial({ color: 0x4e8397 });
const radius = 80;
const totalCubes = 180;
const randomCubeCount = 20;

// Add cubes on the sphere's surface
for (let i = 0; i < totalCubes; i++) {
  const cube = new THREE.Mesh(geometry, material);

  // Calculate theta and phi for even distribution
  const theta = Math.acos(1 - (2 * (i + 0.5)) / totalCubes); // Polar angle
  const phi = Math.PI * (1 + Math.sqrt(5)) * i; // Azimuthal angle (golden ratio method)

  // Convert spherical to Cartesian coordinates
  cube.position.x = radius * Math.sin(theta) * Math.cos(phi);
  cube.position.y = radius * Math.sin(theta) * Math.sin(phi);
  cube.position.z = radius * Math.cos(theta);

  // Optionally, orient the cubes to face outward from the center
  cube.lookAt(0, 0, 0);

  groupCubes.add(cube);
}

// Add random cubes inside the sphere
for (let i = 0; i < randomCubeCount; i++) {
  const cube = new THREE.Mesh(geometry, material);

  // Generate random spherical coordinates
  const randomRadius = Math.random() * radius; // Random distance from center
  const randomTheta = Math.acos(2 * Math.random() - 1); // Random polar angle
  const randomPhi = Math.random() * 2 * Math.PI; // Random azimuthal angle

  // Convert spherical to Cartesian coordinates
  cube.position.x = randomRadius * Math.sin(randomTheta) * Math.cos(randomPhi);
  cube.position.y = randomRadius * Math.sin(randomTheta) * Math.sin(randomPhi);
  cube.position.z = randomRadius * Math.cos(randomTheta);

  groupCubes.add(cube);
}

scene.add(groupCubes);
gsap.from(groupCubes.rotation, { duration: 100, y: Math.PI * 2, repeat: -1 });

// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

/**
 *Lights
 */
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(100, 500, 0);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(spotLight);
scene.add(ambientLight);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

container.appendChild(renderer.domElement);

/**
 * Mouse Controls
 */
//set controls to change camera position with mouse
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

/**
 * LOOP
 */

loop();
function loop() {
  requestAnimationFrame(loop);
  controls.update();

  renderer.render(scene, camera);
}

window.addEventListener('mousedown', onClick);

function onClick(event) {
  //if is an object change its color
  groupCubes.children.forEach((cube, i) => {
    if (event.which === 1) {
      gsap.to(cube.scale, {
        x: cube.scale.x * 1.1,
        y: cube.scale.y * 1.1,
        z: cube.scale.z * 1.1,
        duration: 0.5, // Animation duration
      });
    } else {
      gsap.to(cube.scale, {
        x: cube.scale.x * 0.9,
        y: cube.scale.y * 0.9,
        z: cube.scale.z * 0.9,
        duration: 0.5, // Animation duration
      });
    }

    if (cube.material && cube.material.color) {
      const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
      const pastelColor = randomColor.lerp(new THREE.Color(1, 1, 1), 0.3);

      // Animate the cube's color to the pastel color
      gsap.to(cube.material.color, {
        r: pastelColor.r,
        g: pastelColor.g,
        b: pastelColor.b,
        duration: 0.5, // Animation duration
      });
    }
  });
}

window.addEventListener('resize', onResize);

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
