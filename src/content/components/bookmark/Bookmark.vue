<template>
  <bookmark-bookmark v-if="bm.url" :bm="bm" />
  <bookmark-folder v-else :bm="bm" />
</template>

<script>
  import BookmarkBookmark from './BookmarkBookmark.vue';
  import BookmarkFolder from './BookmarkFolder.vue';

  export default {
    components: {
      BookmarkBookmark,
      BookmarkFolder
    },
    props: ['bm']
  };
</script>

<style lang="scss">
  .bookmark {
    $bm: &;

    &__content {
      line-height: 30px;
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: 1fr auto;

      &:hover,
      &:focus-within {
        background-color: #666;

        #{$bm}__option {
          display: inherit;
        }
      }
    }
    &__link {
      display: grid;
      grid-template-columns: auto 1fr;
      position: relative;

      &--active::after {
        content: '\02022';
        position: absolute;
        top: 23px;
        left: 23px;
        margin: -4px 0 0 -4px;
        width: 8px;
        line-height: 8px;
        text-align: center;
        color: #00cdcd;
      }
    }
    &__icon {
      width: 16px;
      height: 16px;
      margin: 7px;
      fill: #ccc;
    }
    &__title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &__option {
      width: 30px;
      display: none;
    }

    &__children {
      padding-left: 18px;
      overflow: hidden;
      transition: height 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

      &-enter-active,
      &-leave-active {
        overflow: hidden;
        transition: height 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
  }
</style>