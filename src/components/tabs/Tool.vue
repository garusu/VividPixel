<script setup>
  import { selectedTool, tools } from '../store.js';
</script>

<template>
  <p v-if="Object.keys(tools[selectedTool].flags).length == 0">This tool has no settings</p>
  <div v-for="(value, key) in tools[selectedTool].flags">
    <input :id="key" type="checkbox" v-model="tools[selectedTool].flags[key]">
    <label :for="key">{{ key }}</label>
  </div>
</template>

<style scoped>
  p {
    margin: 0;
    text-align: center;
  }
  input[type="checkbox"] {
    appearance: none;
    width: 23px;
    aspect-ratio: 1;
    vertical-align: baseline;
    border: 1px solid white;
    border-radius: 3px;
    margin: 0;
    display: inline-grid;
    place-content: center;

    &:before {
      display: inline-grid;
      content: "";
      width: 10px;
      height: 10px;
      background-color: white;
      clip-path: polygon(40% 70%, 100% 0%, 100% 30%, 40% 100%, 0% 60%, 0% 30%);
      transform: scale(0);
      transition: 100ms transform ease;
    }

    &:checked {
      background-color: steelblue;
    }

    &:checked::before {
      transform: scale(1);
    }
  }
  label {
    font-size: inherit;
    margin-left: 5px;
  }
</style>
