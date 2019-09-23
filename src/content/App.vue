<template>
  <transition name="bookmark-bar" v-if="bm" appear>
    <div
      class="bookmark-bar"
      v-show="barVisible"
      @click.stop
      @keydown.stop
      @keydown.up.right.down.left.prevent
    >
      <c-header :searchQuery.sync="searchQuery" :bmId="bm.id" />
      <main class="main">
        <ul v-if="bm.children.length" @keyup.esc="stopSearching">
          <bookmark
            v-for="(bm, i) of bm.children"
            :key="bm.id"
            :index="i"
            :parentId="_uid"
            :bm="bm"
          />
        </ul>
        <span v-else>Nothing found</span>
      </main>
      <modal />
    </div>
  </transition>
</template>

<script>
  import CHeader from './components/CHeader.vue';
  import Bookmark from './components/bookmark/Bookmark.vue';
  import Modal from './components/modal/Modal.vue';

  import { fuzzy } from 'fast-fuzzy';

  export default {
    components: {
      CHeader,
      Bookmark,
      Modal
    },
    data() {
      return {
        searchQuery: '',
        filters: ['-t', '-u', '-b', '-f']

        // group 1: title, url:
        // only title => search by title
        // only url => search by url

        // group 2: bookmark, folder:
        // only bookmark => remove folders
        // only folder => remove bookmarks
      };
    },
    computed: {
      bm() {
        let searchQuery = this.searchQuery.trim();

        if (!searchQuery) return this.$store.state.bm;

        let activeFilters = this.filters.filter(filter => {
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

        let res = this.$store.getters.flattenedBms
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

        return { ...this.$store.state.bm, children: res };
      },
      barVisible() {
        return this.$store.state.barVisible;
      }
    },
    methods: {
      stopSearching() {
        this.$store.commit('stopSearching');
        this.searchQuery = '';
      }
    }
  };
</script>

<style lang="scss">
  @import 'reset';

  :host {
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

    @media (prefers-color-scheme: dark) {
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
    width: 320px;
    display: grid;
    grid-template-rows: 50px 1fr;
    background-color: var(--bg-color);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
    z-index: 999999999;

    &-enter-active,
    &-leave-active {
      transition: transform 0.25s ease;
    }

    &-enter,
    &-leave-to {
      transform: translateX(calc(100% + 10px));
    }
  }

  .main {
    overflow: hidden scroll;
    padding: 8px 4px 8px 8px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar-color);
      box-shadow: inset 0 8px var(--bg-color), inset 0 -8px var(--bg-color);
    }
  }
</style>