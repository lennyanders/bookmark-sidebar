<template functional>
  <button :class="props.btnClasses" @click="$options.methods.addBm(props.bm)">
    <svg :class="props.icnClasses" viewBox="0 0 24 24">
      <title>Add bookmark or folder</title>
      <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    </svg>
  </button>
</template>

<script>
  import { mutations } from '../../store/index';

  export default {
    props: {
      btnClasses: {
        default: () => ['bookmark__option']
      },
      icnClasses: {
        default: () => ['bookmark__icon']
      },
      bm: Object
    },
    methods: {
      addBm: bm => mutations.showModal('ModalAddBm', bm)
    }
  };
</script>