<script setup>
  import { ref, watch } from 'vue';
  import { runErrorMessage } from './store.js';

  const errorText = ref("Dont have error")
  const show = ref(false)

  function showMessage(text) {
    errorText.value = text;

    if (!show.value) {
      show.value = true;

      setTimeout(() => {
        show.value = false;
      }, 2000);
    }
  }

  watch(runErrorMessage, (value) => {
    switch (value) {
      case "Create":
        showMessage("The canvas size limit is 256x256 pixels");
        break;
      case "Import":
        showMessage("The canvas size limit is 256x256 pixels");
        break;
      case "Layer":
        showMessage("No layers found");
        break;
      case "Size":
        showMessage("Incorrect image size");
        break;
      case "Open":
        showMessage("Failed to open file");
    }
    runErrorMessage.value = 0;
  })
</script>

<template>
  <Transition>
    <div v-if="show" id="message">
      <div id="block">{{ errorText }}</div>
    </div>
  </Transition>
</template>

<style scoped>
  #message {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: flex-end;
    height: 100%;
    width: 100%;
    z-index: 9;
    pointer-events: none;
  }
  #block {
    background-color: #d14141;
    padding: 10px 20px;
    border-radius: 30px;
    border: 1px solid #7d2828;
    margin-bottom: 40px;
  }
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
