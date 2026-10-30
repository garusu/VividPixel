<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { color } from '../store.js';
  import Slider from '../slider.vue';

  const square = ref(null);

  let dragging = false;

  const mouseDown = (elem, event) => {
    event.preventDefault(); 
    dragging = elem; 
    mouseMove(event)
  }
  const mouseUp = () => dragging = false;

  onMounted(() => {
    color.square.value = square.value;
    document.addEventListener('pointerup', mouseUp);
    document.addEventListener("pointermove", mouseMove);
  });
  onUnmounted(() => {
    document.removeEventListener('pointerup', mouseUp);
    document.removeEventListener("pointermove", mouseMove);
  });

  const palette = ref(["#111111", "#DD3333", "#33DD33", "#3333DD", "#BB33DD"]);
  const selectedTool = ref(0);

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
  <Slider 
    v-model="color.hsv.h" 
    :scale="360" 
    color="linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)" 
    :cursor="color.cssCleanColor" 
    style="margin-bottom: 10px;"
  />
  <Slider 
    v-model="color._alpha.value"
    :scale="255" 
    color="linear-gradient(to right, #fff1, lightskyblue)" 
    cursor="lightskyblue" 
  />
  <input
    maxlength="9"
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
    <div class="color-bg">
      <div 
        title="Add"
        :style="{ backgroundColor: color.hex}" 
        @click="addColor(color.hex)"
      >
        <img src="@/assets/tools/layer_add.svg">
      </div>
    </div>
    <div 
      class="color-bg"
      v-for="(value, index) in palette"
    >
      <div
        :style="{ backgroundColor: value}"
        :title="value" 
        @click="usePalette(index)"
      ></div>
    </div>
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
  #palette {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 5px;
    margin: 0;

    img {
      padding: 7px;
    }

    div {
      width: 41.5px;
      height: 41.5px;
      margin: 0;
      transition: transform 0.2s ease-in-out;

      &:hover {
        transform: scale(0.9);
      }
    }

    .color-bg {
      background-image: url('@/assets/other/transparent.png');
      image-rendering: pixelated;
      background-size: cover;
    }
  }
</style>
