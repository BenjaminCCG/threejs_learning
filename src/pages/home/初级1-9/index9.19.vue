<template>
  <div></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import Stats from 'three/addons/libs/stats.module.js';
const initRender = () => {
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
  camera.position.set(-1.8, 0.6, 2.7);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  // 添加一个辅助网格地面
  // mesh.rotateX(-Math.PI / 2);
  // const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
  // gridHelper.rotateX(-Math.PI / 2);
  // // mesh.rotateX(-Math.PI / 2);
  // scene.add(gridHelper);

  new RGBELoader().load('royal_esplanade_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = texture;
    scene.environment = texture;

    renderer.render(scene, camera);

    // model

    const loader = new GLTFLoader();
    loader.load('/DamagedHelmet.gltf', (gltf) => {
      scene.add(gltf.scene);
      const mesh = gltf.scene.children[0] as any;
      // 顶点数据
      const att = mesh.geometry.attributes;
      console.log('att', att);
      // 顶点位置数据
      const pos = mesh.geometry.attributes.position;
      console.log('pos', pos);
      console.log('index', mesh.geometry.index);
      const count = pos.count; // 几何体顶点数量
      console.log('count', count);
      renderer.render(scene, camera);
    });
  });
  // loader.load('./demo.glb', (gltf) => {
  //   console.log('控制台查看加载gltf文件返回的对象结构', gltf);
  //   console.log('gltf对象场景属性', gltf.scene);
  //   // 返回的场景对象gltf.scene插入到threejs场景中
  //   gltf.scene
  //   scene.add(gltf.scene);
  // });
  // 实例化一个透视投影相机对象
  // const width = window.innerWidth; // 宽度
  // const height = window.innerHeight; // 高度
  // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面

  // camera.position.set(800, 800, 800);
  // camera.position.set(2000, 2000, 2000);
  // camera.lookAt(0, 0, 0);
  // camera.lookAt(1000, 0, 1000);
  // camera.lookAt(mesh.position);

  document.body.appendChild(renderer.domElement);

  // 当设置渲染循环可以不添加相机空间的change事件去重复render

  // eslint-disable-next-line no-new
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0, -0.2);
  controls.update();
  // controls.target.set(1000, 0, 1000);
  //  // update()函数内会执行camera.lookAt(controls.targe)
  // controls.update();
  controls.addEventListener('change', () => {
    renderer.render(scene, camera);
  });

  // renderer.render(scene, camera);
  // 创建stats对象
  const stats = new Stats();
  // stats.domElement:web页面上输出计算结果,一个div元素，
  document.body.appendChild(stats.dom);

  // onresize 事件会在窗口被调整大小时发生
  window.onresize = function () {
    // 重置渲染器输出画布canvas尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.render(scene, camera);
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
