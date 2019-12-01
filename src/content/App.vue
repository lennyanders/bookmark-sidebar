<template>
  <transition name="bookmark-bar" v-if="bm.id" appear>
    <div
      v-show="barVisible"
      class="bookmark-bar"
      :class="{
        'bookmark-bar--left': barLeft,
        'bookmark-bar--light': activeTheme === 'light',
        'bookmark-bar--dark': activeTheme === 'dark'
      }"
      :style="{ width: barWidth + 'px' }"
      @click.stop
      @keydown.stop
      @keydown.up.down.prevent
    >
      <TheHeader
        :isSearching.sync="isSearching"
        :searchQuery.sync="searchQuery"
        :bm="bm"
      />
      <main class="main">
        <ul v-if="bm.children.length" @keyup.esc="stopSearching">
          <bookmark
            v-for="(bm, i) of bm.children"
            :key="bm.id"
            :index="i"
            :parentId="uid"
            :bm="bm"
            :isSearching="isSearching"
            :url="url"
          />
        </ul>
        <span v-else>Nothing found</span>
      </main>
      <modal />
      <resize />
    </div>
  </transition>
</template>

<script>
  import TheHeader from './components/TheHeader.vue';
  import Bookmark from './components/bookmark/Bookmark.vue';
  import Modal from './components/modal/Modal.vue';
  import Resize from './components/Resize.vue';

  import { fuzzy } from 'fast-fuzzy';
  import { store, getters } from './store/index';
  import { request } from './api';

  export default {
    components: {
      TheHeader,
      Bookmark,
      Modal,
      Resize
    },
    data() {
      return {
        barVisible:
          !location.href.startsWith('chrome-extension') ||
          location.href.endsWith('?bar=open'),
        url: location.href,
        isSearching: false,
        searchQuery: '',
        filters: ['-t', '-u', '-b', '-f']
      };
    },
    computed: {
      barWidth: () => store.barWidth,
      barLeft: () => store.barLeft,
      activeTheme: () => store.activeTheme,
      bm() {
        let searchQuery = this.searchQuery.trim();

        if (!searchQuery) return store.bm;

        const activeFilters = this.filters.filter(filter => {
          if (
            searchQuery.indexOf(`${filter} `) === 0 ||
            searchQuery.includes(` ${filter} `) ||
            searchQuery.indexOf(` ${filter}`) ===
              searchQuery.length - filter.length - 1
          ) {
            searchQuery = searchQuery.replace(new RegExp(filter, 'gi'), '');
            return true;
          }
        });
        console.log(activeFilters);

        const res = getters
          .flattenedBms()
          .reduce((bms, bm) => {
            const titleScore = fuzzy(searchQuery, bm.title),
              urlScore = bm.url ? fuzzy(searchQuery, bm.url) : 0,
              score = Math.max(titleScore, urlScore);

            if (score < 0.8) return bms;
            bm.score = score;

            if (!activeFilters.includes('-u') && activeFilters.includes('-t')) {
              if (titleScore < 0.8) return bms;
              bm.score = titleScore;
            }
            if (!activeFilters.includes('-t') && activeFilters.includes('-u')) {
              if (urlScore < 0.8) return bms;
              bm.score = urlScore;
            }
            if (!activeFilters.includes('-f') && activeFilters.includes('-b')) {
              if (!bm.url) return bms;
            }
            if (!activeFilters.includes('-b') && activeFilters.includes('-f')) {
              if (bm.url) return bms;
            }
            return [...bms, bm];
          }, [])
          .sort((a, b) => {
            // sort by best match
            return b.score - a.score;
          });

        return { ...store.bm, children: res };
      }
    },
    methods: {
      hideBar(e) {
        if (e.type === 'blur' && document.activeElement.tagName !== 'IFRAME')
          return;

        this.barVisible = false;
      },
      toggleBarVisibility() {
        this.url = location.href;
        this.barVisible = !this.barVisible;
      },
      stopSearching() {
        this.isSearching = false;
        this.searchQuery = '';
      }
    },
    beforeCreate() {
      this.uid = request.uid();
    },
    created() {
      window.addEventListener('toggleBar', this.toggleBarVisibility);

      document.body.addEventListener('click', this.hideBar);
      window.addEventListener('blur', this.hideBar);
    },
    beforeDestroy() {
      window.removeEventListener('toggleBar', this.toggleBarVisibility);

      document.body.removeEventListener('click', this.hideBar);
      window.removeEventListener('blur', this.hideBar);
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
    --bm-focus-color: #{scale-color($bg-color, $lightness: -15%)};

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
    --bm-focus-color: #{scale-color($bg-color, $lightness: 15%)};

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

    &-enter-active,
    &-leave-active {
      transition: transform 0.25s ease;
    }

    &-enter,
    &-leave-to {
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
