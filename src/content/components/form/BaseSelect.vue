<template>
  <div class="select">
    <label class="select__label" :for="uid">{{ text }}</label>
    <select
      class="select__el"
      :id="uid"
      v-bind="$attrs"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option
        v-for="{ text, value } of options"
        :key="value"
        :value="value"
        :selected="value === modelValue"
      >
        {{ text }}
      </option>
    </select>
  </div>
</template>

<script>
  export default {
    inheritAttrs: false,
    props: {
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
    },
  };
</script>

<script setup="props">
  import { getUid } from '../../utils';

  export const uid = getUid();
</script>

<style lang="scss">
  .select {
    &__label {
      display: block;
      margin-bottom: 5px;
    }

    &__el {
      background-color: var(--bg-color);
    }
  }
</style>
