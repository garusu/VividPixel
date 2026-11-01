<script setup>
  import { ref, computed, onMounted, nextTick } from 'vue';
  import { 
    canvasWidth, 
    canvasHeight,
    runExport,
    fileName
  } from '../store.js';

  import Slider from '../Slider.vue';

  let exportId = 1;

  const previewExportCanvas = ref(null);
  let previewExportCtx;

  const scaleFactor = ref(0);

  const finalScale = computed(() => {
    return Math.round(scaleFactor.value)+1
  })

  onMounted(() => {
    previewExportCtx = previewExportCanvas.value.getContext('2d');

    exportCanvas(previewExportCanvas, previewExportCtx, false, 1);
  })

  function exportCanvas(target=null, ctx=null, download=true, scale=finalScale.value) {
    Object.assign(
      runExport, 
      { 
        id: exportId, 
        scale: scale, 
        filename: fileName,
        target: [target, ctx],
        download: download
      }
    )
    exportId += 1;
  }
</script>

<template>
  <div id="settings">
    <div id="preview">
      <canvas 
        ref="previewExportCanvas" 
        :width="canvasWidth" 
        :height="canvasHeight"
      ></canvas>
    </div>
    <div id="inputs">
      <h2>Export Canvas</h2>
      <label id="filename-input">
        Filename 
        <input 
          v-model="fileName"
          type="text" 
          id="filename-input" 
          placeholder="Filename"
        >
      </label>
      <p id="slider-input">Scale Factor: x{{ finalScale }}</p>
      <div style="padding: 3px 10px;">
        <Slider v-model="scaleFactor" :scale="15" />
      </div>
      <p id="slider-input" style="opacity: 0.5">Width: {{ canvasWidth }} ▸ {{ canvasWidth*finalScale }}; Height: {{ canvasHeight }} ▸ {{ canvasHeight*finalScale }}</p>
    </div>
  </div>
  <button id="create-btn" @click="exportCanvas()">Export</button>
</template>

<style scoped>
  canvas {
    width: 100%;
    height: 100%;
  }
  #slider-input {
    margin: 5px 0;
  }
  #preview {
    position: relative;
    aspect-ratio: 1;
    background-color: var(--other);
    border-radius: 7px;
    border: 1px solid var(--bar-dark);

    canvas {
      display: block;
      position: absolute;
      inset: 0;
      image-rendering: pixelated;
      border-radius: 7px;
    }
  }
  #create-btn {
    width: 100%;
    margin-top: auto;
    font-size: 1.17em;
  }
</style>
