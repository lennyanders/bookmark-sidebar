<template>
  <div class="checkbox">
    <input
      type="checkbox"
      class="checkbox__el"
      :id="uid"
      v-bind="$attrs"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <label :for="uid" class="checkbox__label">{{ text }}</label>
  </div>
</template>

<script>
  import { getUid } from '../../utils';

  export default {
    inheritAttrs: false,
    props: {
      text: {
        type: String,
        required: true,
      },
      modelValue: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        uid: getUid(),
      };
    },
  };
</script>

<style lang="scss">
  .checkbox {
    flex: 1;

    &__label {
      position: relative;
      display: block;
      padding-left: 24px;

      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -8px;
        height: 16px;
        width: 16px;
        cursor: pointer;
      }

      &::before {
        background: linear-gradient(45deg, #304ffe, #2979ff);
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      &::after {
        border: 2px solid var(--font-color);
        transition: background-color 0.2s ease, transform 0.2s ease;
      }
    }

    &__el:focus + &__label::after {
      outline: -webkit-focus-ring-color auto 1px;
    }

    &__el:checked + &__label {
      &::before {
        opacity: 1;
      }

      &::after {
        transform: scale(#{(6 / 16)});
        background-color: var(--font-color);
      }
    }
  }
</style>
