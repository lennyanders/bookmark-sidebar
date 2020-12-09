<script setup>
  import TheFullScreenFileDrop from '@components/TheFullScreenFileDrop.vue';
  import TheBookmarkBar from '@sidebar/App.vue';
</script>

<template>
  <TheBookmarkBar />
  <TheFullScreenFileDrop />
</template>

<style lang="scss">
  @import '../../public/fonts/lato.css';

  body {
    min-height: 100vh;
    background-color: #3b3b3b;
  }
</style>
