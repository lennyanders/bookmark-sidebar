<template>
  <div class="input">
    <label class="input__label" :for="uid" v-text="text" />
    <input
      class="input__el"
      :id="uid"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      @input.passive="$emit('update:modelValue', $event.target.value)"
      @keydown="handleKeyDown"
    />
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
      modelValue: {
        type: [String, Number],
        required: true,
      },
    },
  };
</script>

<script setup="props, { emit }">
  import { getUid } from '../../utils';

  export const uid = getUid();

  /**
   * @param {KeyboardEvent} event
   */
  export const handleKeyDown = (event) => {
    const { key, ctrlKey } = event;
    if (ctrlKey || key.length !== 1) return;

    event.preventDefault();

    /**
     * @type {HTMLInputElement}
     */
    const input = event.currentTarget;
    let { selectionStart, selectionEnd, value } = input;
    const newValue =
      value.substring(0, selectionStart) + key + value.substring(selectionEnd);

    input.value = newValue;
    input.setSelectionRange(++selectionEnd, selectionEnd);

    emit('update:modelValue', newValue);
  };
</script>

<style lang="scss">
  .input {
    &__label {
      display: block;
      margin-bottom: 0.375em;
    }

    &__el {
      width: 100%;
      color: var(--input-color);
      transition: color 0.2s ease;

      &:disabled {
        color: var(--disabled-input-color);
      }
    }
  }
</style>
