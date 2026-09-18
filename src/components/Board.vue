<script setup>
  import Toolbar from './Toolbar.vue';

  import { 
    ref, 
    reactive, 
    watch, 
    computed,
    onMounted,
    nextTick 
  } from 'vue';

  import { 
    selectedTool, 
    runFunc, 
    runRender, 
    color, 
    canvasWidth, 
    canvasHeight, 
    windowBlock,
    canvasResizeTrigger
  } from './store.js';

  import { 
    Layer,
    layers,
    currentLayer,
    resetLayers
  } from './layer.js';

  const canvas = ref(null);
  const canvasForExport = ref(null);

  let ctx;
  let exportCtx;

  let prevPix;

  const canvasPos = reactive({
    x: 400,
    y: 200
  });

  let offset = [0, 0];

  let canvasScale = ref(1);

  const minCanvasScale = 0.2;
  const maxCanvasScale = 1.5;

  let action = null;
  let last = null;

  let current_color = "#000";
  let color2 = "#0000";

  const transperent = ["#0000", "#00000000"];
  
  onMounted(() => {
    ctx = canvas.value.getContext('2d');
    exportCtx = canvasForExport.value.getContext('2d');
    prepareСanvas(false);
  })

  function setPixel(x, y, color, prev=false) {
    if (x < 0 || y < 0 || x >= canvasWidth.value || y >= canvasHeight.value) return;
    if (prev) {
      prevPix[y * canvasWidth.value + x] = true;
      render();
    } else if (layers.value[currentLayer.value].pixels[y * canvasWidth.value + x] != color) {
      layers.value[currentLayer.value].pixels[y * canvasWidth.value + x] = color;
      softRender(x, y);
    }
  }

  function prepareСanvas() {
    Layer.reset();
    prevPix = Array(canvasWidth.value * canvasHeight.value).fill(null);
    render();
  }

  function historyUpdate() {
    layers.value[currentLayer.value].history.push(
      layers.value[currentLayer.value].pixels
        .map((value, index) => 
          value !== layers.value[currentLayer.value].pixelsBackup[index] 
            ? [index, layers.value[currentLayer.value].pixelsBackup[index], value] 
            : -1)
        .filter(index => index !== -1)
    );
    layers.value[currentLayer.value].updateBackup();
    layers.value[currentLayer.value].undoHistory = [];
  }

  function wheelScroll(event) {
    if (event.deltaY < 0) {
      canvasScale.value = Math.min(canvasScale.value + 0.1, maxCanvasScale);
    } else if (event.deltaY > 0) {
      canvasScale.value = Math.max(canvasScale.value - 0.1, minCanvasScale);
    }
  }

  function mouseDown(event) {
    last = getPos(event);
    if (event.button === 0) {
      if (selectedTool.value == "Pen") {
        current_color = color.hex;
        action = "draw";
        setPixel(last.x, last.y, current_color);
      } else if (selectedTool.value == "Eraser") {
        current_color = "#0000";
        action = "draw";
        setPixel(last.x, last.y, current_color);
      } else if (selectedTool.value == "Line") {
        action = "line";
      } else if (selectedTool.value == "Drag") {
        action = "drag";
        offset = [
          event.clientX - canvasPos.x,
          event.clientY - canvasPos.y
        ];
      };
    } else if (event.button === 1) {
        action = "drag";
        offset = [
          event.clientX - canvasPos.x,
          event.clientY - canvasPos.y
        ];
    } else if (event.button === 2 && selectedTool.value == "Pen") {
        action = "draw";
        current_color = color2;
        setPixel(last.x, last.y, current_color);
    }
  }

  function mouseMove(event) {
    const pos = getPos(event);
    if (action == "draw") {
      drawLine(last.x, last.y, pos.x, pos.y, current_color)
      last = pos;
    } else if (action == "drag") {
        canvasPos.x = event.clientX - offset[0];
        canvasPos.y = event.clientY - offset[1];
    
    } else if (action == "line") {
        prevPix.fill(null);
        drawLine(last.x, last.y, pos.x, pos.y, "#0000", true);
    };
  }

  function mouseUp(event) {
    const pos = getPos(event);
    if (action == "line") {
      prevPix.fill(null);
      drawLine(last.x, last.y, pos.x, pos.y, color.hex);
    }
    action = null;

    historyUpdate();
  }

  function getPos(event) {
    const rect = canvas.value.getBoundingClientRect();
    return { 
      x: Math.floor((event.clientX - rect.left) * (canvasWidth.value / rect.width)),
      y: Math.floor((event.clientY - rect.top) * (canvasHeight.value / rect.height))
    };
  }

  function render() {
    for (let y = 0; y < canvasHeight.value; y++) {
      for (let x = 0; x < canvasWidth.value; x++) {
        softRender(x, y);
      }
    }
  }

  function softRender(x, y) {
    if (layers.value.every(elem => transperent.includes(elem.pixels[y * canvasWidth.value + x]))) {
      if ((x + y) % 2 === 1) {
        ctx.fillStyle = "#e6e6e6";
        ctx.fillRect(x, y, 1, 1);
      } else {
        ctx.fillStyle = "#fff";
        ctx.fillRect(x, y, 1, 1);
      }
    } else {
      layers.value.toReversed().forEach((value, index) => {
        ctx.fillStyle = value.pixels[y * canvasWidth.value + x];
        ctx.fillRect(x, y, 1, 1);
      });
    }
    
    if (prevPix[y * canvasWidth.value + x] != null) {
      ctx.fillStyle = "#0008";
      ctx.fillRect(x, y, 1, 1);
    }
  }

  function drawLine(x0, y0, x1, y1, color, prev=false) {
    let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      setPixel(x0, y0, color, prev);
      if (x0 === x1 && y0 === y1) break;
      let e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  }

  async function openFile() {
    const [filePicker] = await window.showOpenFilePicker({
      types: [{
        description: 'Image',
        accept: {
          'image/png': ['.png']
        }
      }]
    })
    const openfile = await filePicker.getFile();

    const img = new Image();

    img.onload = async () => {
      canvasWidth.value = img.width
      canvasHeight.value = img.height
      canvasResizeTrigger.value += 1

      await nextTick();
      await nextTick();

      const canvasImg = document.createElement("canvas");
      const ctxImg = canvasImg.getContext("2d");
      canvasImg.width = img.width;
      canvasImg.height = img.height;
      ctxImg.drawImage(img, 0, 0);
      const rgba = ctxImg.getImageData(
        0, 0,
        img.width,
        img.height
      ).data;

      let j = 0

      for (let i = 0; i < rgba.length; i += 4) {
        layers.value[currentLayer.value].pixels[j] = (
          "#" +
          rgba[i].toString(16).padStart(2, "0") +
          rgba[i + 1].toString(16).padStart(2, "0") +
          rgba[i + 2].toString(16).padStart(2, "0") +
          rgba[i + 3].toString(16).padStart(2, "0")
        );
        j += 1;
      }
      URL.revokeObjectURL(urlImg);
      render();
    };

    const urlImg = URL.createObjectURL(openfile);
    img.src = urlImg;
  }

  const ratio = computed(() => {
    const max = Math.max(canvasWidth.value, canvasHeight.value);

    return {  
      width: canvasWidth.value / max * 512,
      height: canvasHeight.value / max * 512
    }
  })

  watch(canvasResizeTrigger, async () => {
    await nextTick();
    prepareСanvas();
  })

  watch(runRender, (value) => {
    if (runRender) {
      render();
      runRender.value = false;
    }
  })

  watch(runFunc, (value) => {
    switch (value) {
      case "New":
        windowBlock.value = true;
        break;
      case "Save":
        console.log(layers.value[currentLayer.value].pixels)
        break;
      case "Import":
        openFile();
        break;
      case "Export":
        for (let y = 0; y < canvasHeight.value; y++) {
          for (let x = 0; x < canvasWidth.value; x++) {
            layers.value.toReversed().forEach((value, index) => {
              exportCtx.fillStyle = value.pixels[y * canvasWidth.value + x];
              exportCtx.fillRect(x, y, 1, 1);
            });
          }
        }
        const link = document.createElement('a');
        link.download = `${prompt("File Name:")?.trim() || "Untitled"}.png`;
        link.href = canvasForExport.value.toDataURL("image/png");
        link.click();
        break;
      case "Reset":
        resetLayers();
        render();
        break;
      case "Clear":
        layers.value[currentLayer.value].softReset();
        render();
        historyUpdate();
        break;
      case "Undo":
        layers.value[currentLayer.value].undo();
        render();
        break;
      case "Redo":
        layers.value[currentLayer.value].redo()
        render();
        break;
      case "Zoom Out":
        canvasScale.value = Math.max(canvasScale.value - 0.2, minCanvasScale);
        break;
      case "Zoom In":
        canvasScale.value = Math.min(canvasScale.value + 0.2, maxCanvasScale);
        break;
    }
    runFunc.value = null;
  })
</script>

<template>
  <div 
    id="board" 
    @wheel="wheelScroll" 
    @pointerdown="mouseDown" 
    @pointermove="mouseMove" 
    @pointerup="mouseUp" 
    @contextmenu.prevent
  >
    <Toolbar />
    <canvas 
      ref="canvas" 
      id="canvas" 
      :width="canvasWidth" 
      :height="canvasHeight" 
      :style="{
        left: canvasPos.x + 'px', 
        top: canvasPos.y + 'px', 
        width: ratio.width + 'px',
        height: ratio.height + 'px',
        scale: canvasScale
      }"
    ></canvas>
    <canvas 
      ref="canvasForExport" 
      :width="canvasWidth" 
      :height="canvasHeight" 
      style="display: none;"
    ></canvas>
  </div>
</template>

<style scoped>
  canvas {
    image-rendering: pixelated;
    position: absolute;
    z-index: -1;
  }
  #board {
    position: relative;
    height: 100%;
    flex: 1;
  }
</style>
