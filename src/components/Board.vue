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
    canvasResizeTrigger, 
    runErrorMessage
  } from './store.js';

  import { 
    Layer,
    layers,
    currentLayer,
    resetLayers, 
    addLayer, 
    getLayers
  } from './layer.js';

  const canvas = ref(null);
  const canvasForExport = ref(null);
  const previewCanvas = ref(null);

  let ctx;
  let exportCtx;
  let previewCtx;

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
    previewCtx = previewCanvas.value.getContext('2d');
    prepareСanvas(false);
  })

  function setPixel(x, y, color, prev=false) {
    if (x < 0 || y < 0 || x >= canvasWidth.value || y >= canvasHeight.value) return;
    if (layers.value.length !== 0) {
      if (prev) {
        prevPix[y * canvasWidth.value + x] = true;
        previewRender();
      } else if (layers.value[currentLayer.value].pixels[y * canvasWidth.value + x] != color) {
        layers.value[currentLayer.value].pixels[y * canvasWidth.value + x] = color;
        softRender(x, y);
      }
    } else {
      runErrorMessage.value = "Layer";
    }
  }

  function prepareСanvas() {
    Layer.reset();
    prevPix = Array(canvasWidth.value * canvasHeight.value).fill(null);
    render();
  }

  function historyUpdate() {
    if (layers.value.length !== 0) {
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
      switch (selectedTool.value) {
        case "Pen":
          current_color = color.hex;
          action = "draw";
          setPixel(last.x, last.y, current_color);
          break;
        case "Eraser":
          current_color = "#0000";
          action = "draw";
          setPixel(last.x, last.y, current_color);
          break;
        case "Line":
          action = "line";
          break;
        case "Square":
          action = "square";
          break;
        case "Eyedropper":
          if (last.x < 0 || last.y < 0 || last.x >= canvasWidth.value || last.y >= canvasHeight.value) return;
          color.hex = getPixelColor(last.x, last.y) || color.hex;
          break;
        case "Drag":
          action = "drag";
          offset = [
            event.clientX - canvasPos.x,
            event.clientY - canvasPos.y
          ];
          break;
      }
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
      drawLine(last.x, last.y, pos.x, pos.y, "#0000", true);
    } else if (action == "square") {
      drawSquare(last.x, last.y, pos.x, pos.y, "#0000", true)
    }
  }

  function mouseUp(event) {
    const pos = getPos(event);

    if (action == "line") {
      previewCtx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
      drawLine(last.x, last.y, pos.x, pos.y, color.hex);
    } else if (action == "square") {
      previewCtx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
      drawSquare(last.x, last.y, pos.x, pos.y, color.hex);
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

  function getPixelColor(x, y) {
    for (const l of layers.value) {
      const pixelColor = l.pixels[y * canvasWidth.value + x];
      if (!transperent.includes(pixelColor)) return pixelColor;
    }
    return "#0000";
  }

  function render() {
    for (let y = 0; y < canvasHeight.value; y++) {
      for (let x = 0; x < canvasWidth.value; x++) {
        softRender(x, y);
      }
    }
  }

  function softRender(x, y) {
    const pixel = getPixelColor(x, y);

    if (pixel == "#0000") {
      if ((x + y) % 2 === 1) {
        ctx.fillStyle = "#e6e6e6";
        ctx.fillRect(x, y, 1, 1);
      } else {
        ctx.fillStyle = "#fff";
        ctx.fillRect(x, y, 1, 1);
      }
    } else {
      ctx.fillStyle = pixel;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  function previewRender() {
    previewCtx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
    previewCtx.fillStyle = "#0008";

    prevPix.forEach((value, index) => {
      if (value) previewCtx.fillRect(index % canvasWidth.value, Math.floor(index / canvasWidth.value), 1, 1);
    })
  }

  function drawLine(x0, y0, x1, y1, color, prev=false) {
    let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    if (prev) prevPix.fill(null);

    while (true) {
      setPixel(x0, y0, color, prev);
      if (x0 === x1 && y0 === y1) break;
      let e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  }

  function drawSquare(x0, y0, x1, y1, color, prev=false) {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    if (prev) prevPix.fill(null);

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        setPixel(x, y, color, prev);
      }
    }
  }

  async function saveJson() {
    const data = {
      type: "Pixel",
      version: 1,
      width: canvasWidth.value,
      height: canvasHeight.value,
      content: getLayers()
    }

    const json = JSON.stringify(data, null, 2);

    const handle = await window.showSaveFilePicker({
      suggestedName: `text.json`,
      types: [{
        description: "JSON file",
        accept: {
          "application/json": [".json"]
        }
      }]
    })

    const write = await handle.createWritable();

    await write.write(json);
    await write.close();
  }

  async function openJson() {
    const [filePicker] = await window.showOpenFilePicker({
      types: [{
        description: 'JSON file',
        accept: {
          'application/json': ['.json']
        }
      }]
    })

    const file = await filePicker.getFile();
    const data = JSON.parse(await file.text());

    if (data.type == "Pixel" && data.version == 1) {
      resetLayers(true);

      canvasWidth.value = data.width;
      canvasHeight.value = data.height;

      await nextTick();

      for (const [key, value] of Object.entries(data.content)) {
        addLayer(key, value, false);
      }
      render();
    } else {
      runErrorMessage.value = "Open";
    }
  }

  async function openFile(asLayer=false) {
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
      if (img.width < 257 && img.height < 257) {
        if (!asLayer) {
          resetLayers();

          canvasWidth.value = img.width;
          canvasHeight.value = img.height;
        } else if (canvasWidth.value == img.width && canvasHeight.value == img.height) {
          addLayer("Import");
          currentLayer.value = 0;
        } else {
          runErrorMessage.value = "Size";
          return;
        }

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
            (rgba[i + 3].toString(16).padStart(2, "0") == "ff" ? "" : rgba[i + 3].toString(16).padStart(2, "0"))
          );
          j += 1;
        }
        historyUpdate();
      } else {
        runErrorMessage.value = "Import";
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
        saveJson();
        break;
      case "Open":
        openJson();
        break;
      case "Import":
        openFile();
        break;
      case "Import as Layer":
        openFile(true);
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
      ref="previewCanvas"
      id="preview" 
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
  #preview {
    pointer-events: none;
    z-index: 1;
  }
  #board {
    position: relative;
    height: 100%;
    flex: 1;
  }
</style>
