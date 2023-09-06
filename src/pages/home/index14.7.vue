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
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// 引入渲染器通道RenderPass
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// 引入OutlinePass通道
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

// 伽马校正后处理Shader
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';

// ShaderPass功能：使用后处理Shader创建后处理通道
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
// FXAA抗锯齿Shader
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
// SMAA抗锯齿通道
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

// 引入UnrealBloomPass通道
// import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
// 引入GlitchPass通道
// import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const initRender = () => {
  // let arr = [] as THREE.Object3D[];
  // 实例化一个透视投影相机对象
  const width = window.innerWidth; // 宽度
  const height = window.innerHeight; // 高度
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();
  const texture = new THREE.TextureLoader().load(
    'https://cc-blog-admin.oss-cn-beijing.aliyuncs.com/image/2023-08-31/5f4a4a90-92f1-4546-a4ac-e886c2a26722.png'
  );
  // 创建射线对象Ray
  const ray = new THREE.Ray();
  ray.origin = new THREE.Vector3(20, 0, 0); // 射线起点
  ray.direction.set(-1, 0, 0);
  const p1 = new THREE.Vector3(100, 25, 0);
  const p2 = new THREE.Vector3(100, -25, 25);
  const p3 = new THREE.Vector3(100, -25, -25);
  const point = new THREE.Vector3(); // 用来记录射线和三角形的交叉点
  // `.intersectTriangle()`计算射线和三角形是否相交叉，相交返回交点，不相交返回null
  const result = ray.intersectTriangle(p1, p2, p3, false, point);
  console.log('交叉点坐标', point);
  console.log('查看是否相交', result);

  const ambient = new THREE.AmbientLight();
  scene.add(ambient);

  // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
  // const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 3000);
  // // camera.position.set(-1.8, 0.6, 2.7);
  // camera.position.set(100, 100, 100);
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
  camera.position.set(-1.8, 0.6, 2.7);
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x444444, 1); // 设置背景颜色
  // renderer.render(scene, camera);
  // 设置渲染器，允许光源阴影渲染
  renderer.shadowMap.enabled = true;
  const raycaster = new THREE.Raycaster();

  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);

  // 创建后处理对象EffectComposer，WebGL渲染器作为参数
  const composer = new EffectComposer(renderer);
  // 创建一个渲染器通道，场景和相机作为参数
  const renderPass = new RenderPass(scene, camera);

  // 设置renderPass通道
  composer.addPass(renderPass);

  // OutlinePass第一个参数v2的尺寸和canvas画布保持一致
  const v2 = new THREE.Vector2(window.innerWidth, window.innerHeight);
  // const v2 = new THREE.Vector2(800, 600);
  const outlinePass = new OutlinePass(v2, scene, camera);
  // canvas画布宽高度window.innerWidth, window.innerHeight
  // const bloomPass = new UnrealBloomPass(v2, 1.5, 0.4, 0.85);
  // const glitchPass = new GlitchPass();
  // 模型描边颜色，默认白色
  outlinePass.visibleEdgeColor.set(0xffff00);
  // 高亮发光描边厚度
  outlinePass.edgeThickness = 4;
  // 高亮描边发光强度
  outlinePass.edgeStrength = 6;
  // 模型闪烁频率控制，默认0不闪烁
  outlinePass.pulsePeriod = 2;

  const geometry = new THREE.BoxGeometry(25, 25, 25);
  geometry.translate(0, 12.5, 0);
  // mesh顶部中心添加标注，顶部中心坐标是(0,100,0)

  // 创建伽马校正通道
  const gammaPass = new ShaderPass(GammaCorrectionShader);
  composer.addPass(gammaPass);

  // const material = new THREE.MeshPhongMaterial();

  // 创建精灵材质对象SpriteMaterial
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture // 设置精灵纹理贴图
  });
  const spriteMaterial2 = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load(
      'https://cc-blog-admin.oss-cn-beijing.aliyuncs.com/image/2023-08-20/db533276-ce41-4af8-bd8a-874cda2d4529.png'
    ) // 设置精灵纹理贴图
  });
  // 创建精灵模型对象，不需要几何体geometry参数
  const sprite = new THREE.Sprite(spriteMaterial) as THREE.Sprite & { change: () => void };
  const sprite2 = new THREE.Sprite(spriteMaterial2) as THREE.Sprite & { change: () => void };

  sprite.change = () => {
    // sprite.material.color.set(0xffffff);
    console.log(sprite, 'sprite');
  };
  sprite2.change = () => {
    console.log(sprite2, 'sprite2');
  };
  // const mesh = new THREE.Mesh(geometry, material);
  // scene.add(mesh);
  scene.add(sprite);
  addEventListener('click', (e: any) => {
    const px = e.offsetX;
    const py = e.offsetY;
    // 屏幕坐标px、py转标准设备坐标x、y
    // width、height表示canvas画布宽高度
    const x = (px / window.innerWidth) * 2 - 1;
    const y = -(py / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersects = raycaster.intersectObjects([sprite, sprite2]);
    // const intersects = raycaster.intersectObjects(arr);
    if (intersects.length > 0) {
      // intersects[0].object.change();
      // intersects[0].object.material.color.set(0xff0000);
    }
    console.log(intersects, 'intersects');
  });

  outlinePass.visibleEdgeColor.set(0xffff00);
  // outlinePass.selectedObjects = [mesh, sprite];
  composer.addPass(outlinePass);
  // composer.addPass(bloomPass);

  // composer.addPass(glitchPass);

  const loader = new GLTFLoader();
  loader.load('/DamagedHelmet.gltf', (gltf) => {
    const list = [] as THREE.Object3D[];
    gltf.scene.traverse((obj: any) => {
      if (obj.isMesh) {
        outlinePass.selectedObjects.push(obj);
        list.push(obj);
      }
    });
    // arr = list;
    scene.add(gltf.scene);

    renderer.render(scene, camera);
  });

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

  const FXAAPass = new ShaderPass(FXAAShader);
  // `.getPixelRatio()`获取`renderer.setPixelRatio()`设置的值
  const pixelRatio = renderer.getPixelRatio(); // 获取设备像素比
  // width、height是canva画布的宽高度
  FXAAPass.uniforms.resolution.value.x = 1 / (width * pixelRatio);
  FXAAPass.uniforms.resolution.value.y = 1 / (height * pixelRatio);
  composer.addPass(FXAAPass);

  // 获取.setPixelRatio()设置的设备像素比
  // width、height是canva画布的宽高度
  const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio);
  composer.addPass(smaaPass);

  // const clock = new THREE.Clock();
  function render() {
    // const spt = clock.getDelta() * 1000; // 毫秒
    // console.log('两帧渲染时间间隔(毫秒)', spt);
    // console.log('帧率FPS', 1000 / spt);
    // renderer.render(scene, camera); // 执行渲染操作

    composer.render();
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
