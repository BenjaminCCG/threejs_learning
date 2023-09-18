<template>
  <div class="absolute right-0 top-0 z-10 text-light-50 flex gap-2">
    <div id="btn" class="cursor-pointer">{{ bool ? '暂停' : '开始' }}</div>
  </div>
  <div class="absolute right-1/2 bottom-10 flex justify-center">
    <img v-for="(item, index) in imgs" :key="index" :src="item" @click="() => imgClick(index)" />
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
// import { scene } from './scene';
// import { camera, renderer } from './render';
import { renderer, labelRenderer, bool } from './loop';
import { model } from './model';
import black from '@/assets/幻夜黑.png';
import blue from '@/assets/极光蓝.png';
import purple from '@/assets/极光紫.png';
import red from '@/assets/珊瑚红.png';

const imgs = [black, blue, purple, red];
const texLoader = new THREE.TextureLoader();
const textures = [
  texLoader.load('/model/幻夜黑.png'),
  texLoader.load('/model/极光蓝.png'),
  texLoader.load('/model/极光紫.png'),
  texLoader.load('/model/珊瑚红.png')
];
textures.forEach((item) => {
  item.flipY = false;
});
const active = ref(0);
const imgClick = (index: number = active.value) => {
  // model.
  const mesh = model.getObjectByName('phone') as any;
  mesh.material.map = textures[index];
};
setInterval(() => {
  active.value++;
  if (active.value === 4) {
    active.value = 0;
  }
  imgClick();
}, 2000);
const initRender = () => {
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(labelRenderer.domElement);
  document.getElementById('btn')?.addEventListener('click', () => {
    bool.value = !bool.value;
  });

  // 创建渲染器对象
  // const renderer = new THREE.WebGLRenderer({
  //   antialias: true
  // });
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setPixelRatio(window.devicePixelRatio);
  // renderer.setClearColor(0x000000, 1);
  // document.body.appendChild(renderer.domElement);
  // 创建场景对象

  // const scene = new THREE.Scene();

  // const ambient = new THREE.AmbientLight(0xffffff, 1);
  // scene.add(ambient);

  // const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
  // directionalLight1.position.set(400, 200, 300);
  // scene.add(directionalLight1);
  // const help1 = new THREE.DirectionalLightHelper(directionalLight1, 5);
  // scene.add(help1);

  // const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
  // directionalLight2.position.set(-400, -200, -300);
  // scene.add(directionalLight2);

  // const help2 = new THREE.DirectionalLightHelper(directionalLight2, 5);
  // scene.add(help2);
  // const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

  // camera.position.set(0, 0, 350);
  // camera.lookAt(0, 0, 0);

  // const axesHelper = new THREE.AxesHelper(100);
  // scene.add(axesHelper);

  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.addEventListener('change', () => {
  //   console.log(camera.position);
  // });
  // controls.update();

  // const loader = new GLTFLoader();
  // const group = new THREE.Group();
  // loader.load('/model/手机.glb', (gltf) => {
  //   const texLoader = new THREE.TextureLoader();
  //   // gf = gltf.scene;
  //   group.add(gltf.scene);
  //   // gltf.scene.traverse((obj: any) => {
  //   //   if (obj.isMesh) {
  //   //     obj.material = new THREE.MeshPhysicalMaterial({
  //   //       color: obj.material.color,
  //   //       map: obj.material.map
  //   //     });
  //   //   }
  //   // });
  //   const textureCube = new THREE.CubeTextureLoader()
  //     .setPath('/model/envMap/')
  //     .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
  //   const mesh: any = gltf.scene.getObjectByName('手机');
  //   console.log('🚀 ~ file: index.vue:56 ~ loader.load ~ mesh:', mesh);
  //   (mesh as THREE.Mesh).geometry.translate(0, 0, 5);
  //   // mesh.material.map = texture;
  //   mesh.material = new THREE.MeshPhysicalMaterial({
  //     metalness: 1,
  //     roughness: 1,
  //     map: texLoader.load('/model/basecolor.png'),
  //     normalMap: texLoader.load('/model/normal.png'),
  //     roughnessMap: texLoader.load('/model/roughness.png'),
  //     metalnessMap: texLoader.load('/model/metallic.png'),
  //     alphaMap: texLoader.load('/model/opacity.png'),
  //     transparent: true,
  //     envMap: textureCube,
  //     envMapIntensity: 0.9
  //   });

  //   mesh.material.map.flipY = false;
  //   mesh.material.normalMap.flipY = false;
  //   mesh.material.metalnessMap.flipY = false;
  //   mesh.material.roughnessMap.flipY = false;
  //   mesh.material.alphaMap.flipY = false;

  //   // console.log(gltf.scene, 'gltf.scene');
  //   // gltf = gltf.scene;
  //   // gltf.scene.rotateY(Math.PI);
  //   // function rotate() {
  //   //   gltf.scene.rotateY(-0.01);
  //   //   requestAnimationFrame(rotate);
  //   // }
  //   // rotate();
  //   // scene.add(gltf.scene);
  //   scene.add(group);
  // });

  // const arc = new THREE.ArcCurve(0, 0, 80, 0, (Math.PI * 3) / 2);

  // const pointsArr = arc.getPoints(50);

  // const geometry = new THREE.BufferGeometry();

  // geometry.setFromPoints(pointsArr);

  // const material = new THREE.LineBasicMaterial({
  //   color: 0x00fffff
  // });

  // // geometry.rotateX(Math.PI / 2);
  // // geometry.rotateY(Math.PI / (3 / 4));
  // // geometry.translate(0, -100, 0);
  // const mesh = new THREE.Line(geometry, material);
  // // const axesHelper2 = new THREE.AxesHelper(20);
  // // mesh.add(axesHelper2);
  // // mesh.translateY(-100);
  // // mesh.rotateX(Math.PI / 2);
  // mesh.rotateZ(Math.PI * 0.7);
  // // mesh.position.z += 100;
  // const div = document.createElement('div');
  // div.innerHTML = '720';
  // div.style.color = '#fff';
  // const tag = new CSS3DObject(div);
  // // tag.position.copy(pos);
  // const axesHelper3 = new THREE.AxesHelper(20);
  // tag.add(axesHelper3);
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
  // const labelRenderer = new CSS3DRenderer();
  // labelRenderer.setSize(window.innerWidth, window.innerHeight);
  // labelRenderer.domElement.style.position = 'absolute';
  // labelRenderer.domElement.style.top = '0';
  // labelRenderer.domElement.style.left = '0';
  // labelRenderer.domElement.style.pointerEvents = 'none';

  // document.body.appendChild(labelRenderer.domElement);

  // function render() {
  //   group.rotateY(-0.01);
  //   group2.rotateZ(0.01);
  //   // mesh.rotateZ(0.01);
  //   // tag.rotateY(0.01);
  //   labelRenderer.render(scene, camera);
  //   renderer.render(scene, camera); // 执行渲染操作
  //   requestAnimationFrame(render); // 请求再次执行渲染函数render，渲染下一帧
  // }
  // render();
  // window.onresize = function () {
  //   // 重置渲染器输出画布canvas尺寸
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
  //   camera.aspect = window.innerWidth / window.innerHeight;
  //   // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
  //   // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
  //   // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
  //   camera.updateProjectionMatrix();
  // };
};
onMounted(() => {
  initRender();
});
</script>
