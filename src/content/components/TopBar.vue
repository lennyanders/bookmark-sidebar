<template>
  <header class="header" :class="{ 'header--searching': isSearching }">
    <div class="header__icons header__icons--left">
      <open-settings />
      <leave-search :click="leaveSearchView" />
    </div>
    <input
      class="header__search"
      type="text"
      :placeholder="placeholder"
      :value="searchQuery"
      @keyup.esc="leaveSearchView"
      @input="updateSearchQuery"
      @focus="$emit('update:isSearching', true)"
      @blur="!searchQuery.trim() && leaveSearchView()"
      ref="searchInput"
    />
    <div class="header__icons header__icons--right">
      <add-bm
        :btn-classes="['header__icon', 'header__icon--primary']"
        :icn-classes="[]"
        :bm="bm"
      />
      <svg class="header__icon header__icon--secondary" viewBox="0 0 24 24">
        <path d="M3 13h12v-2H3m0-5v2h18V6M3 18h6v-2H3v2z" />
      </svg>
    </div>
  </header>
</template>

<script>
  import OpenSettings from './actions/OpenSettings.vue';
  import LeaveSearch from './actions/LeaveSearch.vue';
  import AddBm from './actions/AddBm.vue';

  export default {
    components: {
      OpenSettings,
      LeaveSearch,
      AddBm
    },
    props: ['isSearching', 'searchQuery', 'bm'],
    computed: {
      placeholder() {
        return chrome.i18n.getMessage(
          this.isSearching ? 'searchPlaceholderActive' : 'searchPlaceholder'
        );
      }
    },
    methods: {
      leaveSearchView() {
        this.$refs.searchInput.blur();
        this.$emit('update:isSearching', false);
        this.$emit('update:searchQuery', '');
      },
      updateSearchQuery(e) {
        this.$emit('update:searchQuery', e.target.value);
      }
    }
  };
</script>

<style lang="scss">
  .header {
    position: relative;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 42px 1fr 42px;
    padding: 8px 8px 0 8px;

    &::before {
      content: '';
      position: absolute;
      display: block;
      top: 8px;
      right: 8px;
      bottom: 0;
      left: 8px;
      // background-color: rgb(51, 103, 214);
      background: linear-gradient(45deg, #304ffe, #2979ff);

      box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
      transform-origin: center bottom;
      transition: transform 0.125s;
    }

    &--searching {
      &::before {
        transform: scale(calc(320 / 304), calc(50 / 42));
      }

      .header {
        &__icons {
          &--left {
            transform: translate(-4px, -4px) rotate(0.5turn);
          }
          &--right {
            transform: translate(4px, -4px) rotate(-0.5turn);
          }
        }
        &__icon {
          &--primary {
            opacity: 0;
            visibility: hidden;
          }
          &--secondary {
            opacity: 1;
            visibility: visible;
          }
        }
        &__search {
          transform: translateY(-4px);
          animation: blink 0.125s cubic-bezier(0.47, 0, 0.745, 0.715);
        }
      }
    }

    &__icons {
      position: relative;
      padding: 9px;
      transition: transform 0.125s;
      z-index: 1;
    }

    &__icon {
      position: absolute;
      width: 24px;
      height: 24px;
      fill: #fafafa;
      transition: opacity 0.125s, visibility 0.125s;

      &--secondary {
        opacity: 0;
        visibility: hidden;
        transform: scale(-1);
      }
    }

    &__search {
      color: #fafafa;
      transition: transform 0.125s;
      z-index: 1;

      &::placeholder {
        color: var(--search-placeholder-color);
      }

      &:focus {
        outline: none;
      }
    }
  }

  @keyframes blink {
    from {
      opacity: 0.5;
    }
  }
</style>