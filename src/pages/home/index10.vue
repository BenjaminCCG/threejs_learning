<template>
  <div></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
// 引入gltf模型加载库GLTFLoader.js
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const initRender = () => {
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();
  // const loader = new GLTFLoader();
  // 环境光设置
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  // 实例化一个透视投影相机对象
  const width = window.innerWidth; // 宽度
  const height = window.innerHeight; // 高度
  // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
  // const camera = new THREE.PerspectiveCamera(60, width / height, 1, 6000);
  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 6000);
  camera.position.set(200, 200, 200);
  // camera.position.set(2000, 2000, 2000);
  // camera.lookAt(0, 0, 0);
  // camera.lookAt(10000, 10000, 1000);
  // camera.lookAt(mesh.position);
  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(100, 100, 100);
  // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
  // directionalLight.target = mesh;
  scene.add(directionalLight);

  // 平行光辅助对象
  const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000);
  scene.add(dirLightHelper);

  // Vector2表示的三个点坐标，三个点构成的轮廓相当于两端直线相连接
  // const pointsArr = [new THREE.Vector2(50, 60), new THREE.Vector2(25, 0), new THREE.Vector2(50, -60)];
  // LatheGeometry：pointsArr轮廓绕y轴旋转生成几何体曲面
  // pointsArr：旋转几何体的旋转轮廓形状
  // const geometry = new THREE.LatheGeometry(pointsArr);
  // 0, Math.PI：旋转的开始角度和结束角度

  // 三维样条曲线
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-50, 20, 90),
    new THREE.Vector3(-10, 40, 40),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, -60, 0),
    new THREE.Vector3(90, -40, 60),
    new THREE.Vector3(120, 30, 30)
  ]);
  // 样条曲线path作为TubeGeometry参数生成管道
  const geometry = new THREE.TubeGeometry(path, 200, 5, 30);
  const texLoader = new THREE.TextureLoader();
  // 纹理贴图
  const texture = texLoader.load(
    'https://cc-blog-admin.oss-cn-beijing.aliyuncs.com/image/2023-08-31/5f4a4a90-92f1-4546-a4ac-e886c2a26722.png'
  );
  // UV坐标U方向阵列模式
  texture.wrapS = THREE.RepeatWrapping;
  // 纹理沿着管道方向阵列(UV坐标U方向)
  texture.repeat.x = 10;
  // const material = new THREE.MeshLambertMaterial({
  //   map: texture,
  //   side: THREE.DoubleSide // 双面显示看到管道内壁
  // });
  const material = new THREE.PointsMaterial({ color: 0xffff00 });
  const mesh = new THREE.Points(geometry, material);

  // 从曲线上等间距获取一定数量点坐标
  const pointsArr = path.getSpacedPoints(500);
  let i = 0;
  // // 相机位置：曲线上当前点pointsArr[i]
  // camera.position.copy(pointsArr[i]);
  // // 相机观察目标：当前点的下一个点pointsArr[i + 1]
  // camera.lookAt(pointsArr[i + 1]);

  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x444444, 1); // 设置背景颜色
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // renderer.render(scene, camera);
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);
  // scene.add(mesh);

  // 当设置渲染循环可以不添加相机空间的change事件去重复render

  // eslint-disable-next-line no-new
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(pointsArr[i + 1]);
  controls.enablePan = false; // 禁止右键拖拽

  // 相机位置与观察目标点最小值
  controls.minDistance = 200;
  // 相机位置与观察目标点最大值
  controls.maxDistance = 500;

  controls.update();
  // controls.target.set(2.17, -0.03, -0.13);
  // update()函数内会执行camera.lookAt(controls.targe)
  controls.addEventListener('change', () => {
    console.log('camera.position', camera.position);
    console.log('controls.target', controls.target);
    // 相机位置与目标观察点距离
    const dis = controls.getDistance();
    console.log('dis', dis);
    // renderer.render(scene, camera);
  });

  // const clock = new THREE.Clock();
  function render() {
    // if (i < pointsArr.length - 1) {
    //   // 相机位置设置在当前点位置
    //   camera.position.copy(pointsArr[i]);
    //   // 曲线上当前点pointsArr[i]和下一个点pointsArr[i+1]近似模拟当前点曲线切线
    //   // 设置相机观察点为当前点的下一个点，相机视线和当前点曲线切线重合
    //   camera.lookAt(pointsArr[i + 1]);
    //   i += 1; // 调节速度
    // } else {
    //   i = 0;
    // }
    // const spt = clock.getDelta() * 1000; // 毫秒
    // console.log('两帧渲染时间间隔(毫秒)', spt);
    // console.log('帧率FPS', 1000 / spt);

    renderer.render(scene, camera); // 执行渲染操作
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
