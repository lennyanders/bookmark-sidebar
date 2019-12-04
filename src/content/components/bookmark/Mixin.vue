<script>
  import EditBm from '../actions/EditBm.vue';
  import EventBus from '../../eventBus';

  import { store, mutations } from '../../store/index';
  import { actions } from '../../api/index';

  export default {
    components: {
      EditBm
    },
    props: ['bm', 'isSearching', 'url', 'index', 'parentId'],
    methods: {
      moveBookmarkBy(delta) {
        if (delta > 0) delta++;

        actions.moveBm({
          id: this.bm.id,
          index: this.bm.index + delta
        });

        EventBus.$once('bookmarks-updated', async () => {
          await this.$nextTick();
          this.$refs.focusableBmPart.focus();
        });
      },
      //
      // functions for arrow navigation
      //
      selectPrevBm() {
        if (this.index) {
          EventBus.$emit('select-bm', this.parentId, this.index - 1);
        } else {
          EventBus.$emit('select-bm', this.$parent.parentId, this.$parent.index);
        }
      },
      selectNextBm() {
        if (this.showChildren) {
          EventBus.$emit('select-bm', this.uid, 0);
        } else {
          const { parentId, index } =
            this.index + 1 === this.$parent.bm.children.length
              ? this.$parent
              : this;

          EventBus.$emit('select-bm', parentId, index + 1);
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
      EventBus.$on('select-bm', this.selectBm);
    },
    beforeDestroy() {
      EventBus.$off('select-bm', this.selectBm);
    }
  };
</script>