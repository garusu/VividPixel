<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { runFunc, menuItems } from './store.js';

  const selectedItem = ref(null);
  const container = ref(null);

  function handleClick(event) {
    if (!container.value?.contains(event.target)) {
      selectedItem.value = null
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClick);
  })
  onUnmounted(() => {
    document.removeEventListener('click', handleClick);
  })
</script>

<template>
  <div ref="container" id="menubar">
    <div 
      v-for="(item, index) in menuItems"
      @click="selectedItem === index ? selectedItem = null : selectedItem = index" 
      :key="index"
      :class="{ active: selectedItem === index}"
      class="menu-btn" 
    >
      {{ item[0] }}
      <div 
        :class="{ visible: selectedItem === index}"
        class="dropdown"
      >
        <button 
          v-for="drop in item.slice(1)" 
          @click="runFunc = drop[0]" 
          :disabled="drop?.[2]"
        >
          {{ drop[0] }}
          <span class="shortcut">{{ drop[1] }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #menubar {
    display: flex;
    background-color: var(--bar-bg);
  }
  .menu-btn {
    position: relative;
    padding: 7px 10px;
    background-color: transparent;
    cursor: pointer;
    user-select: none;
    font-size: inherit;
    font-family: inherit;
    color: var(--bar-text);

    &:hover {
      background-color: var(--bar-active);
    }
  }
  .dropdown {
    display: none;
    position: absolute;
    flex-direction: column;
    border: 2px var(--bar-dark) solid;
    border-radius: 4px;
    background-color: var(--bar-bg);
    top: 32px;
    left: 0;
    z-index: 1;

    button {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      border: none;
      font-size: inherit;
      color: var(--bar-text);
      padding: 9px 12px;
      background-color: transparent;
      border-radius: 2px;
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        background-color: var(--bar-active);
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
  .shortcut {
    opacity: 0.5;
    text-align: right;
  }
  .visible {
    display: flex;
  }
  .active {
    background-color: var(--bar-active);
  }
</style>
