<template>
  <div></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';

onMounted(() => {
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();

  // 创建一个长方体几何对象Geometry
  const geometry = new THREE.BoxGeometry(100, 60, 20);

  // 创建一个材质对象Material
  const material = new THREE.MeshLambertMaterial();

  const pointLight = new THREE.PointLight(0xffffff, 1, 0, 0);

  // 点光源位置
  pointLight.position.set(100, 60, 50); // 点光源放在x轴上

  // 两个参数分别为几何体geometry、材质material
  const mesh = new THREE.Mesh(geometry, material); // 网格模型对象Mesh

  // 设置网格模型在三维空间中的位置坐标，默认是坐标原点
  mesh.position.set(100, 10, 0);
  mesh.position.set(100, 0, 0);
  scene.add(mesh);
  scene.add(pointLight);
  // 实例化一个透视投影相机对象
  const width = 800; // 宽度
  const height = 500; // 高度
  // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面

  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(200, 200, 200);
  camera.lookAt(mesh.position);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
  const axesHelper = new THREE.AxesHelper(150);
  scene.add(axesHelper);
  document.body.appendChild(renderer.domElement);
});
</script>
