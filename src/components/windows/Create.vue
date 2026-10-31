<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { 
    canvasWidth, 
    canvasHeight, 
    canvasResizeTrigger, 
    windowBlock,
    runErrorMessage
  } from '../store.js';

  const widthInput = ref(16);
  const heightInput = ref(16);

  const refWidthInput = ref(null);
  const refHeightInput = ref(null);

  const ratio = computed(() => {
    const max = Math.max(widthInput.value, heightInput.value);

    return {  
      width: Math.round(widthInput.value / max * 50) + "%",
      height: Math.round(heightInput.value / max * 50) + "%"
    }
  });

  onMounted(() => {
    refWidthInput.value.focus();
  })

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
  <div id="settings">
    <div id="preview">
      <div 
        :style="{ 
          width: ratio.width, 
          height: ratio.height 
        }"
      ></div>
    </div>
    <div id="inputs">
      <h2>Create Canvas</h2>
      <label>
        Width 
        <input 
          ref="refWidthInput"
          @keyup.enter="refHeightInput.focus()" 
          type="text" 
          v-model.number="widthInput"
        >
      </label>
      <label>
        Height 
        <input 
          ref="refHeightInput"
          type="text" 
          @keyup.enter="newCanvas()" 
          v-model.number="heightInput"
        >
      </label>
      <div id="preset">
        <p>Preset</p>
        <button @click="newCanvas(8)">8x8</button>
        <button @click="newCanvas(16)">16x16</button>
        <button @click="newCanvas(32)">32x32</button>
      </div>
    </div>
  </div>
  <button id="create-btn" @click="newCanvas()">Create</button>
</template>

<style scoped>
  #preview {
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1;
    background-color: var(--other);
    border-radius: 7px;
    border: 1px solid var(--bar-dark);

    div {
      background-color: whitesmoke; 
      border-radius: 2px;
      transition: width 0.2s ease, height 0.2s ease;
    }
  }
  #preset {
    display: flex;
    flex-wrap: wrap;
    column-gap: 5px;
    margin-top: 4px;

    p {
      width: 100%;
    }
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
