<template>
  <div class="absolute bottom-4 left-1/2 -ml-5 flex">
    <img
      v-for="(item, index) in colors"
      :key="index"
      class="w-10 h-10"
      :src="item.img"
      @click="() => imgClick(index)"
    />
    <div @click="soundClick">{{ play ? '暂停' : '播放' }}</div>
    <div @click="lightClick">{{ play2 ? '关闭' : '打开' }}</div>
  </div>
</template>

<script setup lang="ts">
import { renderer } from './loop';
import { colors, imgClick } from './colors';
import { sound } from './BGM.ts';
import { openLight, closeLight } from './carLight';
import { ambient, directionalLight1, directionalLight2 } from './scene';

const initRender = () => {
  document.body.appendChild(renderer.domElement);
};

const play = ref(true);
const play2 = ref(false);
const soundClick = () => {
  play.value = !play.value;
  play.value ? sound.pause() : sound.play();
};
const lightClick = () => {
  play2.value = !play2.value;
  if (play2.value) {
    ambient.intensity = 0;
    directionalLight1.intensity = 0;
    directionalLight2.intensity = 0;
    closeLight();
  } else {
    openLight();
    ambient.intensity = 0.8;
    directionalLight1.intensity = 0.8;
    directionalLight2.intensity = 0.8;
  }
};
onMounted(() => {
  initRender();
});
</script>
