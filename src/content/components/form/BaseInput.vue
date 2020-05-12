<template>
  <div class="input">
    <label class="input__label" :for="uid">{{ text }}</label>
    <input
      class="input__el"
      :id="uid"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
  import { getUid } from '../../utils';

  export default {
    inheritAttrs: false,
    props: {
      text: {
        type: String,
        required: true
      },
      modelValue: {
        type: [String, Number],
        required: true
      }
    },
    data() {
      return {
        uid: getUid()
      };
    }
  };
</script>

<style lang="scss">
  .input {
    &__label {
      display: block;
      margin-bottom: 5px;
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