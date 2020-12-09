<script setup>
  import { defineProps, defineEmit } from 'vue';
  import { getUid } from '@utils';

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
      type: [String, Number],
      required: true,
    },
  });

  const emit = defineEmit(['update:modelValue']);

  const name = getUid();
</script>

<template inherit-attrs="false">
  <fieldset class="radios">
    <legend class="radios__label" v-text="text" />
    <div class="radio" v-for="{ value, text } of options" :key="value">
      <input
        class="radio__el"
        type="radio"
        :id="name + value"
        :name="name"
        :value="value"
        :checked="value === modelValue"
        @change.passive="emit('update:modelValue', $event.target.value)"
      />
      <label class="radio__label" :for="name + value" v-text="text" />
    </div>
  </fieldset>
</template>

<style lang="scss">
  .radios {
    border: 0;

    &__label {
      display: block;
      margin-bottom: 0.5em;
    }
  }

  .radio {
    &__label {
      padding-left: 1.5em;
      position: relative;

      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -0.5em;
        height: 1em;
        width: 1em;
        cursor: pointer;
        border-radius: 50%;
      }

      &::before {
        background: linear-gradient(45deg, #304ffe, #2979ff);
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      &::after {
        border: 0.125em solid var(--font-color);
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
