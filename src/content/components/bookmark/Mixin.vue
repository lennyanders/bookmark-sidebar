<script>
  import EditBm from '../actions/EditBm.vue';

  import { store, mutations } from '../../store/index';
  import { actions } from '../../api/index';

  export default {
    components: {
      EditBm
    },
    props: ['bm', 'isSearching', 'url', 'index', 'parentId'],
    computed: {
      isActive() {
        return this.bm.id === store.activeBm;
      }
    },
    methods: {
      setActiveBm() {
        store.activeBm = this.bm.id;
      },
      moveBookmarkBy(delta) {
        if (!delta) return;
        if (delta > 0) delta++;

        actions.moveBm({
          id: this.bm.id,
          index: this.bm.index + delta
        });

        this.$root.$once('bookmarks-updated', async () => {
          await this.$nextTick();
          this.$refs.focusableBmPart.focus();
        });
      },
      moveBookmarkIn(delta) {
        console.log(delta, store);
      },
      //
      // functions for arrow navigation
      //
      goBy(delta) {
        mutations.walkActiveBmBy(delta);
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
      },
      isActive(newVal) {
        if (newVal) this.$refs.focusableBmPart.focus();
      }
    },
    mounted() {
      this.setDragAndDrop();
    }
  };
</script>