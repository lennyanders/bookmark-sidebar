<template>
  <fieldset class="radios">
    <legend class="radios__label" v-text="text" />
    <div class="radio" v-for="{ value, text } of options" :key="value">
      <input
        class="radio__el"
        type="radio"
        :id="name + value"
        :name="name"
        v-bind="$attrs"
        :value="value"
        :checked="value === modelValue"
        @change.passive="$emit('update:modelValue', $event.target.value)"
      />
      <label class="radio__label" :for="name + value" v-text="text" />
    </div>
  </fieldset>
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
        type: [String, Number],
        required: true,
      },
    },
  };
</script>

<script setup="props">
  import { getUid } from '../../utils';

  export const name = getUid();
</script>

<style lang="scss">
  .radios {
    border: 0;

    &__label {
      display: block;
      margin-bottom: 0.5rem;
    }
  }

  .radio {
    &__label {
      padding-left: 1.5rem;
      position: relative;

      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -0.5rem;
        height: 1rem;
        width: 1rem;
        cursor: pointer;
        border-radius: 50%;
      }

      &::before {
        background: linear-gradient(45deg, #304ffe, #2979ff);
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      &::after {
        border: 0.125rem solid var(--font-color);
        transition: background-color 0.2s ease, transform 0.2s ease;
      }
    }

    &__el:focus + &__label::before {
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
