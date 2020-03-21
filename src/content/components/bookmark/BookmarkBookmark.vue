<template>
  <li class="bookmark" ref="bm">
    <div
      class="bookmark__content"
      @keydown.down.exact="goBy(1)"
      @keydown.up.exact="goBy(-1)"
      @keydown.down.alt.exact="moveBy(1)"
      @keydown.up.alt.exact="moveBy(-1)"
      @keydown.down.alt.ctrl.exact="moveBookmarkIn(1)"
      @keydown.up.alt.ctrl.exact="moveBookmarkIn(-1)"
      ref="dragHandle"
    >
      <a
        class="bookmark__link"
        :class="{ 'bookmark__link--active': isOpen }"
        :href="bm.url"
        :title="bm.title + ' | ' + bm.url"
        @focus="setActiveBm"
        ref="focusableBmPart"
      >
        <img class="bookmark__icon" :src="bm.faviconDataUrl" />
        <span class="bookmark__title">{{ bm.title }}</span>
      </a>
      <edit-bm :bm="bm" />
    </div>
  </li>
</template>

<script>
  import Mixin from './Mixin.vue';

  export default {
    mixins: [Mixin],
    computed: {
      isOpen() {
        return this.bm.url === this.url;
      }
    }
  };
</script>