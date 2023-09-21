import * as THREE from 'three';

const listener = new THREE.AudioListener();
// 创建一个全局 audio 源
const sound = new THREE.Audio(listener);

// 加载一个 sound 并将其设置为 Audio 对象的缓冲区
const audioLoader = new THREE.AudioLoader();

const play = (open: boolean) =>
  audioLoader.load(open ? '/model2/open.wav' : '/model2/close.wav', (buffer) => {
    sound.setBuffer(buffer);
    sound.setVolume(0.5);
    sound.play();
  });

export { play };
