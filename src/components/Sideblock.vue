<script setup>
  import { ref, shallowRef, defineProps } from 'vue';
  import Tab from './tabs/Tab.vue';

  const { tab } = defineProps(["tab"]);
  const currentTab = ref(0);
</script>

<template>
  <div class="tabs">
    <Tab 
      v-for="(value, index) in tab" 
      :key="index" 
      :icon="tab[index][0]"
      :class="{ active: currentTab == index}" 
      @click="currentTab = index"
    ></Tab>
  </div>
  <div class="block">
    <component :is="tab[currentTab][1]"></component>
  </div>
</template>

<style scoped>
  .block {
    width: 90%;
    height: 50%;
    padding: 10px 20px;
    box-sizing: border-box;
    background-color: var(--bar-bg);
  }
  .tabs {
    width: 10%;
    height: 50%;
    background-color: var(--bar-dark);
  }
  .active {
    background-color: var(--bar-bg);
  }
</style>
