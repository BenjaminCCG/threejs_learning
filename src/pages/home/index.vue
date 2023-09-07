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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import TWEEN from '@tweenjs/tween.js';

const initRender = () => {
  // 创建渲染器对象
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 1);
  document.body.appendChild(renderer.domElement);
  // 创建场景对象

  const scene = new THREE.Scene();

  // const geometry = new THREE.BoxGeometry(10, 10, 10);

  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  // const mesh = new THREE.Mesh(geometry, material);

  // scene.add(mesh);
  function createSphereMesh(color: any, R: number) {
    const geometry = new THREE.SphereGeometry(R);
    const material = new THREE.MeshLambertMaterial({
      color: color
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }
  const A = new THREE.Vector3(0, 30, 0); // A点
  const B = new THREE.Vector3(80, 0, 0); // B点
  // 绿色小球可视化A点位置
  const AMesh = createSphereMesh(0x00ff00, 2);
  AMesh.position.copy(A);
  // 红色小球可视化B点位置
  const BMesh = createSphereMesh(0xff0000, 2);
  BMesh.position.copy(B);

  const group = new THREE.Group();
  group.add(AMesh, BMesh);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);

  scene.add(ambient);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

  camera.position.set(202, 123, 125);
  camera.lookAt(0, 0, 0);
  // 相机目标观察点和相机位置相减,获得一个沿着相机视线方向的向量
  const dir = new THREE.Vector3(0 - 202, 0 - 123, 0 - 125);
  // 归一化,获取一个表示相机视线方向的单位向量。
  dir.normalize();
  console.log('🚀 ~ file: index.vue:53 ~ initRender ~ dir:', dir);
  console.log('🚀 ~ file: index.vue:53 ~ initRender ~ dir:', dir.length());

  const dir2 = new THREE.Vector3();
  // 获取相机的视线方向
  camera.getWorldDirection(dir2);
  console.log('相机方向', dir2);
  console.log('单位向量', dir2.length());

  const dis = dir2.clone().multiplyScalar(200);

  // camera.position.add(dis);
  const tween = new TWEEN.Tween(camera.position).to(camera.position.clone().add(dis), 3000);
  tween.start();
  // const B = new THREE.Vector3(130, 80, 0); // 人运动结束点B
  // console.log('🚀 ~ file: index.vue:50 ~ initRender ~ B:', B.length());
  // // 3D空间，A和B两点之间的距离
  // const BA = A.clone().add(B);
  // console.log('🚀 ~ file: index.vue:53 ~ initRender ~ BA:', BA.length());

  // const AB = B.clone().sub(A);
  // console.log('🚀 ~ file: index.vue:42 ~ initRender ~ AB:', AB.length());
  // // const L = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2) + Math.pow(B.z - A.z, 2));

  // // console.log('🚀 ~ file: index.vue:52 ~ initRender ~ L:', L);

  camera.lookAt(0, 0, 0);
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.update();

  function render() {
    TWEEN.update();
    // const spt = clock.getDelta() * 1000; // 毫秒
    // console.log('两帧渲染时间间隔(毫秒)', spt);
    // console.log('帧率FPS', 1000 / spt);
    renderer.render(scene, camera); // 执行渲染操作
    // mesh.rotateY(0.01); // 每次绕y轴旋转0.01弧度
    requestAnimationFrame(render); // 请求再次执行渲染函数render，渲染下一帧
  }
  render();
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
