<script setup>
  import { getImg } from '../store.js';
  const { icon } = defineProps({
    icon: {required: true}
  })
</script>

<template>
  <div class="tab">
    <img :src="getImg(icon)">
  </div>
</template>

<style scoped>
  .tab {
    width: 100%;
    aspect-ratio: 1 / 1;
    padding: 2px;
    box-sizing: border-box;
    background-color: var(--bar-bg);

    &:hover {
      background-color: transparent;
    }
    img {
      display: block;
    }
  }
</style>
