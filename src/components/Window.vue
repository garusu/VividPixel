<script setup>
  import { ref, computed } from 'vue';
  import { 
    canvasWidth, 
    canvasHeight, 
    canvasResizeTrigger, 
    windowBlock, 
    runErrorMessage
  } from './store.js';

  const widthInput = ref(16);
  const heightInput = ref(16);

  const refWidthInput = ref(null);

  const ratio = computed(() => {
    const max = Math.max(widthInput.value, heightInput.value);

    return {  
      width: Math.round(widthInput.value / max * 50) + "%",
      height: Math.round(heightInput.value / max * 50) + "%"
    }
  });

  function newCanvas(preset=0) {
    if (preset) {
      canvasHeight.value = preset;
      canvasWidth.value = preset;
      canvasResizeTrigger.value += 1;
      windowBlock.value = false;
    } else if (widthInput.value < 257 && heightInput.value < 257) {
      canvasHeight.value = heightInput.value;
      canvasWidth.value = widthInput.value;
      canvasResizeTrigger.value += 1;
      windowBlock.value = false;
    } else {
      runErrorMessage.value = "Create";
    }
  }
</script>

<template>
  <div id="window" v-if="windowBlock">
    <div id="block">
      <div id="preview">
        <div :style="{ width: ratio.width, height: ratio.height }"></div>
      </div>
      <div id="settings">
        <h2>Create Canvas</h2>
        <label>
          Width 
          <input 
            @keyup.enter="refWidthInput.focus()" 
            type="text" 
            v-model.number="widthInput"
          >
        </label>
        <label>
          Height 
          <input 
            ref="refWidthInput"
            @keyup.enter="newCanvas()"  
            type="text" 
            v-model.number="heightInput"
          >
        </label>
        <div id="preset">
          <p>Preset</p>
          <button @click="newCanvas(8)">8x8</button>
          <button @click="newCanvas(16)">16x16</button>
          <button @click="newCanvas(32)">32x32</button>
        </div>
        <button id="create-btn" @click="newCanvas()">Create</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #window {
    display: grid;
    position: absolute;
    place-items: center;
    height: 100%;
    width: 100%;
    background-color: #0008;
    z-index: 3;

    #block {
      display: flex;
      width: 700px;
      height: 350px;
      background-color: var(--bar-bg);
      padding: 20px;
      border-radius: 30px;
      gap: 10px;
      border: 1px solid var(--bar-dark);
    }
    #preview {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 50%;
      background-color: var(--other);
      border-radius: 7px;
      border: 1px solid var(--bar-dark);

      div {
        width: 50%;
        height: 50%;
        background-color: whitesmoke;
        border-radius: 4px;
        border: 1px solid grey;
        transition: width 0.2s ease, height 0.2s ease;
      }
    }
    #settings {
      display: flex;
      flex-direction: column;
      width: 50%;
      height: 100%;
    }
    input {
      width: 100%;
      padding: 8px 10px;
      text-align: left;
      cursor: text;
    }
    h2 {
      margin: 16px 0;
      text-align: center;
    }
    label, p {
      display: inline-block;
      width: 100%;
      margin: 10px 0;
    }
    p {
      margin-bottom: 0;
    }
  }
  button {
    color: var(--bar-text);
    background-color: var(--other);
    border: 1px solid var(--bar-dark);
    border-radius: 7px;
    font-size: inherit;
    padding: 8px 0;
    min-height: 0;
    cursor: pointer;

    &:hover {
      background-color: var(--bar-active);
    }
  }
  #preset {
    display: flex;
    flex-wrap: wrap;
    column-gap: 10px;

    button {
      flex: 1;
    }
  }
  #create-btn {
    width: 100%;
    margin-top: auto;
    font-size: 1.17em;
  }
</style>
