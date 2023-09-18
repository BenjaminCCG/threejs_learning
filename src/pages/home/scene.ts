import * as THREE from 'three';
import { model } from './model';
import { circleLine } from './circleLine';

model.add(circleLine);
const scene = new THREE.Scene();
scene.add(model);

const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight1.position.set(400, 200, 300);
scene.add(directionalLight1);
// const help1 = new THREE.DirectionalLightHelper(directionalLight1, 5);
// scene.add(help1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight2.position.set(-400, -200, -300);
scene.add(directionalLight2);

// const help2 = new THREE.DirectionalLightHelper(directionalLight2, 5);
// scene.add(help2);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

export { scene };
