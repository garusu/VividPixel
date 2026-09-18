<script setup>
  import Menubar from './components/Menubar.vue';
  import Sidebar from './components/Sidebar.vue';
  import Board from './components/Board.vue';
  import Window from './components/Window.vue';
</script>

<template>
  <Window />
  <Menubar />
  <div id="block">
    <Board />
    <Sidebar />
  </div>
</template>

<style scoped>
  #block {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    width: 100%;
  }
</style>
