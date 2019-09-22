<script>
  import EditBm from '../actions/EditBm.vue';
  import Event from '../../Event';

  export default {
    components: {
      EditBm
    },
    props: ['bm', 'index', 'parentId'],
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
          dragHandle.addEventListener('dragstart', dragStart);
          dragHandle.addEventListener('dragenter', dragEnter);
          dragHandle.addEventListener('dragend', dragEnd);
        } else {
          dragHandle.removeEventListener('dragstart', dragStart);
          dragHandle.removeEventListener('dragenter', dragEnter);
          dragHandle.removeEventListener('dragend', dragEnd);
        }
      },
      dragStart(e) {
        this.showChildren = false;
        this.$store.commit('setDragY', e.offsetY);
        this.$store.commit('setDragEl', this.$el);
      },
      dragEnter(e) {
        if (this.$store.state.dragEl !== this.$el)
          this.$store.commit('setNewBmParentId', this.bm.parentId);

        this.$el.parentNode.insertBefore(
          this.$store.state.dragEl,
          e.offsetY < this.$store.state.dragY
            ? this.$el.nextElementSibling
            : this.$el
        );
      },
      dragEnd() {
        const newParent =
          this.bm.parentId !== this.$store.state.newBmParentId
            ? this.$store.state.newBmParentId
            : 0;

        let newIndex = [...this.$el.parentNode.childNodes].indexOf(this.$el);
        if (!newParent && newIndex > this.bm.index) newIndex++;

        this.$store.commit('moveBm', {
          id: this.bm.id,
          ...(newParent && { parentId: newParent }),
          index: newIndex
        });
      }
    },
    computed: {
      isSearching() {
        return this.$store.state.isSearching;
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