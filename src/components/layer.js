import { ref, computed } from 'vue';
import { canvasWidth, canvasHeight, renderTrigger, runErrorMessage } from './store.js';

export class Layer {
  static instances = [];
  static counter = 0;

  constructor(title, pix=false) {
    this.id = Layer.counter;
    this.title = title;
    this.visible = true;
    this.pixels = pix ? pix : Array(canvasWidth.value * canvasHeight.value).fill("#0000");
    this.pixelsBackup =  [...this.pixels];
    this.history = [];
    this.undoHistory = [];

    Layer.instances.push(this);
    Layer.counter += 1;
  }
  destroy() {
    const index = Layer.instances.indexOf(this);

    if (index !== -1) {
      Layer.instances.splice(index, 1);
    }
  }
  updateBackup() {
    this.pixelsBackup = [...this.pixels];
    this.history = this.history.filter(item => item != 0)
    if (this.history.length > 20) this.history.shift();
    if (this.undoHistory.length > 20) this.undoHistory.shift();
  }
  undo() {
    if (this.history.at(-1)) {
      this.undoHistory.push(this.history.at(-1))
      this.history.at(-1).forEach(item => {
        this.pixels[item[0]] = item[1];
      })
      this.history.pop();
      this.updateBackup()
    }
  }
  redo() {
    if (this.undoHistory.at(-1)) {
      this.history.push(this.undoHistory.at(-1))
      this.undoHistory.at(-1).forEach(item => {
        this.pixels[item[0]] = item[2];
      })
      this.undoHistory.pop();
      this.updateBackup()
    }
  }
  softReset() {
    this.pixels = Array(canvasWidth.value * canvasHeight.value).fill("#0000");
  }
  static reset() {
    Layer.instances.forEach(obj => {
      obj.pixels = Array(canvasWidth.value * canvasHeight.value).fill("#0000");
      obj.pixelsBackup = [...obj.pixels];
      obj.history = [];
      obj.undoHistory = [];
    })
  }
}

let counter = 2;
const deletedLayers = ref([]); 

export const layerExists = computed(() => {
  return !layers.value.length > 0
});

export const undoLayerExists = computed(() => {
  return !deletedLayers.value.length > 0
});

export const layers = ref([
  new Layer("Layer 1")
]);

export let currentLayer = ref(0);

export function addLayer(title=`Layer ${counter}`, pixels=false, first=true) {
  if (first) {
    layers.value.unshift(new Layer(title, pixels));
    currentLayer.value = 0;
  } else {
    layers.value.push(new Layer(title, pixels));
  }
  counter += 1;
}

export function removeLayer(index=0) {
  if (layers.value[index]) {
    deletedLayers.value.push([layers.value[index], index])
    layers.value.splice(index, 1);
    renderTrigger.value += 1;

    if (deletedLayers.value.length > 3) {
      deletedLayers.value[0][0].destroy();
      deletedLayers.value.shift();
    }
    
    if (!layers.value[currentLayer.value]) {
      currentLayer.value = 0;
    }
  } else {
    runErrorMessage.value = "Layer";
  }
}

export function moveLayer(direct=1, index) {
  if (index >= 0 && index <= layers.value.length - 1 && layers.value[index + (1 * direct)]) {
    [layers.value[index], layers.value[index + (1 * direct)]] = [layers.value[index + (1 * direct)], layers.value[index]];
    renderTrigger.value += 1;
  }
}

export function hideLayer(index) {
  layers.value[index].visible = !layers.value[index].visible;
  renderTrigger.value += 1;
}

export function getLayers() {
  const layersData = {};
  for (const l of layers.value) {
    layersData[l.title] = l.pixels;
  }
  return layersData;
}

export function undoLayer() {
  if (deletedLayers.value.length > 0) {
    const lastDelLayer = deletedLayers.value.at(-1);
    layers.value.splice(lastDelLayer[1], 0, lastDelLayer[0]);
    deletedLayers.value.pop();
    renderTrigger.value += 1;
  } else {
    runErrorMessage.value = "Layer";
  }
}

export function resetLayers(all=false) {
  if (all) {
    layers.value = [];
  } else {
    layers.value = [ new Layer("Layer 1") ];
  }
  currentLayer.value = 0;
  counter = 2;
}
