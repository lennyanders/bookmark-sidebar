<script setup>
  import { defineProps } from 'vue';
  import { getUid } from '@utils';

  const props = defineProps({
    text: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  });

  const uid = getUid();
</script>

<template inherit-attrs="false">
  <div class="checkbox">
    <input
      type="checkbox"
      class="checkbox__el"
      :id="uid"
      :checked="modelValue"
      @change.passive="$emit('update:modelValue', $event.target.checked)"
    />
    <label :for="uid" class="checkbox__label" v-text="text" />
  </div>
</template>

<style lang="scss">
  .checkbox {
    flex: 1;

    &__label {
      position: relative;
      display: block;
      padding-left: 1.5em;

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
