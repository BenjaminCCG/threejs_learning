import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
// import { scene } from './scene';

const loader = new GLTFLoader();
const model = new THREE.Group();
loader.load('/model/手机.glb', (gltf) => {
  const texLoader = new THREE.TextureLoader();
  // gf = gltf.scene;
  model.add(gltf.scene);
  // gltf.scene.traverse((obj: any) => {
  //   if (obj.isMesh) {
  //     obj.material = new THREE.MeshPhysicalMaterial({
  //       color: obj.material.color,
  //       map: obj.material.map
  //     });
  //   }
  // });
  const textureCube = new THREE.CubeTextureLoader()
    .setPath('/model/envMap/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
  const mesh: any = gltf.scene.getObjectByName('手机');
  (mesh as THREE.Mesh).geometry.translate(0, 0, 5);
  // mesh.material.map = texture;
  mesh.name = 'phone';
  mesh.material = new THREE.MeshPhysicalMaterial({
    metalness: 1,
    roughness: 1,
    map: texLoader.load('/model/basecolor.png'),
    normalMap: texLoader.load('/model/normal.png'),
    roughnessMap: texLoader.load('/model/roughness.png'),
    metalnessMap: texLoader.load('/model/metallic.png'),
    alphaMap: texLoader.load('/model/opacity.png'),
    transparent: true,
    envMap: textureCube,
    envMapIntensity: 0.9
  });

  mesh.material.map.flipY = false;
  mesh.material.normalMap.flipY = false;
  mesh.material.metalnessMap.flipY = false;
  mesh.material.roughnessMap.flipY = false;
  mesh.material.alphaMap.flipY = false;

  // console.log(gltf.scene, 'gltf.scene');
  // gltf = gltf.scene;
  // gltf.scene.rotateY(Math.PI);
  // function rotate() {
  //   gltf.scene.rotateY(-0.01);
  //   requestAnimationFrame(rotate);
  // }
  // rotate();
  // scene.add(gltf.scene);
});

// const arc = new THREE.ArcCurve(0, 0, 60, Math.PI / 2 + Math.PI / 6, Math.PI / 2 - Math.PI / 6);

// const pointsArr = arc.getPoints(50);

// const geometry = new THREE.BufferGeometry();

// geometry.setFromPoints(pointsArr);

// const material = new THREE.LineBasicMaterial({
//   color: 0xffffff
// });

// // geometry.rotateX(Math.PI / 2);
// // geometry.rotateY(Math.PI / (3 / 4));
// // geometry.translate(0, -100, 0);
// const mesh = new THREE.Line(geometry, material);
// // const axesHelper2 = new THREE.AxesHelper(20);
// // mesh.add(axesHelper2);
// // mesh.translateY(-100);
// // mesh.rotateX(Math.PI / 2);
// // mesh.rotateZ(Math.PI * 0.7);
// // mesh.position.z += 100;
// const div = document.createElement('div');
// div.innerHTML = '720';
// div.style.color = '#fff';
// const tag = new CSS3DObject(div);
// // tag.position.copy(pos);
// // const axesHelper3 = new THREE.AxesHelper(20);
// // tag.add(axesHelper3);
// tag.position.y += 80;
// // tag.rotateZ(Math.PI / 2);
// // tag.position.z += 80;
// // mesh.add(tag);
// // scene.add(mesh);
// tag.rotateX((Math.PI * 3) / 2);
// const group2 = new THREE.Group();
// group2.add(mesh, tag);
// group2.rotateX(Math.PI / 2);
// group2.position.y -= 100;
// scene.add(group2);

// document.body.appendChild(labelRenderer.domElement);

export { model };
console.log('🚀 ~ file: model.ts:101 ~ model:', model);
