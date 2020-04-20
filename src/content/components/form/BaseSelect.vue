<template functional>
  <div class="select">
    <label class="select__label" :for="($options.uid = $options.getUid())">{{
      props.text
    }}</label>
    <select
      class="select__el"
      :id="$options.uid"
      :value="props.value"
      @input="listeners.input($event.target.value)"
    >
      <option
        v-for="{ text, value } of props.options"
        :key="value"
        :value="value"
        >{{ text }}</option
      >
    </select>
  </div>
</template>

<script>
  import { getUid } from '../../utils';

  export default {
    getUid,
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
  .select {
    &__label {
      display: block;
      margin-bottom: 5px;
    }

    &__el {
      background-color: var(--bg-color);
    }
  }
</style>