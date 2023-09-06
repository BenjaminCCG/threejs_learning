<!--
 * @Author: ChangCheng
 * @Date: 2023-09-06 19:55:03
 * @LastEditTime: 2023-09-06 19:55:08
 * @LastEditors: ChangCheng
 * @Description: 
 * @FilePath: \threejs\src\pages\home\index copy.vue
-->
<template>
  <div class="flex absolute right-0 text-white">
    <div id="play" class="mr-1 cursor-pointer">播放</div>
    <div id="stop" class="mr-1 cursor-pointer">停止</div>
    <div id="bu" class="mr-1 cursor-pointer">暂停</div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
// 从threejs扩展库引入gui.js

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const initRender = () => {
  // let arr = [] as THREE.Object3D[];
  // 实例化一个透视投影相机对象
  const width = window.innerWidth; // 宽度
  const height = window.innerHeight; // 高度
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();

  const ambient = new THREE.AmbientLight();
  scene.add(ambient);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 2000);
  camera.position.set(100, 100, 100);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);

  const loader = new GLTFLoader();
  loader.load('/Soldier.glb', (gltf) => {
    console.log(gltf.animations, 'xxx');

    const mixer = new THREE.AnimationMixer(gltf.scene);
    const clipAction = mixer.clipAction(gltf.animations[0]);

    // 不循环播放
    clipAction.loop = THREE.LoopOnce;
    // 物体状态停留在动画结束的时候
    clipAction.clampWhenFinished = true;

    clipAction.play();
    gltf.scene.rotateY(-Math.PI / 2);

    scene.add(gltf.scene);

    const clock = new THREE.Clock();
    function loop() {
      requestAnimationFrame(loop);
      // clock.getDelta()方法获得loop()两次执行时间间隔

      if (mixer !== null) {
        mixer.update(clock.getDelta());
      }
      // const frameT = clock.getDelta();
      // 更新播放器相关的时间
    }
    loop();

    renderer.render(scene, camera);
  });

  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3
  });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.name = 'Box';

  const times = [0, 3, 6];

  const values = [0, 0, 0, 100, 0, 0, 0, 0, 100];

  const posKF = new THREE.KeyframeTrack('Box.position', times, values);

  const colorKF = new THREE.KeyframeTrack('Box.material.color', [2, 5], [1, 0, 0, 0, 0, 1]);

  const clip = new THREE.AnimationClip('test', 6, [posKF, colorKF]);

  const mixer = new THREE.AnimationMixer(mesh);

  const clipAction = mixer.clipAction(clip);

  // clipAction.time = 3;
  // clipAction.paused = true;

  // clip.duration = 5;
  const gui = new GUI();
  gui.domElement.style.top = '30px';
  gui.add(clipAction, 'timeScale', 0, 6).name('播放速度');
  gui.add(clipAction, 'time', 0, 6).step(0.1).name('进度条');

  clipAction.play();
  clipAction.loop = THREE.LoopOnce;
  clipAction.clampWhenFinished = true;

  document.getElementById('stop')!.addEventListener('click', () => {
    clipAction.stop(); // 动画停止结束，回到开始状态
  });
  document.getElementById('play')!.addEventListener('click', () => {
    clipAction.play(); // 播放动画
  });

  const bu = document.getElementById('bu')!;
  bu.addEventListener('click', () => {
    // AnimationAction.paused默认值false，设置为true，可以临时暂停动画
    if (clipAction.paused) {
      // 暂停状态
      clipAction.paused = false; // 切换为播放状态
      bu.innerHTML = '暂停'; // 如果改变为播放状态，按钮文字设置为“暂停”
    } else {
      // 播放状态
      clipAction.paused = true; // 切换为暂停状态
      bu.innerHTML = '继续'; // 如果改变为暂停状态，按钮文字设置为“继续”
    }
  });
  mixer.addEventListener('finished', () => {
    bu.innerHTML = '播放'; // 播放完成，按钮显示为“播放”
    clipAction.reset(); // 重新开始新的动画播放
    clipAction.paused = true; // 切换为暂停状态
  });
  const clock = new THREE.Clock();
  function loop() {
    requestAnimationFrame(loop);
    const frameT = clock.getDelta();
    // 更新播放器相关的时间
    mixer.update(frameT);
  }
  loop();

  scene.add(mesh);

  // eslint-disable-next-line no-new
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  const stats = new Stats();

  function render() {
    // const spt = clock.getDelta() * 1000; // 毫秒
    // console.log('两帧渲染时间间隔(毫秒)', spt);
    // console.log('帧率FPS', 1000 / spt);
    // renderer.render(scene, camera); // 执行渲染操作
    stats.update();
    renderer.render(scene, camera);
    // composer.render();
    // mesh.rotateY(0.01); // 每次绕y轴旋转0.01弧度
    requestAnimationFrame(render); // 请求再次执行渲染函数render，渲染下一帧
  }

  render();
  // 创建stats对象
  // stats.domElement:web页面上输出计算结果,一个div元素，
  document.body.appendChild(stats.dom);
  document.body.appendChild(renderer.domElement);

  // document.body.appendChild(renderer.domElement);

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
