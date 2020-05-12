<template>
  <Transition
    name="bookmark-bar"
    enter-active-class="bookmark-bar--appearing"
    leave-active-class="bookmark-bar--disappearing"
    enter-from-class="bookmark-bar--invisible"
    leave-to-class="bookmark-bar--invisible"
    @after-enter="focusBar"
    appear
  >
    <div
      v-if="bm && bm.id"
      v-show="barVisible"
      class="bookmark-bar"
      :class="{
        'bookmark-bar--left': barLeft,
        'bookmark-bar--light': activeTheme === 'light',
        'bookmark-bar--dark': activeTheme === 'dark'
      }"
      :style="{ width: `${barWidth}px` }"
      tabindex="-1"
      @click.stop
      @keydown.stop
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

  import { store, mutations } from './store/index';

  export default {
    components: {
      TheHeader,
      BaseBookmark,
      TheModal,
      TheResizer
    },
    data() {
      return {
        barVisible:
          !location.href.startsWith('chrome-extension') ||
          location.href.endsWith('?bar=open')
      };
    },
    computed: {
      barWidth: () => store.barWidth,
      barLeft: () => store.barLeft,
      activeTheme: () => store.activeTheme,
      bm: () => store.filteredBms
    },
    methods: {
      hideBar(e) {
        if (e.type === 'blur' && document.activeElement.tagName !== 'IFRAME')
          return;

        this.barVisible = false;
      },
      toggleBarVisibility() {
        store.url = location.href;
        this.barVisible = !this.barVisible;
      },
      stopSearching: mutations.stopSearching,
      focusBar() {
        this.$refs.root?.focus();
      }
    },
    created() {
      addEventListener('toggleBar', this.toggleBarVisibility);

      addEventListener('click', this.hideBar);
      addEventListener('blur', this.hideBar);
    },
    beforeDestroy() {
      removeEventListener('toggleBar', this.toggleBarVisibility);

      removeEventListener('click', this.hideBar);
      removeEventListener('blur', this.hideBar);
    }
  };
</script>

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
  * {
    font-family: 'Lato', Arial, Helvetica, sans-serif;
    color: var(--font-color);
    font-size: 15px;
  }

  .bookmark-bar {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-rows: 50px 1fr;
    background-color: var(--bg-color);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
    z-index: 999999999;
    will-change: scroll-position;

    $bar: &;

    &,
    &--light {
      @include lightTheme();
    }

    &--dark {
      @include darkTheme();
    }

    &:not(&--light) {
      @media (prefers-color-scheme: dark) {
        @include darkTheme();
      }
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
      transform: translateX(calc(100% + 10px));

      &#{$bar}--left {
        transform: translateX(calc(-100% - 10px));
      }
    }
  }

  .main {
    padding: 8px 4px 8px 8px;
    overflow: hidden scroll;
    will-change: transform;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar-color);
      box-shadow: inset 0 8px var(--bg-color), inset 0 -8px var(--bg-color);
    }
  }
</style>
