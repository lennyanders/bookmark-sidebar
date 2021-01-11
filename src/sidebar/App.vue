<script setup>
  import PseudoWindow from '@shared/components/PseudoWindow';
  import TheHeader from '@components/TheHeader.vue';
  import BookmarkList from '@components/bookmark/BookmarkList.vue';
  import TheModal from '@components/modal/TheModal.vue';
  import TheResizer from '@components/TheResizer.vue';

  import { ref, toRef, computed } from 'vue';
  import { store, mutations } from '@store';
  import { themes } from '@shared/settings';
  import { i18n } from '@shared/utils';

  const barVisible = ref(
    !location.href.startsWith('chrome-extension') || location.href.endsWith('?bar=open'),
  );

  const hideBar = (event) => {
    if (event.type === 'blur' && document.activeElement.tagName !== 'IFRAME') {
      return;
    }

    barVisible.value = false;
  };
  const toggleBarVisibility = () => {
    store.url = location.href;
    barVisible.value = !barVisible.value;
  };

  chrome.runtime.onMessage.addListener(({ command }) => {
    if (command === 'toggle-bm-bar') toggleBarVisibility();
  });

  const root = ref(null);
  const focusBar = () => root.value?.focus();

  const stopSearching = mutations.stopSearching;

  const activeTheme = toRef(store, 'activeTheme');
  const bm = toRef(store, 'filteredBms');

  const cssWidth = computed(() => `${store.barWidth}px`);
  const cssRight = computed(() => (store.barLeft ? '100%' : '0'));
  const cssInvisibleTranslateX = computed(() => (store.barLeft ? '-0.5em' : 'calc(100% + 0.5em)'));
</script>

<template>
  <PseudoWindow @click.passive="hideBar" @blur.passive="hideBar" />
  <Transition
    name="bookmark-bar"
    enter-from-class="bookmark-bar--invisible"
    leave-to-class="bookmark-bar--invisible"
    @after-enter="focusBar"
  >
    <div
      v-if="bm"
      v-show="barVisible"
      class="bookmark-bar"
      :class="{
        'bookmark-bar--light': activeTheme === themes.light.value,
        'bookmark-bar--dark': activeTheme === themes.dark.value,
      }"
      tabindex="-1"
      @click.passive.stop
      @keydown.passive.stop
      @keydown.up.down.prevent
      ref="root"
    >
      <TheHeader :bm="bm" />
      <main class="main">
        <BookmarkList v-if="bm.children.length" @keyup.esc="stopSearching" :bms="bm.children" />
        <span v-else>{{ i18n('noBookmarkFound') }}</span>
      </main>
      <TheModal />
      <TheResizer />
    </div>
  </Transition>
</template>

<style lang="scss">
  @import 'reset';

  @mixin lightTheme() {
    $bg-color: #fff;
    $font-color: #333;

    --search-placeholder-color: #{scale-color(#fafafa, $lightness: -5%)};

    --font-color: #{$font-color};
    --input-color: #{scale-color($font-color, $lightness: 15%)};
    --disabled-input-color: #{scale-color($font-color, $lightness: 50%)};

    --bg-color: #{$bg-color};
    --scrollbar-color: #{scale-color($bg-color, $lightness: -15%)};
    --bm-focus-color: #{scale-color($bg-color, $lightness: -10%)};
    --bm-hover-color: #{scale-color($bg-color, $lightness: -15%)};

    --folder-icon: #{scale-color($font-color, $lightness: 10%)};
  }

  @mixin darkTheme() {
    $bg-color: #323639;
    $font-color: #fafafa;

    --font-color: #{$font-color};
    --input-color: #{scale-color($font-color, $lightness: -15%)};
    --disabled-input-color: #{scale-color($font-color, $lightness: -50%)};

    --bg-color: #{$bg-color};
    --scrollbar-color: #{scale-color($bg-color, $lightness: 15%)};
    --bm-focus-color: #{scale-color($bg-color, $lightness: 10%)};
    --bm-hover-color: #{scale-color($bg-color, $lightness: 15%)};

    --folder-icon: #{scale-color($font-color, $lightness: -10%)};
  }

  :host,
  body {
    font-size: 16px !important;
    font-family: 'Lato', Arial, Helvetica, sans-serif !important;
    line-height: 1.5 !important;
  }

  * {
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
    color: var(--font-color);
  }

  .bookmark-bar {
    position: fixed;
    top: 0;
    right: v-bind(cssRight);
    bottom: 0;
    display: grid;
    grid-template-rows: auto 1fr;
    width: v-bind(cssWidth);
    background-color: var(--bg-color);
    box-shadow: 0 0 0.25em rgba(0, 0, 0, 0.25);
    will-change: scroll-position;
    transform: translateX(v-bind(cssRight));
    transition: transform 0.25s ease;

    &--invisible {
      transform: translateX(v-bind(cssInvisibleTranslateX));
    }

    @include lightTheme();
    @media (prefers-color-scheme: dark) {
      @include darkTheme();
    }

    &--light {
      @include lightTheme();
    }

    &--dark {
      @include darkTheme();
    }
  }

  .main {
    padding: 0.5em 0.25em 0.5em 0.5em;
    overflow: hidden scroll;
    will-change: transform;
    position: relative;

    &::-webkit-scrollbar {
      width: 0.25em;
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar-color);
      box-shadow: inset 0 0.5em var(--bg-color), inset 0 -0.5em var(--bg-color);
    }
  }
</style>
