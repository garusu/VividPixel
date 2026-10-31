<script setup>
  import { ref, computed } from 'vue';
  import { 
    canvasWidth, 
    canvasHeight,
    runExport
  } from '../store.js';

  import Slider from '../Slider.vue';

  let exportId = 1;

  const fileName = ref("Untitled");
  const scaleFactor = ref(0);

  const finalScale = computed(() => {
    return Math.round(scaleFactor.value)+1
  })

  function exportCanvas() {
    Object.assign(runExport, { id: exportId, scale: finalScale.value, filename: fileName })
    exportId += 1;
  }
</script>

<template>
  <div id="settings">
    <div id="inputs">
      <h2>Export Canvas</h2>
      <label>
        Filename 
        <input 
          type="text" 
          v-model="fileName"
        >
      </label>
      <label>Scale Factor: x{{ finalScale }}</label>
      <div style="padding: 3px 10px;">
        <Slider v-model="scaleFactor" :scale="15" />
      </div>
      <label style="opacity: 0.5;">Width: {{ canvasWidth }} ▸ {{ canvasWidth*finalScale }}; Height: {{ canvasHeight }} ▸ {{ canvasHeight*finalScale }}</label>
    </div>
  </div>
  <button id="create-btn" @click="exportCanvas">Export</button>
</template>

<style scoped>
  canvas {
    width: 100%;
    height: 100%;
  }
  #preview {
    aspect-ratio: 1;
    background-color: var(--other);
    border-radius: 7px;
    border: 1px solid var(--bar-dark);
  }
  #create-btn {
    width: 100%;
    margin-top: auto;
    font-size: 1.17em;
  }
</style>
