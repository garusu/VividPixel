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
    <div class="sidebar-panel">
      <button 
        class="btn m0"
        @click="addLayer()"
      >
        <img src="@/assets/tools/layer_add.svg">
      </button>
      <button 
        class="btn m0" 
        :class="{ disable: layerExists }" 
        @click="removeLayer(currentLayer)"
      >
        <img src="@/assets/tools/layer_delete.svg">
      </button>
      <button 
        class="btn m0" 
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
  .active {
    text-decoration: underline;
  }
  .disable {
    opacity: 0.5;
  }
</style>
