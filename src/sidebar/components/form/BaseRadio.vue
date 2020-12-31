<script setup>
  import { defineProps, defineEmit } from 'vue';

  const props = defineProps({
    text: {
      type: String,
      required: true,
    },
    options: {
      required: true,
      validator: (prop) => {
        if (!Array.isArray(prop)) prop = Object.values(prop);

        return prop.every(
          (item) => typeof item.value !== 'undefined' && typeof item.text === 'string',
        );
      },
    },
    modelValue: {
      required: true,
    },
  });

  const emit = defineEmit(['update:modelValue']);
</script>

<template inherit-attrs="false">
  <fieldset class="radios">
    <legend class="radios__label">{{ text }}</legend>
    <label class="radio" v-for="{ value, text } of options" :key="value">
      <input
        class="radio__el"
        type="radio"
        :value="value"
        :checked="value === modelValue"
        @change.passive="emit('update:modelValue', $event.target.value)"
      />
      <span class="radio__label">{{ text }}</span>
    </label>
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
    display: block;

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
