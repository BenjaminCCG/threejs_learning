import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const model = new THREE.Group();
loader.load('/model2/轿车.glb', (glft) => {
  const tire = glft.scene.getObjectByName('轮胎01') as any;
  console.log(tire, 'tire');

  const texture = new THREE.TextureLoader().load('/model2/Tyre_Normal.png');
  tire.material.normalMap = texture;
  model.add(glft.scene);
});

export { model };
