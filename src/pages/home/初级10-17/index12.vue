<template>
  <div></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
// 从threejs扩展库引入gui.js

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import Stats from 'three/addons/libs/stats.module.js';
// 引入dat.gui.js的一个类GUI

const initRender = () => {
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();
  const texture = new THREE.TextureLoader().load(
    'https://cc-blog-admin.oss-cn-beijing.aliyuncs.com/image/2023-08-31/5f4a4a90-92f1-4546-a4ac-e886c2a26722.png'
  );
  // 实例化一个透视投影相机对象
  const width = window.innerWidth; // 宽度
  const height = window.innerHeight; // 高度
  // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 3000);
  // camera.position.set(-1.8, 0.6, 2.7);
  camera.position.set(100, 100, 100);
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x444444, 1); // 设置背景颜色
  // renderer.render(scene, camera);
  // 设置渲染器，允许光源阴影渲染
  renderer.shadowMap.enabled = true;

  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);

  const geometry = new THREE.BoxGeometry(25, 25, 25);
  geometry.translate(0, 12.5, 0);
  // mesh顶部中心添加标注，顶部中心坐标是(0,100,0)

  // 创建精灵材质对象SpriteMaterial
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture // 设置精灵纹理贴图
  });

  const material = new THREE.MeshPhongMaterial();

  // 创建精灵模型对象，不需要几何体geometry参数
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(10, 10, 1);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  scene.add(sprite);

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
