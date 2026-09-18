<script setup>
  import { tools, selectedTool, getImg } from './store.js';
</script>

<template>
  <div id="toolbar">
    <button 
      v-for="tool in tools" 
      :key="tool[0]" 
      class="tool" 
      :class="{ active: selectedTool == tool[0]}" 
      :title="`${ tool[0] } ${ tool[2] ? `( ${ tool[2] } )` : '' }`" 
      @click="selectedTool = tool[0]"
    >
      <img :src="getImg(tool[1])">
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
