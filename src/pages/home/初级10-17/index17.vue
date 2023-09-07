<template>
  <div class="flex absolute right-0 text-white">
    <div id="play" class="mr-1 cursor-pointer">播放</div>
    <div id="stop" class="mr-1 cursor-pointer">停止</div>
    <div id="bu" class="mr-1 cursor-pointer">暂停</div>
    <div id="Idle" class="bu">休息</div>
    <div id="Run" class="bu" style="margin-left: 10px">跑步</div>
    <div id="Walk" class="bu" style="margin-left: 10px">走路</div>
    <div id="A" class="bu">设备A</div>
    <div id="B" class="bu" style="margin-left: 10px">设备B</div>
    <div id="car" class="bu" style="margin-left: 10px">停车场</div>
    <div id="all" class="bu" style="margin-left: 10px">整体</div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
// 从threejs扩展库引入gui.js
import TWEEN from '@tweenjs/tween.js';
import { createCameraTween } from '@/utils/index';
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
  camera.position.set(300, 300, 300);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);
  const gui = new GUI();

  const loader = new GLTFLoader();
  loader.load('/Soldier.glb', (gltf) => {
    // console.log('🚀 ~ file: index.vue:40 ~ loader.load ~ gltf:', gltf);
    console.log(gltf, 'xxx');
    const bones = [] as any[];
    gltf.scene.traverse((obj: any) => {
      if (obj.isBone) {
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

  const geometry = new THREE.BoxGeometry(25, 25, 25);
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

  const times = [0, 3, 6];

  const values = [0, 0, 0, 100, 0, 0, 0, 0, 100];

  const posKF = new THREE.KeyframeTrack('Box.position', times, values);

  const colorKF = new THREE.KeyframeTrack('Box.material.color', [2, 5], [1, 0, 0, 0, 0, 1]);

  // const KF1 = new THREE.KeyframeTrack('Box.morphTargetInfluences[0]', [0, 5], [0, 1]);

  // const KF2 = new THREE.KeyframeTrack('Box.morphTargetInfluences[1]', [5, 10], [0, 1]);

  const clip = new THREE.AnimationClip('test', 6, [posKF, colorKF]);

  // const clip = new THREE.AnimationClip('t', 10, [KF1, KF2]);

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
  // const clock = new THREE.Clock();

  const tween = new TWEEN.Tween(mesh.position);

  tween.to({ x: 100, y: 50, z: 100 }, 3000);

  tween.start().easing(TWEEN.Easing.Quadratic.Out);
  // eslint-disable-next-line no-new
  new TWEEN.Tween(mesh.scale)
    .to(
      {
        x: 0.8,
        y: 0.8
      },
      2000
    )
    .start();
  // camera.lookAt(0, 0, 0);
  // const tween = new TWEEN.Tween(camera.position)
  //   .to({
  //     x: 200,
  //     y: 200
  //   })
  //   .onUpdate(() => {
  //     camera.lookAt(0, 0, 0);
  //   });
  // tween.start();

  // const R = 100;
  // const tween = new TWEEN.Tween({ angle: 0 })
  //   .to(
  //     {
  //       angle: Math.PI * 2
  //     },
  //     16000
  //   )
  //   .onUpdate((obj: any) => {
  //     camera.position.x = R * Math.cos(obj.angle);
  //     camera.position.z = R * Math.sin(obj.angle);
  //     camera.lookAt(0, 0, 0);
  //   });
  // tween.start();

  //
  const controls = new OrbitControls(camera, renderer.domElement);

  // 切换到设备A预览状态
  document.getElementById('A')!.addEventListener('click', () => {
    const A = scene.getObjectByName('vanguard_Mesh')!;
    const pos = new THREE.Vector3();
    A.getWorldPosition(pos); // 获取三维场景中某个对象世界坐标
    // 相机飞行到的位置和观察目标拉开一定的距离
    const pos2 = pos.clone().addScalar(30); // 向量的x、y、z坐标分别在pos基础上增加30
    // 相机从当前位置camera.position飞行三维场景中某个世界坐标附近
    createCameraTween(camera, controls, pos, pos2);
  });

  const geo = new THREE.SphereGeometry(2);
  const mater = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  mater.transparent = true;
  mater.opacity = 0.3;
  const mm = new THREE.Mesh(geo, mater);
  mm.position.y = 20;
  scene.add(mm);

  addEventListener('click', (e) => {
    // .offsetY、.offsetX以canvas画布左上角为坐标原点,单位px
    const px = e.offsetX;
    const py = e.offsetY;
    // 屏幕坐标px、py转WebGL标准设备坐标x、y
    // width、height表示canvas画布宽高度
    const x = (px / width) * 2 - 1;
    const y = -(py / height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersects = raycaster.intersectObjects([mm]);
    console.log(intersects, 'intersects');
    if (intersects.length > 0) {
      const mmm = intersects[0].object as any;
      new TWEEN.Tween(mmm.material)
        .to({
          opacity: 1
        })
        .start()
        .onComplete(() => {
          mmm.material.transparent = false;
        });
      // const pos = new THREE.Vector3();
      // mmm.getWorldPosition(pos); // 获取三维场景中某个对象世界坐标
      // const pos2 = pos.clone().addScalar(5); // 向量的x、y、z坐标分别在pos基础上增加30
      // createCameraTween(camera, controls, pos, pos2);
    }
  });

  function loop() {
    requestAnimationFrame(loop);
    // const frameT = clock.getDelta();
    // 更新播放器相关的时间
    // mixer.update(frameT);
  }
  loop();

  scene.add(mesh);

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
  // controls.update();
  const stats = new Stats();

  function render() {
    TWEEN.update();

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
