import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
// import { scene } from './scene';
import { bool } from './loop';
import { camera, controls } from './render';
import spot from '@/assets/光点.png';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import TWEEN from '@tweenjs/tween.js';
const loader = new GLTFLoader();
const model = new THREE.Group();
const texture = new THREE.TextureLoader().load(spot);
const spriteMaterial = new THREE.SpriteMaterial({
  map: texture
  // transparent: true
});
const sprite = new THREE.Sprite(spriteMaterial);
sprite.scale.set(6, 6, 1);
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
  const frontObject3D = gltf.scene.getObjectByName('后置摄像头位置');
  const pos = new THREE.Vector3();
  frontObject3D?.getWorldPosition(pos);

  sprite.position.copy(pos);
  model.add(sprite);
  const textureCube = new THREE.CubeTextureLoader()
    .setPath('/model/envMap/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
  const mesh: any = gltf.scene.getObjectByName('手机');
  (mesh as THREE.Mesh).geometry.translate(0, 0, 5);
  mesh.renderOrder = 0;
  sprite.renderOrder = 1;
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

  const div = document.getElementById('card')!;
  const close = document.getElementById('close')!;
  close.style.pointerEvents = 'auto';
  // div.style.pointerEvents = 'none';

  const tag = new CSS2DObject(div);
  tag.position.copy(sprite.position);
  // tag.position.set(-1, 0, 0);
  model.add(tag);
  addEventListener('click', (event) => {
    const px = event.clientX;
    const py = event.clientY;
    const x = (px / window.innerWidth) * 2 - 1;
    const y = -(py / window.innerHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersects = raycaster.intersectObjects([sprite]);

    if (intersects.length > 0) {
      div.style.visibility = 'visible';
      bool.value = false;
      controls.enabled = false;
      controls.update();
    }
  });

  document.getElementById('close')?.addEventListener('click', () => {
    div.style.visibility = 'hidden';
    bool.value = true;
    controls.enabled = true;
    controls.update();
  });
  // // 设置标注精灵Sprite波动，提示用户点击
  // let s = 0.0;
  // function waveAnimation() {
  //   // 设置产品模型旋转动画
  //   s += 0.01;
  //   if (s < 0.5) {
  //     sprite.scale.x = 6 * (1 + s);
  //     sprite.scale.y = 6 * (1 + s);
  //   } else if (s >= 0.5 && s < 1.0) {
  //     sprite.scale.x = 6 * (2 - s);
  //     sprite.scale.y = 6 * (2 - s);
  //   } else {
  //     s = 0.0;
  //   }

  //   requestAnimationFrame(waveAnimation); // 请求再次执行函数waveAnimation
  // }
  // waveAnimation();

  new TWEEN.Tween(sprite.scale)
    .to({ x: 8, y: 8 }, 1000) // 缩放到2倍大小，动画时长为1秒
    .easing(TWEEN.Easing.Quadratic.Out) // 使用二次方缓动函数实现平滑过渡
    .yoyo(true) // 动画结束后反向播放动画
    .repeat(Infinity) // 无限循环播放动画
    .start(); // 启动动画
  function waveAnimation() {
    TWEEN.update();
    requestAnimationFrame(waveAnimation);
  }
  waveAnimation();
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
