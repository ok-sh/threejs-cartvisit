import * as THREE from "/three/three.module.js";

//Arrow Helper
const dir = new THREE.Vector3(1, 2, 0);

//normalize the direction vector (convert to vector of length 1)
dir.normalize();

const origin = new THREE.Vector3(0, 0, 0);
const length = 1;
const hex = 0xff00ff;

export const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);

//Arrow Helper

const color1 = new THREE.Color("blue");

const color2 = new THREE.Color(0xff0000);

//RGB string
const color3 = new THREE.Color("rgb(0, 255, 50)");

export const axesHelper = new THREE.AxesHelper(5).setColors(color1, color2, color3);

//Box Helper
const sphere = new THREE.SphereGeometry();
const object = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial(0xff0000));
export const boxHelper = new THREE.BoxHelper(object, 0xffff00);
