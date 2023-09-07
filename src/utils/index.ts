// 相机动画函数，从A点飞行到B点，A点表示相机当前所处状态
// pos: 三维向量Vector3，表示动画结束相机位置
// target: 三维向量Vector3，表示相机动画结束lookAt指向的目标观察点
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// eslint-disable-next-line max-params
export function createCameraTween(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  endPos: THREE.Vector3,
  endTarget: THREE.Vector3
) {
  new TWEEN.Tween({
    // 不管相机此刻处于什么状态，直接读取当前的位置和目标观察点
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
    tx: controls.target.x,
    ty: controls.target.y,
    tz: controls.target.z
  })
    .to(
      {
        // 动画结束相机位置坐标
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        // 动画结束相机指向的目标观察点
        tx: endTarget.x,
        ty: endTarget.y,
        tz: endTarget.z
      },
      2000
    )
    .onUpdate((obj) => {
      // 动态改变相机位置
      camera.position.set(obj.tx, obj.ty, obj.tz);
      // 动态计算相机视线
      camera.lookAt(obj.x, obj.y, obj.z);
      // controls.target.set(obj.tx, obj.ty, obj.tz);
      controls.update(); // 内部会执行.lookAt()
    })
    .start()
    .easing(TWEEN.Easing.Sinusoidal.InOut);
}
