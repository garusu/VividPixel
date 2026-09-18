<script setup>
  import Tab from './tabs/Tab.vue';
  import ColorPicker from './tabs/ColorPicker.vue';
  import Layers from './tabs/Layers.vue';
</script>

<template>
  <div id="sidebar">
    <div class="tabs">
      <Tab icon="layers.svg"></Tab>
    </div>
    <div class="block">
      <Layers />
    </div>

    <div class="tabs">
      <Tab icon="color.svg"></Tab>
    </div>
    <div class="block">
      <ColorPicker />
    </div>

  </div>
</template>

<style scoped>
  #sidebar {
    display: flex;
    width: 300px;
    flex-wrap: wrap;
    height: 100%;
  }
  .block {
    width: 90%;
    height: 50%;
    padding: 10px 20px;
    box-sizing: border-box;
    background-color: var(--bar-bg);
  }
  .tabs {
    width: 10%;
    height: 50%;
    background-color: var(--bar-dark);
  }
</style>
