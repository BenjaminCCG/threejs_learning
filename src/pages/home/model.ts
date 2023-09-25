import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const model = new THREE.Group();

const loader = new GLTFLoader();
loader.load('/model3/上海外滩.glb', (gltf) => {
  model.add(gltf.scene);
});

export { model };
