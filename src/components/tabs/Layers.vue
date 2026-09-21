<script setup>
  import { layers, currentLayer, addLayer, removeLayer } from '../layer.js';
</script>

<template>
  <div id="layers">
    <div id="panel">
      <button class="btn" style="margin: 0;" @click="addLayer()">
        <img src="@/assets/tools/layer_add.svg">
      </button>
    </div>
    <div 
      v-for="(value, index) in layers"
      :key="index"
      class="layer"
    >
      <button 
        class="title"
        :class="{ active: currentLayer == index }"
        @click="currentLayer = index"
      >
        {{ value.title }}
      </button>
      <div class="right">
        <button class="btn" @click="removeLayer(index)">
          <img src="../../assets/tools/layer_delete.svg">
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  input {
    appearance: auto;
    -webkit-appearance: auto;
  }
  img {
    width: 100%;
  }
  #panel {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    background-color: var(--other);
    padding: 2px;
    border-radius: 6px;
  }
  .layer {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 5px 0;
  }
  .title {
    border: none;
    background-color: transparent;
    color: inherit;
    font-size: inherit;
    flex: 1;
    text-align: left;
    padding-left: 0;

    &:hover {
      text-decoration: underline;
    }
  }
  .right {
    height: 25px;
  }
  .btn {
    border: none;
    padding: 0;
    background-color: transparent;
    border-radius: 4px;
    height: 25px;
    aspect-ratio: 1;
    margin-left: 5px;

    &:hover {
      background-color: var(--bar-active);
    }
  }
  .active {
    text-decoration: underline;
  }
</style>
