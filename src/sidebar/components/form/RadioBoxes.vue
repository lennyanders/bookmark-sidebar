<script setup>
  import { defineProps, defineEmit, ref, nextTick } from 'vue';

  import { i18n } from '@shared/utils';

  const emit = defineEmit(['update:modelValue']);

  const props = defineProps({
    text: {
      type: String,
      required: true,
    },
    options: {
      validator: (prop) => {
        if (!Array.isArray(prop)) prop = Object.values(prop);

        return prop.every(
          (item) => typeof item.value !== 'undefined' && typeof item.text === 'string',
        );
      },
      default: [
        { value: false, text: i18n('no') },
        { value: true, text: i18n('yes') },
      ],
    },
    modelValue: {
      required: true,
    },
  });

  const cssScaleX = ref(0);
  const cssTranslateX = ref('');

  const activeEl = async (el) => {
    await nextTick();

    const { offsetWidth, offsetLeft } = el;

    cssScaleX.value = offsetWidth;
    cssTranslateX.value = `${offsetLeft}px`;
  };
</script>

<template inherit-attrs="false">
  <div class="radio-checkbox">
    <span class="radio-checkbox__label">{{ text }}</span>
    <div class="radio-checkbox__options">
      <button
        type="button"
        class="radio-checkbox__option"
        v-for="{ value, text } of options"
        :key="value"
        @click.passive="emit('update:modelValue', value)"
        :disabled="value === modelValue"
        :ref="(el) => el && value === modelValue && activeEl(el)"
      >
        {{ text }}
      </button>
    </div>
  </div>
</template>

<style lang="scss">
  .radio-checkbox {
    display: flex;
    align-items: center;

    &__label {
      flex: 1;
    }

    &__options {
      box-shadow: inset 0 0 0 0.125em var(--font-color);
      position: relative;
      display: flex;

      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 100%;
        transform: translateX(v-bind('cssTranslateX')) scaleX(v-bind('cssScaleX'));
        transform-origin: left;
        background: linear-gradient(45deg, #304ffe, #2979ff);
        transition: transform 0.2s ease-in-out;
      }
    }

    &__option {
      position: relative;
      padding: 0.25em 0.5em;
    }
  }
</style>
