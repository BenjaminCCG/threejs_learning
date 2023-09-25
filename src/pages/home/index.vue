<template>
  <div></div>
</template>

<script setup lang="ts">
import { renderer } from './render';

const init = () => {
  document.body.appendChild(renderer.domElement);
};

onMounted(() => {
  init();
});
</script>

<style scoped>
#mycanvas {
  width: 600px;
  height: 300px;
}
</style>
