<script>
  import EditBm from '../actions/EditBm';

  import { store, mutations } from '../../store/index';
  import { actions } from '../../api/index';

  import { findFocusableBm, findBmToMoveIn } from '../../utils';

  export default {
    components: {
      EditBm
    },
    props: ['bm'],
    computed: {
      isSearching: () => store.isSearching,
      isActive() {
        return this.bm.id === store.activeBm;
      }
    },
    methods: {
      editBm(e) {
        if (!store.showOptionsOnRightClick) return;

        e.preventDefault();
        mutations.showModal('ModalEditBm', this.bm);
      },
      setActiveBm() {
        store.activeBm = this.bm.id;
      },
      setFocus() {
        if (this.isActive) this.$refs.focusableBmPart.focus();
      },
      //
      // functions for arrow navigation
      //
      goBy(delta) {
        const bm = findFocusableBm(this.bm.id, delta);
        if (bm.id) store.activeBm = bm.id;
      },
      moveBy(delta) {
        if (!delta || this.isSearching) return;
        if (delta > 0) delta++;

        actions.moveBm({
          id: this.bm.id,
          index: this.bm.index + delta
        });
      },
      moveIn(delta) {
        if (!delta || this.isSearching) return;

        const { id, parentId, children, index } = findBmToMoveIn(
          this.bm.id,
          delta
        );

        if (!children) return this.moveBy(delta);

        if (children.some(bm => bm.id === this.bm.id)) {
          return actions.moveBm({
            id: this.bm.id,
            parentId: parentId,
            index: delta > 0 ? index + 1 : index
          });
        }

        return actions.moveBm({
          id: this.bm.id,
          parentId: id,
          ...(delta > 0 && { index: 0 })
        });
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
        store.dragY = e.offsetY;
        store.dragEl = this.$el;
      },
      dragEnter(e) {
        if (store.dragEl !== this.$el) store.newBmParentId = this.bm.parentId;

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
      isActive: {
        handler: 'setFocus'
      },
      'bm.index': {
        handler: 'setFocus'
      }
    },
    mounted() {
      this.setDragAndDrop();
    }
  };
</script>