<script>
  import { h } from 'vue';

  import BookmarkBookmark from './BookmarkBookmark';
  import BookmarkFolder from './BookmarkFolder';

  export default ({ bm }) => {
    return h(bm.url ? BookmarkBookmark : BookmarkFolder, { bm });
  };
</script>

<style lang="scss">
  .bookmark {
    &__content {
      display: flex;

      &:hover,
      &:focus-within {
        background-color: var(--bm-focus-color);

        .bookmark__option {
          display: inherit;
        }
      }
      &:hover {
        background-color: var(--bm-hover-color);
      }
    }
    &__link {
      overflow: hidden;
      display: flex;
      align-items: center;
      flex: 1;
      position: relative;

      &--active::after {
        content: '\02022';
        position: absolute;
        top: 1.25em;
        left: 1.25em;
        margin: -0.125em 0 0 -0.125em;
        width: 0.5em;
        line-height: 0.5em;
        text-align: center;
        color: #00cdcd;
      }
    }
    &__icon {
      width: 1em;
      height: 1em;
      margin: 0.5em;
      fill: var(--folder-icon);
    }
    &__title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &__option {
      display: none;

      & + & {
        margin-left: -0.25em;
      }
    }

    &__children {
      padding-left: 1.25em;
    }
  }
</style>
