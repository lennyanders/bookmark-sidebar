<script>
  import { h, Transition } from 'vue';

  const heightPropertyName = 'height';
  const setHeight = (el) => {
    el.style.setProperty(heightPropertyName, el.scrollHeight + 'px');
  };

  export default (props, { slots }) =>
    h(
      Transition,
      {
        ...props,
        onEnter: setHeight,
        onAfterEnter(el) {
          el.style.removeProperty(heightPropertyName);
        },
        onLeave: setHeight,
      },
      slots,
    );
</script>

<style lang="scss">
  .v-enter-from,
  .v-leave-to {
    height: 0 !important;
  }

  .v-enter-active,
  .v-leave-active {
    overflow: hidden;
    transition: height 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
</style>
