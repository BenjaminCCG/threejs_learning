<template>
  <div></div>
</template>

<script setup lang="ts">
import { renderer } from './loop';
const initRender = () => {
  document.body.appendChild(renderer.domElement);
};
onMounted(() => {
  initRender();
});
</script>
./手机/loop
