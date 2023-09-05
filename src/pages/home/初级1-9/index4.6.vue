<template>
  <div></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
// 引入dat.gui.js的一个类GUI

// const initGui = () => {
//   const gui = new GUI();
//   // 改变交互界面style属性
//   gui.domElement.style.right = '0px';
//   gui.domElement.style.width = '300px';

//   const obj = {
//     x: 30,
//     y: 60,
//     z: 300
//   };
//   // gui界面上增加交互界面，改变obj对应属性
//   gui.add(obj, 'x', 0, 100);
//   gui.add(obj, 'y', 0, 50);
//   gui.add(obj, 'z', 0, 60);
// };

const initRender = () => {
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();

  // 环境光设置
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  // gui.addColor(obj, 'color').onChange((value: string) => {
  //   mesh.material.color.set(value);
  // });

  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(100, 100, 100);
  // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
  // directionalLight.target = mesh;
  scene.add(directionalLight);

  // 平行光辅助对象
  const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000);
  scene.add(dirLightHelper);

  // 创建两个网格模型mesh1、mesh2
  const geometry = new THREE.BoxGeometry(50, 50, 50);
  geometry.translate(50 / 2, 0, 0);
  const material = new THREE.MeshLambertMaterial({ color: 0x00ffff });
  const mesh = new THREE.Mesh(geometry, material);

  // 实例化一个透视投影相机对象
  const width = window.innerWidth; // 宽度
  const height = window.innerHeight; // 高度
  // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面

  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 6000);
  camera.position.set(200, 200, 200);
  // camera.position.set(800, 800, 800);
  // camera.position.set(2000, 2000, 2000);
  // camera.lookAt(0, 0, 0);
  // camera.lookAt(1000, 0, 1000);
  camera.lookAt(mesh.position);
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x444444, 1); // 设置背景颜色
  // renderer.render(scene, camera);
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);
  scene.add(mesh);
  mesh.visible = false;
  // scene.visible = false;
  console.log('🚀 ~ file: index.vue:81 ~ initRender ~ mesh:', mesh);

  // console.log('🚀 ~ file: index.vue:80 ~ initRender ~ scene:', scene);
  // scene.remove(mesh);
  // console.log('🚀 ~ file: index.vue:82 ~ initRender ~ scene:', scene);

  // 当设置渲染循环可以不添加相机空间的change事件去重复render

  // eslint-disable-next-line no-new
  new OrbitControls(camera, renderer.domElement);

  // controls.target.set(1000, 0, 1000);
  //  // update()函数内会执行camera.lookAt(controls.targe)
  // controls.update();
  // controls.addEventListener('change', () => {
  //   console.log('camera.position', camera.position);

  //   renderer.render(scene, camera);
  // });

  // const clock = new THREE.Clock();
  function render() {
    // const spt = clock.getDelta() * 1000; // 毫秒
    // console.log('两帧渲染时间间隔(毫秒)', spt);
    // console.log('帧率FPS', 1000 / spt);
    renderer.render(scene, camera); // 执行渲染操作
    mesh.rotateY(0.01); // 每次绕y轴旋转0.01弧度
    requestAnimationFrame(render); // 请求再次执行渲染函数render，渲染下一帧
  }
  render();
  // 创建stats对象
  const stats = new Stats();
  // stats.domElement:web页面上输出计算结果,一个div元素，
  document.body.appendChild(stats.dom);

  document.body.appendChild(renderer.domElement);

  // onresize 事件会在窗口被调整大小时发生
  window.onresize = function () {
    // 重置渲染器输出画布canvas尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
  };
};
onMounted(() => {
  initRender();
  // initGui();
});
</script>
