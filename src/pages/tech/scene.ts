import * as THREE from 'three';
import { model } from './model';

const scene = new THREE.Scene();
scene.add(model);

const amibient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(amibient);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
dirLight1.position.set(400, 400, 400);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
dirLight2.position.set(-400, -400, -400);
scene.add(dirLight2);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

export { scene };
