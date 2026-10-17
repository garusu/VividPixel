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
  import { ref, nextTick } from 'vue';

  const isDisabled = ref(null);

  function rename(title, value) {
    value.title = title.trim() || "Unnamed";
    isDisabled.value = null;
  }

  function select(event, value) {
    isDisabled.value = value.id;
    event.target.select();
  }
</script>

<template>
  <div id="layers">
    <div class="sidebar-panel">
      <button 
        title="Add"
        class="btn m0"
        @click="addLayer()"
      >
        <img src="@/assets/tools/layer_add.svg">
      </button>
      <button 
        title="Delete"
        class="btn m0" 
        :class="{ disable: layerExists }" 
        @click="removeLayer(currentLayer)"
      >
        <img src="@/assets/tools/layer_delete.svg">
      </button>
      <button 
        title="Undo"
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
      <input 
        class="title"
        :class="{ active: currentLayer == index }"
        :value="value.title" 
        :readonly="isDisabled !== value.id"
        @click="currentLayer = index"
        @dblclick="(elem) => select(elem, value)"
        @blur="(elem) => rename(elem.target.value, value)"
        @keyup.enter="(elem) => rename(elem.target.value, value)"
      >
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
    all: unset;
    width: 100%;
    border: none;
    background-color: transparent;
    color: inherit;
    font-size: inherit;
    text-align: left;
    flex: 1;
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
