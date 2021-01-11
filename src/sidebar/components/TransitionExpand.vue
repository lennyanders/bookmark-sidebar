<script setup>
  const setHeight = (el) => {
    el.style.height = `${el.scrollHeight}px`;
  };

  const removeStyle = (el) => {
    el.style.height = '';
  };
</script>

<template>
  <Transition @enter="setHeight" @after-enter="removeStyle" @leave="setHeight"><slot /></Transition>
</template>

<style lang="scss" scoped>
  .v-enter-from,
  .v-leave-to {
    height: 0 !important;
  }

  .v-enter-active,
  .v-leave-active {
    overflow: hidden;
    transition: height 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
</style>
