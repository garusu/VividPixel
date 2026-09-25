<script setup>
  import { tools, selectedTool, getImg } from './store.js';
</script>

<template>
  <div id="toolbar">
    <button 
      v-for="tool in tools" 
      :key="tool.name" 
      class="tool" 
      :class="{ active: selectedTool == tool.name}" 
      :title="`${ tool.name } ${ tool.hotkey ? `( ${ tool.hotkey } )` : '' }`" 
      @click="selectedTool = tool.name"
    >
      <img :src="getImg(tool.logo)">
    </button>
  </div>
</template>

<style scoped>
  #toolbar {
    display: inline-flex;
    flex-direction: column;
    overflow: hidden;
    margin: 7px;
    border-radius: 10px;
  }
  .tool {
    width: 50px;
    height: 50px;
    border: none;
    padding: 12px;
    background-color: var(--bar-bg);
    cursor: pointer;
    user-select: none;

    &:hover {
      background-color: var(--bar-active);
    }
  }
  .active {
    background-color: var(--bar-active);
  }
</style>
