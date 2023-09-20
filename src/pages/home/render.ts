import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 30000);
camera.position.set(-621, 357, 357);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xcccccc, 1);
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1.0;
renderer.outputEncoding = THREE.sRGBEncoding;
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = (Math.PI / 2) * 0.9;
controls.minDistance = 500;
controls.maxDistance = 1200;
controls.update();

export { renderer, camera };
