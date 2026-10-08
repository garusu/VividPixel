<script setup>
  import { 
    layers, 
    currentLayer, 
    addLayer, 
    removeLayer, 
    moveLayer, 
    hideLayer, 
    undoLayer,
    layerExists,
    undoLayerExists
  } from '../layer.js';
  import { getImg } from '../store.js';
</script>

<template>
  <div id="layers">
    <div id="panel">
      <button 
        class="btn m"
        @click="addLayer()"
      >
        <img src="@/assets/tools/layer_add.svg">
      </button>
      <button 
        class="btn m" 
        :class="{ disable: layerExists }" 
        @click="removeLayer(currentLayer)"
      >
        <img src="@/assets/tools/layer_delete.svg">
      </button>
      <button 
        class="btn m" 
        :class="{ disable: undoLayerExists }" 
        @click="undoLayer()"
      >
        <img src="@/assets/tools/layer_undo.svg">
      </button>
    </div>
    <div 
      v-for="(value, index) in layers"
      :key="value.id"
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
        <button class="btn" @click="moveLayer(-1, index)">
          <img src="@/assets/tools/layer_up.svg">
        </button>
        <button class="btn" @click="moveLayer(1, index)">
          <img src="@/assets/tools/layer_down.svg">
        </button>
        <button class="btn" @click="hideLayer(index)">
          <img :src="getImg(value.visible ? 'layer_show.svg' : 'layer_hide.svg')">
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  .m {
    margin: 0;
  }
  .active {
    text-decoration: underline;
  }
  .disable {
    opacity: 0.5;
  }
</style>
