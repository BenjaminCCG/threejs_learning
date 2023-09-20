import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import point from '@/assets/光点.png';
const createSprite = () => {
  const R = 30;
  const texture = new THREE.TextureLoader().load(point);
  const material = new THREE.SpriteMaterial({
    map: texture
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(R, R, 1);
  // const pos = new THREE.Vector3();
  // obj.getWorldPosition(pos);
  // sprite.position.copy(pos);
  new TWEEN.Tween(sprite.scale)
    .to({ x: R * 1.2, y: R * 1.2 }, 1000) // 缩放到2倍大小，动画时长为1秒
    .easing(TWEEN.Easing.Quadratic.Out) // 使用二次方缓动函数实现平滑过渡
    .yoyo(true) // 动画结束后反向播放动画
    .repeat(Infinity) // 无限循环播放动画
    .start(); // 启动动画
  function waveAnimation() {
    TWEEN.update();
    requestAnimationFrame(waveAnimation);
  }
  waveAnimation();
  return sprite;
};

export { createSprite };
