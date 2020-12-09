<script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    text: {
      type: String,
      required: true,
    },
  });
</script>

<template>
  <button class="button" :aria-label="text" type="button" />
</template>

<style lang="scss">
  .button {
    position: relative;
    padding: 0.5em 0.75em;
    box-shadow: inset 0 0 0 0.125em var(--font-color);
    overflow: hidden;

    &::before {
      content: attr(aria-label);
    }

    &::after {
      content: attr(aria-label);
      position: absolute;
      top: 0;
      left: 0;
      padding: inherit;
      background: linear-gradient(45deg, #304ffe, #2979ff);
      clip-path: inset(100% 0 0 0);
      transition: clip-path 0.2s ease;
    }

    &:hover,
    &:focus {
      &::after {
        clip-path: inset(0 0 0 0);
      }
    }

    & + & {
      margin-left: 1em;
    }
  }
</style>
