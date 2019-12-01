<template functional>
  <div class="checkbox">
    <input
      type="checkbox"
      class="checkbox__el"
      :id="($options.uid = $options.getUid())"
      :checked="props.value"
      @change="listeners.input($event.target.checked)"
    />
    <label :for="$options.uid" class="checkbox__label">{{ props.text }}</label>
  </div>
</template>

<script>
  import { request } from '../../api';

  export default {
    getUid: request.uid
  };
</script>

<style lang="scss">
  .checkbox {
    flex: 1;

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