<template>
  <div></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
// 从threejs扩展库引入gui.js

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import Stats from 'three/addons/libs/stats.module.js';

// 引入UnrealBloomPass通道
// import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
// 引入GlitchPass通道
// import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
// 引入CSS2渲染器CSS2DRenderer和CSS2模型对象CSS2DObject
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
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
  camera.position.set(1, 1, 1);
  camera.layers.enableAll();
  // const cssRenderer = new CSS3DRenderer();
  // cssRenderer.setSize(width, height);
  // document.body.appendChild(cssRenderer.domElement);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);

  // const div = document.getElementById('tag')!;
  // // HTML元素转化为threejs的CSS2模型对象
  // const tag = new CSS3DObject(div);
  // tag.position.set(150, 50, 50);
  let arr = [] as THREE.Object3D[];
  // const geometry = new THREE.BoxGeometry(25, 25, 25);
  const geometry = new THREE.ConeGeometry(25, 80);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 25, 0);
  const div = document.createElement('div')!;
  div.style.width = '10px';
  div.style.height = '10px';
  div.style.display = 'none';
  div.style.backgroundColor = 'yellow';
  const tag = new CSS2DObject(div);
  // tag.position.set(0, 25, 0);
  // y轴正方向，平移高度一半
  geometry.translate(0, -40, 0);
  // 圆锥mesh局部坐标系原点在自己底部时候，标签需要向上偏移圆锥自身高度
  // tag.position.y += 80;
  // mesh.add(tag);
  // const pos = geometry.attributes.position;
  // tag.position.set(pos.getX(0), pos.getY(0), pos.getZ(0));

  // console.log(pos2.getX);

  // scene.add(mesh);
  // scene.add(tag);
  // const group = new THREE.Group();

  // group.add(tag, mesh);

  // scene.add(group);

  const loader = new GLTFLoader();
  loader.load('/DamagedHelmet.gltf', (gltf) => {
    // gltf.scene.add(tag);
    const list = [] as THREE.Object3D[];
    gltf.scene.children.forEach((item) => {
      item.traverse((obj: any) => {
        if (obj.isMesh) {
          obj.ancestors = item;
          list.push(obj);
        }
      });
    });
    arr = list;
    scene.add(gltf.scene);

    renderer.render(scene, camera);
  });

  const raycaster = new THREE.Raycaster();
  let chooseObj: any = null;
  addEventListener('click', (e: any) => {
    const px = e.offsetX;
    const py = e.offsetY;
    // 屏幕坐标px、py转标准设备坐标x、y
    // width、height表示canvas画布宽高度
    const x = (px / window.innerWidth) * 2 - 1;
    const y = -(py / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersects = raycaster.intersectObjects(arr);
    console.log(intersects, 'intersects');

    if (intersects.length > 0) {
      div.innerHTML = 'hello world';
      (intersects[0].object as any).ancestors.add(tag);
      chooseObj = (intersects[0].object as any).ancestors;
    } else {
      if (chooseObj) {
        chooseObj.remove(tag); // 从场景移除
      }
    }
  });
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  labelRenderer.domElement.style.zIndex = '2';
  document.body.appendChild(labelRenderer.domElement);

  // eslint-disable-next-line no-new
  const controls = new OrbitControls(camera, labelRenderer.domElement);
  // controls.minDistance = 5;
  // controls.maxDistance = 100;
  controls.addEventListener('change', () => {
    // console.log('camera.position', camera.position);
  });
  controls.update();

  const stats = new Stats();

  // const clock = new THREE.Clock();
  function render() {
    // const spt = clock.getDelta() * 1000; // 毫秒
    // console.log('两帧渲染时间间隔(毫秒)', spt);
    // console.log('帧率FPS', 1000 / spt);
    // renderer.render(scene, camera); // 执行渲染操作
    stats.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    // composer.render();
    // mesh.rotateY(0.01); // 每次绕y轴旋转0.01弧度
    requestAnimationFrame(render); // 请求再次执行渲染函数render，渲染下一帧
  }

  // mesh.position.set(20, 50, 50);
  // scene.add(mesh);
  // const worldPosition = new THREE.Vector3();
  // mesh.getWorldPosition(worldPosition);

  // const group = new THREE.Group();
  // group.add(tag);
  // scene.add(group);
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
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
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
