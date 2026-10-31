<script setup>
  import { ref, shallowRef, onMounted, onBeforeUnmount } from 'vue';
  import { windowBlock } from './store.js';

  import Create from './windows/Create.vue';
  import Export from './windows/Export.vue';

  const currentWindow = shallowRef(Create);

  const windowElem = ref(null);

  const x = ref(0);
  const y = ref(0);

  let startX = 0;
  let startY = 0;

  let currentX = 0;
  let currentY = 0;

  const tabs = [
    { name: "New", tab: Create },
    { name: "Export", tab: Export},
  ];

  onMounted(() => {
    const windowRect = windowElem.value.getBoundingClientRect();

    x.value = (window.innerWidth - windowRect.width) / 2;
    y.value = (window.innerHeight - windowRect.height) / 2;
  })


  onBeforeUnmount(stopDrag);

  function startDrag(event) {
    if (event.button == 0 && event.target == event.currentTarget) {
      startX = event.clientX;
      startY = event.clientY;

      currentX = x.value;
      currentY = y.value;

      window.addEventListener('pointermove', onDrag);
      window.addEventListener('pointerup', stopDrag);
    }
  }

  function onDrag(event) {
    x.value = currentX + event.clientX - startX;
    y.value = currentY + event.clientY - startY;
  }

  function stopDrag() {
    window.removeEventListener('pointermove', onDrag);
    window.removeEventListener('pointerup', stopDrag);
  }
</script>

<template>
  <div id="window" v-if="windowBlock">
    <div 
      ref="windowElem"
      id="block" 
      :style="{
        transform: `translate(${x}px, ${y}px)`
      }"
    >
      <div id="titlebar" @pointerdown="startDrag">
        <button @click="windowBlock = false"><img src="@/assets/tools/close.svg"></button>
      </div>
      <div id="main">
        <div id="tabs">
          <button 
            v-for="tab in tabs" 
            class="tab" 
            :class="{ active: currentWindow == tab.tab  }" 
            @click="currentWindow = tab.tab"
          >
            {{ tab.name }}
          </button>
        </div>
        <div id="window-block">
          <component :is="currentWindow" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #window {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #0007;
    z-index: 3;
  }
  #block {
    width: 750px;
    background-color: var(--bar-dark);
    border: 1px solid var(--bar-dark);
  }
  #titlebar {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: end;
    background-color: var(--bar-dark);

    button {
      all: unset;
      width: 20px;
      height: 20px;
      margin: 3px;
      padding: 2px;
      border-radius: 7px;
    }
  }
  #main {
    display: flex;
    width: 100%;
  }
  #tabs {
    flex: 1;
    padding: 0 5px;
  }
  #tabs .tab {
    display: block;
    width: 100%;
    text-align: left;
    margin-bottom: 5px;
    border-radius: 7px;
    box-sizing: border-box;
    background-color: var(--bar-bg);
    padding: 10px 5px;
    align-content: center;

    &:hover {
      background-color: var(--other);
    }
  }
  #tabs .active {
    background-color: var(--other);
  }
  #window-block {
    display: flex;
    flex-direction: column;
    flex: 4;
    padding: 10px;
    background-color: var(--bar-bg);
  }
</style>
