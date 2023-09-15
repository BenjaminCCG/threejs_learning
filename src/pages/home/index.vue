<template>
  <div></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

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

  const ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

  camera.position.set(0, 0, 350);
  camera.lookAt(0, 0, 0);

  // const axesHelper = new THREE.AxesHelper(100);
  // scene.add(axesHelper);

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.update();

  const loader = new GLTFLoader();
  loader.load('/model/手机.glb', (gltf) => {
    const texture = new THREE.TextureLoader().load('/model/极光紫.png');
    gltf.scene.traverse((obj: any) => {
      if (obj.isMesh) {
        obj.material = new THREE.MeshPhysicalMaterial({
          color: obj.material.color,
          map: obj.material.map
        });
      }
    });
    texture.offset.y = 0;
    const gui = new GUI();

    gui.add(texture.offset, 'y', 0, 1);
    gui.add(texture.offset, 'x', 0, 1);
    const mesh: any = gltf.scene.getObjectByName('手机');
    console.log('🚀 ~ file: index.vue:56 ~ loader.load ~ mesh:', mesh);
    (mesh as THREE.Mesh).geometry.translate(0, 0, 5);
    mesh.material.map = texture;
    // console.log(gltf.scene, 'gltf.scene');
    // gltf = gltf.scene;
    // gltf.scene.rotateY(Math.PI);
    function rotate() {
      gltf.scene.rotateY(-0.01);
      requestAnimationFrame(rotate);
    }
    rotate();
    scene.add(gltf.scene);
  });

  const arc = new THREE.ArcCurve(0, 0, 80, 0, (Math.PI * 3) / 2);

  const pointsArr = arc.getPoints(50);

  const geometry = new THREE.BufferGeometry();

  geometry.setFromPoints(pointsArr);

  const material = new THREE.LineBasicMaterial({
    color: 0x00fffff
  });

  // geometry.rotateX(Math.PI / 2);
  // geometry.rotateY(Math.PI / (3 / 4));
  // geometry.translate(0, -100, 0);
  const mesh = new THREE.Line(geometry, material);
  // const axesHelper2 = new THREE.AxesHelper(20);
  // mesh.add(axesHelper2);
  // mesh.translateY(-100);
  // mesh.rotateX(Math.PI / 2);
  mesh.rotateZ(Math.PI * 0.7);
  // mesh.position.z += 100;
  const div = document.createElement('div');
  div.innerHTML = '720';
  div.style.color = '#fff';
  const tag = new CSS3DObject(div);
  // tag.position.copy(pos);
  const axesHelper3 = new THREE.AxesHelper(20);
  tag.add(axesHelper3);
  tag.position.y += 80;
  // tag.rotateZ(Math.PI / 2);
  // tag.position.z += 80;
  // mesh.add(tag);
  // scene.add(mesh);
  tag.rotateX((Math.PI * 3) / 2);
  const group = new THREE.Group();
  group.add(mesh, tag);
  group.rotateX(Math.PI / 2);
  group.position.y -= 100;
  scene.add(group);
  const labelRenderer = new CSS3DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0';
  labelRenderer.domElement.style.left = '0';
  labelRenderer.domElement.style.pointerEvents = 'none';

  document.body.appendChild(labelRenderer.domElement);

  function render() {
    group.rotateZ(0.01);
    // mesh.rotateZ(0.01);
    // tag.rotateY(0.01);
    labelRenderer.render(scene, camera);
    renderer.render(scene, camera); // 执行渲染操作
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
});
</script>
