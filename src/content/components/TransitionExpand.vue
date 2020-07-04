<script>
  import { h, Transition } from 'vue';

  export default (props, { slots }) =>
    h(
      Transition,
      {
        ...props,
        onEnter(el) {
          el.style.height = 'auto';
          const height = el.scrollHeight;
          el.style.height = 0;
          requestAnimationFrame(() => {
            el.style.height = height + 'px';
          });
        },
        onAfterEnter(el) {
          el.style.height = 'auto';
        },
        onLeave(el) {
          const height = el.scrollHeight;
          el.style.height = height + 'px';
          requestAnimationFrame(() => {
            el.style.height = 0;
          });
        },
      },
      slots,
    );
</script>
