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
    :value="color.hex" 
    @blur="event => {color.hex = event.target.value}"
    @keyup.enter="event => {color.hex = event.target.value}"
  >
</template>

<style scoped>
  input[type="text"] {
    width: 100%;
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
  #color {
    width: 100%;
    aspect-ratio: 1 / 1;
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
</style>
