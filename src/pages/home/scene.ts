import * as THREE from 'three';
import { model } from './model';

const scene = new THREE.Scene();
scene.add(model);

const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

const axesHelper = new THREE.AxesHelper(250);
scene.add(axesHelper);
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight1.position.set(400, 200, 300);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight2.position.set(-400, -200, -300);
scene.add(directionalLight2);

export { scene };
