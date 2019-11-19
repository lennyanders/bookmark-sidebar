<template>
  <li class="bookmark">
    <div
      class="bookmark__content"
      @keyup.down="selectNextBm"
      @keyup.up="selectPrevBm"
      ref="dragHandle"
    >
      <a
        class="bookmark__link"
        :class="{ 'bookmark__link--active': isActive }"
        :href="bm.url"
        :title="bm.title + ' | ' + bm.url"
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
      isActive() {
        return this.bm.url === this.url;
      }
    }
  };
</script>