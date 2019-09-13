<template>
  <button :class="btnClasses" @click="addBm">
    <svg :class="icnClasses" viewBox="0 0 24 24">
      <title>Add bookmark or folder</title>
      <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    </svg>
  </button>
</template>

<script>
  import Event from '../../Event';

  export default {
    props: {
      btnClasses: {
        default: () => ['bookmark__option']
      },
      icnClasses: {
        default: () => ['bookmark__icon']
      },
      parentId: String
    },
    methods: {
      addBm() {
        Event.$emit('show-modal', 'add', { parentId: this.parentId });
      }
    }
  };
</script>