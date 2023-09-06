<!--
 * @Author: ChangCheng
 * @Date: 2023-09-06 20:56:50
 * @LastEditTime: 2023-09-06 20:56:55
 * @LastEditors: ChangCheng
 * @Description: 
 * @FilePath: \threejs\src\pages\home\index copy.vue
-->
<template>
  <div class="flex absolute right-0 text-white">
    <div id="play" class="mr-1 cursor-pointer">播放</div>
    <div id="stop" class="mr-1 cursor-pointer">停止</div>
    <div id="bu" class="mr-1 cursor-pointer">暂停</div>
    <div id="Idle" class="bu">休息</div>
    <div id="Run" class="bu" style="margin-left: 10px">跑步</div>
    <div id="Walk" class="bu" style="margin-left: 10px">走路</div>
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
  camera.position.set(5, 5, 5);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);
  const gui = new GUI();

  const loader = new GLTFLoader();
  loader.load('/Soldier.glb', (gltf) => {
    console.log('🚀 ~ file: index.vue:40 ~ loader.load ~ gltf:', gltf);
    console.log(gltf.animations, 'xxx');
    const bones = [] as any[];
    gltf.scene.traverse((obj: any) => {
      if (obj.isBone) {
        console.log(obj, 'xxxx');

        bones.push(obj);
      }
    });
    // bones.forEach((item, index) => {
    //   gui.add(item.rotation, 'x', 0, Math.PI / 3).name('关节' + index);
    // });
    const mixer = new THREE.AnimationMixer(gltf.scene);
    const IdleAction = mixer.clipAction(gltf.animations[0]);
    const RunAction = mixer.clipAction(gltf.animations[1]);
    // const clipAction2 = mixer.clipAction(gltf.animations[2]);
    const WalkAction = mixer.clipAction(gltf.animations[3]);
    // // 不循环播放
    // clipAction.loop = THREE.LoopOnce;
    // // 物体状态停留在动画结束的时候
    // clipAction.clampWhenFinished = true;
    gui.add(IdleAction, 'weight', 0, 1).name('IdleAction.weight');
    gui.add(RunAction, 'weight', 0, 1).name('RunAction.weight');
    gui.add(WalkAction, 'weight', 0, 1).name('WalkAction.weight');

    let ActionState = IdleAction; // 当前处于播放状态的动画动作对象
    document.getElementById('Idle')!.addEventListener('click', () => {
      ActionState.stop(); // 播放状态动画终止
      IdleAction.play();
      ActionState = IdleAction;
    });
    document.getElementById('Run')!.addEventListener('click', () => {
      ActionState.stop(); // 播放状态动画终止
      RunAction.play();
      ActionState = RunAction;
    });
    document.getElementById('Walk')!.addEventListener('click', () => {
      ActionState.stop(); // 播放状态动画终止
      WalkAction.play();
      ActionState = WalkAction;
    });

    IdleAction.play();
    IdleAction.play();
    WalkAction.play();
    // clipAction2.play();

    gltf.scene.rotateY(-Math.PI / 2);

    scene.add(gltf.scene);

    // 骨骼辅助
    const skeletonHelper = new THREE.SkeletonHelper(gltf.scene);
    scene.add(skeletonHelper);

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

  const geometry = new THREE.BoxGeometry(50, 50, 50);
  const target1 = new THREE.BoxGeometry(50, 200, 50).attributes.position;
  const target2 = new THREE.BoxGeometry(10, 50, 10).attributes.position;
  geometry.morphAttributes.position = [target1, target2];

  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3
  });
  const mesh = new THREE.Mesh(geometry, material);

  // mesh.morphTargetInfluences![0] = 0;

  // mesh.morphTargetInfluences![1] = 0.5;

  mesh.name = 'Box';

  // const times = [0, 3, 6];

  // const values = [0, 0, 0, 100, 0, 0, 0, 0, 100];

  // const posKF = new THREE.KeyframeTrack('Box.position', times, values);

  // const colorKF = new THREE.KeyframeTrack('Box.material.color', [2, 5], [1, 0, 0, 0, 0, 1]);

  const KF1 = new THREE.KeyframeTrack('Box.morphTargetInfluences[0]', [0, 5], [0, 1]);

  const KF2 = new THREE.KeyframeTrack('Box.morphTargetInfluences[1]', [5, 10], [0, 1]);

  // const clip = new THREE.AnimationClip('test', 6, [posKF, colorKF]);

  const clip = new THREE.AnimationClip('t', 10, [KF1, KF2]);

  const mixer = new THREE.AnimationMixer(mesh);

  const clipAction = mixer.clipAction(clip);

  // clipAction.time = 3;
  // clipAction.paused = true;

  // clip.duration = 5;
  gui.domElement.style.top = '30px';
  gui.add(clipAction, 'timeScale', 0, 6).name('播放速度');
  gui.add(clipAction, 'time', 0, 6).step(0.1).name('进度条');

  const obj = {
    t1: 0,
    t2: 0
  };

  gui
    .add(obj, 't1', 0, 1)
    .name('变形目标1')
    .onChange((v: number) => {
      mesh.morphTargetInfluences![0] = v;
    });

  gui
    .add(obj, 't2', 0, 1)
    .name('变形目标2')
    .onChange((v: number) => {
      mesh.morphTargetInfluences![1] = v;
    });

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

  // scene.add(mesh);

  const Bone1 = new THREE.Bone();
  const Bone2 = new THREE.Bone();
  const Bone3 = new THREE.Bone();

  Bone1.add(Bone2);
  Bone2.add(Bone3);

  Bone2.position.y = 60;
  Bone3.position.y = 30;

  Bone1.position.set(50, 0, 50);
  // 骨骼关节旋转
  Bone1.rotateX(Math.PI / 6);
  Bone2.rotateX(Math.PI / 6);

  // 骨骼关节可以和普通网格模型一样作为其他模型子对象，添加到场景中
  const group = new THREE.Group();
  group.add(Bone1);

  // scene.add(group);

  // SkeletonHelper会可视化参数模型对象所包含的所有骨骼关节
  const skeletonHelper = new THREE.SkeletonHelper(group);
  group.add(skeletonHelper);
  gui.add(Bone1.rotation, 'x', 0, Math.PI / 3).name('关节1');
  gui.add(Bone2.rotation, 'x', 0, Math.PI / 3).name('关节2');
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
