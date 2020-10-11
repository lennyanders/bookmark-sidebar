// v-bind is more important than "type"
<template>
  <button
    class="button"
    :data-text="text"
    type="button"
    v-bind="$attrs"
    v-text="text"
  />
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style lang="scss">
  .button {
    position: relative;
    padding: 0.5rem 0.75rem;
    box-shadow: inset 0 0 0 0.125rem var(--font-color);
    overflow: hidden;

    &::after {
      content: attr(data-text);
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
      margin-left: 1rem;
    }
  }
</style>
