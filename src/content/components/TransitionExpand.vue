<template>
  <transition
    :name="name"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
  >
    <slot />
  </transition>
</template>

<script>
  export default {
    props: ['name'],
    methods: {
      enter(el) {
        el.style.height = 'auto';
        const height = el.scrollHeight;
        el.style.height = 0;
        setTimeout(() => {
          el.style.height = height + 'px';
        });
      },
      afterEnter(el) {
        el.style.height = 'auto';
      },
      leave(el) {
        const height = el.scrollHeight;
        el.style.height = height + 'px';
        setTimeout(() => {
          el.style.height = 0;
        });
      }
    }
  };
</script>