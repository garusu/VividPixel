<script setup>
  import { shallowRef } from 'vue';

  import Sideblock from './Sideblock.vue';
  import ColorPicker from './tabs/ColorPicker.vue';
  import Layers from './tabs/Layers.vue';
  import Tool from './tabs/Tool.vue';

  const tab1 = shallowRef([
    ["layers.svg", Layers],
    ["pen.svg", Tool]
  ]);
  const tab2 = shallowRef([
    ["color.svg", ColorPicker]
  ]);
</script>

<template>
  <div id="sidebar">
    <Sideblock :tab="tab1"></Sideblock>
    <Sideblock :tab="tab2"></Sideblock>
  </div>
</template>

<style scoped>
  #sidebar {
    display: flex;
    width: 350px;
    flex-wrap: wrap;
    height: 100%;
  }
</style>
