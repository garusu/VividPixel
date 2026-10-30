<script setup>
  import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

  const slider = ref(null);

  const pos = ref(0);

  const model = defineModel();
  const props = defineProps({
    scale: {type: Number, default: 1},
    color: {type: String, default: "lightblue"},
    cursor: {type: String, default: "lightblue"}
  });

  watch(pos, (value) => {
    model.value = pos.value / slider.value.offsetWidth * props.scale;
  })
  watch(model, (value) => {
    pos.value = (model.value / props.scale) * slider.value.offsetWidth;
  })

  let sliderRect = null;

  onMounted(() => {
    nextTick();
    pos.value = (model.value / props.scale) * slider.value.offsetWidth;
  })

  onBeforeUnmount(mouseUp);

  function mouseDown(event) {
    sliderRect = slider.value.getBoundingClientRect().left;

    mouseMove(event);

    window.addEventListener('pointermove', mouseMove);
    window.addEventListener('pointerup', mouseUp);
  }
  function mouseUp(event) {
    window.removeEventListener('pointermove', mouseMove);
    window.removeEventListener('pointerup', mouseUp);
  }
  function mouseMove(event) {
    pos.value = Math.max(
      0, 
      Math.min(
        slider.value.offsetWidth,
        event.clientX - sliderRect
      )
    );
  }
</script>

<template>
  <div 
    class="slider"
    ref="slider"
    @pointerdown.left="mouseDown"
  >
    <div class="slider-color" :style="{ background: color }"></div>
    <div 
      class="cursor"
      :style="{ left: pos + 'px', backgroundColor: cursor }"
    ></div>
  </div>
</template>

<style scoped>
  .slider {
    position: relative;
    width: 100%;
    height: 14px;

    .slider-color {
      position: absolute;
      margin: 3px 0;
      width: 100%;
      height: 8px;
    }

    .cursor {
      position: relative;
      margin: 0;
      width: 18px;
      height: 18px;
      border-radius: 100%;
      box-shadow: 0 0 1px 2px white;
      translate: -50% -2px;
    }
  }
</style>
