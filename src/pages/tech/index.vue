<template>
  <div class="text-light-50 absolute" @click="btnClick">切换颜色</div>
</template>
<script lang="ts" setup>
import { renderer, css3Renderer } from './render';
import { mesh } from './model';
const initRender = () => {
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(css3Renderer.domElement);
};

const btnClick = () => {
  mesh.material.color.setStyle('red');
};

onMounted(() => {
  initRender();
});
</script>
