<template>
  <div></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Stats from 'three/addons/libs/stats.module.js';
// 引入gltf模型加载库GLTFLoader.js
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const initRender = () => {
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();
  // const loader = new GLTFLoader();
  // 环境光设置
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

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

  const geometry = new THREE.BufferGeometry(); // 创建一个几何体对象
  const vertices = new Float32Array([
    0,
    0,
    0, // 顶点1坐标
    50,
    0,
    0, // 顶点2坐标
    0,
    25,
    0 // 顶点3坐标
  ]);
  // 顶点位置
  geometry.attributes.position = new THREE.BufferAttribute(vertices, 3);
  const colors = new Float32Array([
    1,
    0,
    0, // 顶点1颜色
    0,
    0,
    1, // 顶点2颜色
    0,
    1,
    0 // 顶点3颜色
  ]);
  // 设置几何体attributes属性的颜色color属性
  // 3个为一组,表示一个顶点的颜色数据RGB
  geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

  // 点渲染模式
  // const material = new THREE.PointsMaterial({
  //   // color: 0x333333,//使用顶点颜色数据，color属性可以不用设置
  //   vertexColors: true, // 默认false，设置为true表示使用顶点颜色渲染
  //   size: 20.0 // 点对象像素尺寸
  // });
  // const points = new THREE.Points(geometry, material); // 点模型对象

  // const material = new THREE.LineBasicMaterial({
  //   vertexColors: true // 使用顶点颜色渲染
  // });
  // const line = new THREE.Line(geometry, material);

  const material = new THREE.MeshBasicMaterial({
    // color: 0x333333,//使用顶点颜色数据，color属性可以不用设置
    vertexColors: true, // 默认false，设置为true表示使用顶点颜色渲染
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // scene.add(points);

  // 实例化一个透视投影相机对象
  const width = window.innerWidth; // 宽度
  const height = window.innerHeight; // 高度
  // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
  // const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
  // camera.position.set(-1.8, 0.6, 2.7);
  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 6000);
  camera.position.set(200, 200, 200);
  // camera.position.set(2000, 2000, 2000);
  // camera.lookAt(0, 0, 0);
  // camera.lookAt(10000, 10000, 1000);
  // camera.lookAt(mesh.position);
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x444444, 1); // 设置背景颜色
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // renderer.render(scene, camera);
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);
  // scene.add(mesh);

  // 当设置渲染循环可以不添加相机空间的change事件去重复render

  // eslint-disable-next-line no-new
  const controls = new OrbitControls(camera, renderer.domElement);

  // controls.target.set(2.17, -0.03, -0.13);
  // update()函数内会执行camera.lookAt(controls.targe)
  controls.update();
  // controls.addEventListener('change', () => {
  //   console.log('camera.position', camera.position);
  //   console.log('controls.target', controls.target);
  //   // renderer.render(scene, camera);
  // });

  // const clock = new THREE.Clock();
  function render() {
    // const spt = clock.getDelta() * 1000; // 毫秒
    // console.log('两帧渲染时间间隔(毫秒)', spt);
    // console.log('帧率FPS', 1000 / spt);

    renderer.render(scene, camera); // 执行渲染操作
    // mesh.rotateY(0.01); // 每次绕y轴旋转0.01弧度
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
