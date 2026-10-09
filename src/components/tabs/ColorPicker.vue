<script setup>
  import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
  import { color } from '../store.js';

  const hue = ref(null);
  const square = ref(null);

  let dragging = false;

  const mouseDown = (elem, event) => {
    event.preventDefault(); 
    dragging = elem; 
    mouseMove(event)
  }
  const mouseUp = () => dragging = false;

  const palette = ref(["#111111", "#DD3333", "#33DD33", "#3333DD"]);
  const selectedTool = ref(0);

  onMounted(() => {
    color.square.value = square.value;
    color.hue.value = hue.value;
    document.addEventListener('pointerup', mouseUp);
    document.addEventListener("pointermove", mouseMove);
  });
  onUnmounted(() => {
    document.removeEventListener('pointerup', mouseUp);
    document.removeEventListener("pointermove", mouseMove);
  });

  function mouseMove(event) {
    if (dragging == "square") {
      color.squareX.value = Math.max(
        0,
        Math.min(
          event.clientX - color.square.value.getBoundingClientRect().left, 
          color.square.value.offsetWidth
        )
      );
      color.squareY.value = Math.max(
        0,
        Math.min(
          event.clientY - color.square.value.getBoundingClientRect().top, 
          color.square.value.offsetHeight
        )
      );

      color.hsv.s = color.squareX.value / square.value.offsetWidth;
      color.hsv.v = 1 - color.squareY.value / color.square.value.offsetHeight;
    }
    else if (dragging == "hue") {
      color.hueX.value = Math.max(
        0,
        Math.min(
          event.clientX - color.hue.value.getBoundingClientRect().left,
          color.hue.value.offsetWidth
        )
      );

      color.hsv.h = color.hueX.value / color.hue.value.offsetWidth * 360;
    }
  }

  function usePalette(index) {
    if (selectedTool.value == 0) {
      color.hex = palette.value[index];
    } else if (selectedTool.value == 1) {
      palette.value.splice(index, 1);
    }
  }
  function addColor(value) {
    if (!palette.value.includes(value)) {
      palette.value.unshift(value);
    }
  }
</script>

<template>
  <div 
    id="color" 
    ref="square"
    @pointerdown.left="mouseDown('square', $event)"
    :style="{ backgroundColor: color.cssCleanColor }"
  >
    <div
      class="cursor"
      :style="{ 
        backgroundColor: `rgb(${color.r} ${color.g} ${color.b})`, 
        left: `${color.squareX.value}px`, top: `${color.squareY.value}px`
      }"
    ></div>
  </div>
  <div 
    id="hue"
    ref="hue"
    @pointerdown.left="mouseDown('hue', $event)"
  >
    <div 
      class="cursor" 
      :style="{
        backgroundColor: color.cssCleanColor, 
        left: `${color.hueX.value}px` 
      }"
    ></div>
  </div>
  <input
    maxlength="7"
    type="text"
    id="hex"
    :value="color.hex" 
    @blur="event => {color.hex = event.target.value}"
    @keyup.enter="event => {color.hex = event.target.value}"
  >
  <div id="rgb">
    <div class="input-text" data-text="R"><input 
      type="text"
      :value="color.r" 
      @blur="event => {color.r = event.target.value}"
      @keyup.enter="event => {color.r = event.target.value}"
    ></div>
    <div class="input-text" data-text="G"><input 
      type="text"
      :value="color.g" 
      @blur="event => {color.g = event.target.value}"
      @keyup.enter="event => {color.g = event.target.value}"
    ></div>
    <div class="input-text" data-text="B"><input 
      type="text"
      :value="color.b" 
      @blur="event => {color.b = event.target.value}"
      @keyup.enter="event => {color.b = event.target.value}"
    ></div>
  </div>
  <div class="sidebar-panel">
    <button 
      title="Pick" 
      class="btn m0" 
      :class="{ active: selectedTool == 0  }" 
      @click="selectedTool = 0"
    >
      <img src="@/assets/tools/cursor.svg">
    </button>
    <button 
      title="Delete" 
      class="btn m0" 
      :class="{ active: selectedTool == 1  }" 
      @click="selectedTool = 1"
    >
      <img src="@/assets/tools/layer_delete.svg">
    </button>
  </div>
  <div id="palette">
    <div 
      title="Add"
      :style="{ backgroundColor: color.hex }" 
      @click="addColor(color.hex)"
    >
      <img src="@/assets/tools/layer_add.svg">
    </div>
    <div 
      v-for="(value, index) in palette" 
      :title="value" 
      :style="{ backgroundColor: value}" 
      @click="usePalette(index)"
    ></div>
  </div>
</template>

<style scoped>
  img {
    box-sizing: border-box;
  }
  .active {
    background-color: var(--bar-active);
  }
  input[type="text"] {
    width: 100%;
    line-height: 100%;
  }
  #hex {
    margin-bottom: 5px;
  }
  .input-text {
    display: flex;
    position: relative;
    align-items: center;
    margin: 0;
  }
  .input-text::before {
    content: attr(data-text);
    position: absolute;
    left: 7px;
    color: var(--bar-dark);
  }
  .cursor {
    margin: 0;
    box-shadow: 0 0 1px 2px white;
    width: 18px;
    height: 18px;
    border-radius: 100%;
    margin: 0;
    position: relative;
  }
  div {
    margin-bottom: 20px;
  }
  #rgb {
    display: flex;
    gap: 5px;
  }
  #color {
    width: 100%;
    aspect-ratio: 3 / 2;
    background: 
      linear-gradient(to top, black, transparent), 
      linear-gradient(to right, white, transparent);

    .cursor {
      translate: -50% -50%;
    }
  }
  #hue {
    width: 100%;
    height: 10px;
    background: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);

    .cursor {
      translate: -50% -4px;
    }
  }
  #palette {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 5px;

    img {
      padding: 7px;
    }

    div {
      width: 51px;
      height: 51px;
      background-color: black;
      margin: 0;
      transition: transform 0.1s ease-in-out;

      &:hover {
        transform: scale(0.9);
      }
    }
  }
</style>
