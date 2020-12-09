<script setup>
  import { nextTick, defineProps, defineEmit, useContext } from 'vue';
  import { getUid } from '@utils';

  const props = defineProps({
    text: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number],
      required: true,
    },
  });

  const emit = defineEmit(['update:modelValue']);

  const { attrs } = useContext();

  const uid = getUid();

  /**
   * @param {KeyboardEvent} event
   */
  const handleKeyDown = async (event) => {
    const { key, ctrlKey } = event;
    if (ctrlKey || key.length !== 1) return;

    /** @type {HTMLInputElement} */
    const input = event.currentTarget;
    if (input.type !== 'text') return;

    event.preventDefault();

    let { selectionStart, selectionEnd, value } = input;

    const newValue =
      value.substring(0, selectionStart) + key + value.substring(selectionEnd);

    emit('update:modelValue', newValue);
    await nextTick();
    input.setSelectionRange(++selectionEnd, selectionEnd);
  };
</script>

<template inherit-attrs="false">
  <div class="input">
    <label class="input__label" :for="uid" v-text="text" />
    <input
      class="input__el"
      :id="uid"
      type="text"
      v-bind="attrs"
      :value="modelValue"
      @input.passive="emit('update:modelValue', $event.target.value)"
      @keydown="handleKeyDown"
    />
  </div>
</template>

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
