<template>
  <header class="header" :class="{ 'header--searching': searchFocused }">
    <div class="header__icons header__icons--left">
      <OpenSettings />
      <LeaveSearch @click.passive="leaveSearchView" />
    </div>
    <input
      class="header__search"
      type="text"
      :placeholder="placeholder"
      v-model="searchQuery"
      @focus.passive="searchFocused = true"
      @keyup.passive.esc="leaveSearchView"
      @blur.passive="!searchQuery && (searchFocused = false)"
      ref="searchInput"
    />
    <div class="header__icons header__icons--right">
      <AddBm
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
  import OpenSettings from './actions/OpenSettings';
  import LeaveSearch from './actions/LeaveSearch';
  import AddBm from './actions/AddBm';

  export default {
    props: {
      bm: {
        type: Object,
        required: true,
      },
    },
    components: {
      OpenSettings,
      LeaveSearch,
      AddBm,
    },
  };
</script>

<script setup="props">
  import { ref, toRef } from 'vue';
  import { store, mutations } from '../store';

  export const placeholder = chrome.i18n.getMessage('searchPlaceholder');

  export const searchFocused = toRef(store, 'searchFocused');
  export const searchQuery = toRef(store, 'searchQuery');

  export const searchInput = ref(null);
  export const leaveSearchView = () => {
    searchInput.value?.blur();
    mutations.stopSearching();
  };
</script>

<style lang="scss">
  .header {
    position: relative;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: auto 1fr auto;
    padding: 0.5rem 0.5rem 0 0.5rem;

    &::before {
      content: '';
      position: absolute;
      display: block;
      top: 0.5rem;
      right: 0.5rem;
      bottom: 0;
      left: 0.5rem;
      background: linear-gradient(45deg, #304ffe, #2979ff);
      box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.25);
      transform-origin: center bottom;
      transition: transform 0.125s;
    }

    &--searching {
      &::before {
        transform: scale(
          calc(var(--bar-width) / (var(--bar-width) - 16)),
          #{(48 / 40)}
        );
      }

      .header {
        &__icons {
          &--left {
            transform: translate(-0.25rem, -0.25rem) rotate(0.5turn);
          }
          &--right {
            transform: translate(0.25rem, -0.25rem) rotate(-0.5turn);
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
          transform: translateY(-0.25rem);
          animation: blink 0.125s cubic-bezier(0.47, 0, 0.745, 0.715);
        }
      }
    }

    &__icons {
      position: relative;
      display: flex;
      padding: 0.5rem;
      transition: transform 0.125s;
      z-index: 1;
    }

    &__icon {
      width: 1.5rem;
      height: 1.5rem;
      fill: #fafafa;
      transition: opacity 0.125s, visibility 0.125s;

      &--secondary {
        opacity: 0;
        visibility: hidden;
        transform: scale(-1);
        margin-left: -1.5rem;
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
