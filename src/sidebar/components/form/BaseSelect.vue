<script setup>
  import { defineProps, defineEmit } from 'vue';

  const props = defineProps({
    text: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
      validator: (array) => array.every((item) => item.value && item.text),
    },
    modelValue: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmit(['update:modelValue']);
</script>

<template inherit-attrs="false">
  <label class="select">
    <span class="select__label" v-text="text" />
    <select class="select__el" @change.passive="emit('update:modelValue', $event.target.value)">
      <option
        v-for="{ text, value } of options"
        :key="value"
        :value="value"
        :selected="value === modelValue"
        v-text="text"
      />
    </select>
  </label>
</template>

<style lang="scss">
  @import '../../functions.scss';

  .select {
    &__label {
      display: block;
      margin-bottom: 0.5em;
    }

    &__el {
      appearance: none;
      width: 100%;
      padding: 0.125em 0.25em;
      border: 0.125em solid var(--font-color);
      background-color: var(--bg-color);
      background-image: svg-url(
        '<svg viewBox="0 0 24 24"><path fill="#fff" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42z"/></svg>'
      );
      background-repeat: no-repeat;
      background-position: right 0.125em center;
      background-size: 1.5em 1.5em;
    }
  }
</style>
