<script setup>
  import { ref } from 'vue';
  import { 
    canvasWidth, 
    canvasHeight, 
    canvasResizeTrigger, 
    windowBlock 
  } from './store.js';

  const widthInput = ref(null);
  const heightInput = ref(null);

  function newCanvas(preset=0) {
    if (preset) {
      canvasHeight.value = preset;
      canvasWidth.value = preset;
      canvasResizeTrigger.value += 1;
      windowBlock.value = false;
    } else if (parseInt(widthInput.value.value) < 257 && parseInt(heightInput.value.value) < 257) {
      canvasHeight.value = parseInt(widthInput.value.value);
      canvasWidth.value = parseInt(heightInput.value.value);
      canvasResizeTrigger.value += 1
      windowBlock.value = false;
    }
  }
</script>

<template>
  <div id="window" v-if="windowBlock">
    <div id="block">
      <div id="preview">
        <div></div>
      </div>
      <div id="settings">
        <h2>Create Canvas</h2>
        <label>Width <input type="text" ref="widthInput" value="16"></label>
        <label>Height <input type="text" ref="heightInput" value="16"></label>
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
