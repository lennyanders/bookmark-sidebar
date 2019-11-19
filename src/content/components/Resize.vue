<template>
  <div
    class="resizer"
    :class="{ 'resizer--right': barLeft, 'resizer--resizing': dragging }"
    @mousedown.prevent="startResizing"
  />
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      dragging: false
    };
  },
  computed: mapState(['barLeft']),
  methods: {
    ...mapMutations(['setBarWidth']),
    ...mapActions(['saveBarWidth']),
    startResizing() {
      this.dragging = true;
      window.addEventListener('mousemove', this.resize);
      window.addEventListener('mouseup', this.stopResizing);
    },
    stopResizing() {
      this.saveBarWidth();
      this.dragging = false;
      window.removeEventListener('mousemove', this.resize);
      window.removeEventListener('mouseup', this.stopResizing);
    },
    resize(e) {
      this.setBarWidth(this.barLeft ? e.x : document.body.scrollWidth - e.x);
    }
  }
};
</script>

<style lang="scss">
.resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
  transform: translateX(-50%);
  cursor: col-resize;
  z-index: 2;

  &--right {
    left: auto;
    right: 0;
    transform: translateX(50%);
  }

  &--resizing {
    width: 20px;
  }
}
</style>
