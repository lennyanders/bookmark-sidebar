<template functional>
  <div class="input">
    <label class="input__label" :for="($options.uid = $options.getUid())">{{
      props.text
    }}</label>
    <input
      class="input__el"
      :id="$options.uid"
      :type="data.attrs.type || 'text'"
      :value="data.attrs.value"
      @input="listeners.input($event.target.value)"
      :required="data.attrs.required"
      :disabled="data.attrs.disabled"
    />
  </div>
</template>

<script>
  import { request } from '../../api';

  export default {
    getUid: request.uid
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