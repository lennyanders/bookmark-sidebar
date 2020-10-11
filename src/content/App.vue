<template>
  <Transition
    name="bookmark-bar"
    enter-active-class="bookmark-bar--appearing"
    leave-active-class="bookmark-bar--disappearing"
    enter-from-class="bookmark-bar--invisible"
    leave-to-class="bookmark-bar--invisible"
    @after-enter="focusBar"
  >
    <div
      v-if="bm && bm.id"
      v-show="barVisible"
      class="bookmark-bar"
      :class="{
        'bookmark-bar--left': barLeft,
        'bookmark-bar--light': activeTheme === 'light',
        'bookmark-bar--dark': activeTheme === 'dark',
      }"
      tabindex="-1"
      @click.passive.stop
      @keydown.passive.stop
      @keydown.up.down.prevent
      ref="root"
    >
      <TheHeader :bm="bm" />
      <main class="main">
        <ul v-if="bm.children.length" @keyup.esc="stopSearching">
          <BaseBookmark v-for="bm of bm.children" :key="bm.id" :bm="bm" />
        </ul>
        <span v-else>Nothing found</span>
      </main>
      <TheModal />
      <TheResizer />
    </div>
  </Transition>
</template>

<script>
  import TheHeader from './components/TheHeader';
  import BaseBookmark from './components/bookmark/BaseBookmark';
  import TheModal from './components/modal/TheModal';
  import TheResizer from './components/TheResizer';

  export default {
    components: {
      TheHeader,
      BaseBookmark,
      TheModal,
      TheResizer,
    },
  };
</script>

<script setup="props">
  import { ref, toRef, onBeforeUnmount } from 'vue';
  import { store, mutations } from './store';

  export const barVisible = ref(
    !location.href.startsWith('chrome-extension') ||
      location.href.endsWith('?bar=open'),
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

  addEventListener('click', hideBar, { passive: true });
  addEventListener('blur', hideBar, { passive: true });

  onBeforeUnmount(() => {
    removeEventListener('click', hideBar, { passive: true });
    removeEventListener('blur', hideBar, { passive: true });
  });

  export const root = ref(null);
  export const focusBar = () => root.value?.focus();

  export const stopSearching = mutations.stopSearching;
  export const barWidth = toRef(store, 'barWidth');
  export const barLeft = toRef(store, 'barLeft');
  export const activeTheme = toRef(store, 'activeTheme');
  export const bm = toRef(store, 'filteredBms');
</script>

<style lang="scss" vars="{ 'bar-width': barWidth.value }">
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
  html {
    @include lightTheme();

    @media (prefers-color-scheme: dark) {
      @include darkTheme();
    }
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
    right: 0;
    bottom: 0;
    width: calc(var(--bar-width) * 1px);
    display: grid;
    grid-template-rows: auto 1fr;
    background-color: var(--bg-color);
    box-shadow: 0 0 0.25em rgba(0, 0, 0, 0.25);
    z-index: 2147483647;
    will-change: scroll-position;

    &--light {
      @include lightTheme();
    }

    &--dark {
      @include darkTheme();
    }

    &--left {
      right: auto;
      left: 0;
    }

    &--appearing,
    &--disappearing {
      transition: transform 0.25s ease;
    }

    &--invisible {
      transform: translateX(calc(100% + 0.5em));

      &.bookmark-bar--left {
        transform: translateX(calc(-100% - 0.5em));
      }
    }
  }

  .main {
    padding: 0.5em 0.25em 0.5em 0.5em;
    overflow: hidden scroll;
    will-change: transform;

    &::-webkit-scrollbar {
      width: 0.25em;
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar-color);
      box-shadow: inset 0 0.5em var(--bg-color), inset 0 -0.5em var(--bg-color);
    }
  }
</style>
