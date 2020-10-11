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
        top: 1.25rem;
        left: 1.25rem;
        margin: -0.125rem 0 0 -0.125rem;
        width: 0.5rem;
        line-height: 0.5rem;
        text-align: center;
        color: #00cdcd;
      }
    }
    &__icon {
      width: 1rem;
      height: 1rem;
      margin: 0.5rem;
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
        margin-left: -0.25rem;
      }
    }

    &__children {
      padding-left: 1.25rem;
    }
  }
</style>
