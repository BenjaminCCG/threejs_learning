<template>
  <div></div>
</template>
<script lang="ts" setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const width = window.innerWidth;

const height = window.innerHeight;

const init = () => {
  const scene = new THREE.Scene();

  const ambient = new THREE.AmbientLight();
  scene.add(ambient);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  // mesh.position.set(100, 10, 0);

  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);

  const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 2000);
  // camera.lookAt(mesh.position);
  camera.position.set(1, 1, 20);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x444444, 1); // 设置背景颜色

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  const render = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render();

  document.body.appendChild(renderer.domElement);
};

onMounted(() => {
  init();
});
</script>
