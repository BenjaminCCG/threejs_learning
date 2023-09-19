import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const model = new THREE.Group();
loader.load('/model2/轿车.glb', (glft) => {
  const texture = new THREE.TextureLoader().load('/model2/Tyre_Normal.png');
  const envTexture = new THREE.CubeTextureLoader()
    .setPath('/model2/envMap/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

  glft.scene.traverse((obj: any) => {
    if (obj.isMesh) {
      obj.material.envMap = envTexture;
      if (obj.name.includes('轮胎')) {
        console.log(obj.material, 'obj.material');

        obj.material.normalMap = texture;
      }
      if (obj.name.includes('高光金属')) {
        // obj.material.metalness = 1
        // obj.material.roughness = 0.4
        obj.material = new THREE.MeshStandardMaterial({
          color: obj.material.color,
          metalness: 1,
          roughness: 0.2
        });
      }
    }
  });

  model.add(glft.scene);
});

export { model };
