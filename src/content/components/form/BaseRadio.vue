<template functional>
  <fieldset class="radios">
    <legend class="radios__label">{{ props.text }}</legend>
    <div
      class="radio"
      v-for="({ value, text }, i) of props.options"
      :key="value"
    >
      <input
        class="radio__el"
        type="radio"
        :value="value"
        :id="($options.uids[i] = $options.getUid())"
        :checked="props.value === value"
        @change="listeners.input($event.target.value)"
      />
      <label class="radio__label" :for="$options.uids[i]">{{ text }}</label>
    </div>
  </fieldset>
</template>

<script>
  import { request } from '../../api';

  export default {
    getUid: request.uid,
    uids: [],
    props: {
      value: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      options: {
        type: Array,
        required: true,
        validator: array => array.every(item => item.value && item.text)
      }
    }
  };
</script>

<style lang="scss">
  .radios {
    border: 0;

    &__label {
      display: block;
      margin-bottom: 5px;
    }
  }

  .radio {
    &__label {
      padding-left: 24px;
      position: relative;

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
        border-radius: 50%;
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