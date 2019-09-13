<template>
  <transition name="bookmark-bar" appear>
    <div class="bookmark-bar" v-show="barVisible" @click.stop>
      <c-header :searchQuery.sync="searchQuery" :bm="bm" />
      <main class="main">
        <ul v-if="filteredBms.length">
          <bookmark v-for="bm of filteredBms" :bm="bm" :key="bm.id" />
        </ul>
        <span v-else>Nothing found</span>
      </main>
      <modal />
    </div>
  </transition>
</template>

<script>
  import store from './store';

  import CHeader from './components/CHeader.vue';
  import Bookmark from './components/bookmark/Bookmark.vue';
  import Modal from './components/modal/Modal.vue';

  export default {
    components: {
      CHeader,
      Bookmark,
      Modal
    },
    data() {
      return {
        bm: store.bm,
        searchQuery: ''
      };
    },
    computed: {
      barVisible() {
        return store.barVisible;
      },
      filteredBms() {
        const searchQuery = this.searchQuery.trim();

        if (!searchQuery) return store.bm.children;

        const res = [],
          filter = new RegExp(searchQuery, 'i');

        JSON.stringify(store.bm, (_, nestedBm) => {
          if (nestedBm && nestedBm.title && filter.test(nestedBm.title))
            res.push(nestedBm);
          return nestedBm;
        });
        return res;
      }
    }
  };
</script>

<style lang="scss">
  @import 'reset';

  @font-face {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    src: local('Lato Regular'), local('Lato-Regular'),
      url('~fonts/lato/lato-v16-latin-regular.woff2') format('woff2'),
      url('~fonts/lato/lato-v16-latin-regular.woff') format('woff');
  }

  :host,
  * {
    font-family: 'Lato';
    color: #fafafa;
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
    background-color: #333;
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
      background-color: #666;
      box-shadow: inset 0 8px #333, inset 0 -8px #333;
    }
  }
</style>