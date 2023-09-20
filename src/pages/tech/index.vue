<template><div /></template>
<script lang="ts" setup>
import { renderer, css3Renderer } from './render';

const initRender = () => {
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(css3Renderer.domElement);
};

onMounted(() => {
  initRender();
});
</script>
