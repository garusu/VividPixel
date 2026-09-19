import { ref } from 'vue';
import { canvasWidth, canvasHeight, runRender } from './store.js';

export class Layer {
  static instances = [];

  constructor(title) {
    this.title = title;
    this.hide = false;
    this.pixels = Array(canvasWidth.value * canvasHeight.value).fill("#0000");
    this.pixelsBackup =  [...this.pixels];
    this.history = [];
    this.undoHistory = [];

    Layer.instances.push(this);
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

let counter = 2

export let layers = ref([
  new Layer("Layer 1")
])

export let currentLayer = ref(0);

export function addLayer(title=`Layer ${counter}`) {
  layers.value.unshift(new Layer(title));
  counter += 1;
}

export function removeLayer(index=0) {
  layers.value.splice(index, 1);
  runRender.value = true;
  if (!layers.value[currentLayer.value]) {
    currentLayer.value = 0;
  }
}

export function resetLayers() {
  layers.value = [ new Layer("Layer 1") ];
  counter = 2;
}
