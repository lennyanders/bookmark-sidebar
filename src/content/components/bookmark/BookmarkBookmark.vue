<template>
  <li class="bookmark">
    <div
      class="bookmark__content"
      @keydown.down.up.prevent
      @keyup.down="selectNextBm"
      @keyup.up="selectPrevBm"
      ref="dragHandle"
    >
      <a
        class="bookmark__link"
        :class="{ 'bookmark__link--active': isActive }"
        :href="bm.url"
        ref="focusableBmPart"
      >
        <img class="bookmark__icon" :src="bm.faviconDataUrl" />
        <span class="bookmark__title">{{ bm.title }}</span>
      </a>
      <edit-bm :id="bm.id" :title="bm.title" :url="bm.url"></edit-bm>
    </div>
  </li>
</template>

<script>
  import store from '../../store';

  import Mixin from './Mixin';

  export default {
    mixins: [Mixin],
    computed: {
      isActive() {
        return this.bm.url === store.url;
      }
    }
  };
</script>