<script>
  import EditBm from '../actions/EditBm.vue';
  import Event from '../../Event';

  import { store, mutations } from '../../store/index';
  import { actions } from '../../api/index';

  export default {
    components: {
      EditBm
    },
    props: ['bm', 'isSearching', 'url', 'index', 'parentId'],
    methods: {
      //
      // functions for arrow navigation
      //
      selectPrevBm() {
        if (this.index) {
          Event.$emit('select-bm', this.parentId, this.index - 1);
        } else {
          Event.$emit('select-bm', this.$parent.parentId, this.$parent.index);
        }
      },
      selectNextBm() {
        if (this.showChildren) {
          Event.$emit('select-bm', this._uid, 0);
        } else {
          const { parentId, index } =
            this.index + 1 === this.$parent.bm.children.length
              ? this.$parent
              : this;

          Event.$emit('select-bm', parentId, index + 1);
        }
      },
      selectBm(parentId, index) {
        if (this.parentId === parentId && this.index === index)
          this.$refs.focusableBmPart.focus();
      },

      //
      // functions for dragging and dropping bookmarks
      //
      setDragAndDrop() {
        const {
          $refs: { dragHandle },
          isSearching,
          dragStart,
          dragEnter,
          dragEnd
        } = this;

        if (!isSearching) {
          dragHandle.draggable = true;
          dragHandle.addEventListener('dragstart', dragStart);
          dragHandle.addEventListener('dragenter', dragEnter);
          dragHandle.addEventListener('dragend', dragEnd);
        } else {
          dragHandle.draggable = false;
          dragHandle.removeEventListener('dragstart', dragStart);
          dragHandle.removeEventListener('dragenter', dragEnter);
          dragHandle.removeEventListener('dragend', dragEnd);
        }
      },
      dragStart(e) {
        this.showChildren = false;
        mutations.setDragY(e.offsetY);
        mutations.setDragEl(this.$el);
      },
      dragEnter(e) {
        if (store.dragEl !== this.$el)
          mutations.setNewBmParentId(this.bm.parentId);

        this.$el.parentNode.insertBefore(
          store.dragEl,
          e.offsetY < store.dragY ? this.$el.nextElementSibling : this.$el
        );
      },
      dragEnd() {
        const newParent =
          this.bm.parentId !== store.newBmParentId ? store.newBmParentId : 0;

        let newIndex = [...this.$el.parentNode.childNodes].indexOf(this.$el);
        if (!newParent && newIndex > this.bm.index) newIndex++;

        actions.moveBm({
          id: this.bm.id,
          ...(newParent && { parentId: newParent }),
          index: newIndex
        });
      }
    },
    watch: {
      isSearching: {
        handler: 'setDragAndDrop'
      }
    },
    mounted() {
      this.setDragAndDrop();
      Event.$on('select-bm', this.selectBm);
    },
    beforeDestroy() {
      Event.$off('select-bm', this.selectBm);
    }
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
        background-color: var(--bm-focus-color);

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
      fill: var(--folder-icon);
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
      will-change: height;

      &-enter-active,
      &-leave-active {
        overflow: hidden;
        transition: height 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
  }
</style>
