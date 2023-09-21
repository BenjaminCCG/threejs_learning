import * as THREE from 'three';
import { camera } from './render';
const listener = new THREE.AudioListener();
camera.add(listener);
// 创建一个全局 audio 源
const sound = new THREE.Audio(listener);

// 加载一个 sound 并将其设置为 Audio 对象的缓冲区
const audioLoader = new THREE.AudioLoader();

audioLoader.load('/model2/背景.mp3', (buffer) => {
  sound.setBuffer(buffer);
  sound.setVolume(0.5);
});

export { sound };
