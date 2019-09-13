import EditBm from '../actions/EditBm.vue';
import Event from '../../Event';
import store from '../../store';

const BookmaekMixin = {
  components: {
    EditBm
  },
  props: ['bm'],
  methods: {
    selectPrevBm() {
      if (this.$parent.bm.index) {
        Event.$emit(
          'select-bm',
          this.$parent.bm.parentId,
          this.$parent.bm.index - 1
        );
      } else {
        Event.$emit(
          'select-bm',
          this.$parent.$parent.$parent.bm.parentId,
          this.$parent.$parent.$parent.bm.index
        );
      }
    },
    selectNextBm() {
      if (this.showChildren) {
        Event.$emit('select-bm', this.$parent.bm.id, 0);
      } else {
        const { parentId, index } =
          this.$parent === this.$parent.$parent.$children.slice(-1)[0]
            ? this.$parent.$parent.$parent.bm
            : this.$parent.bm;

        Event.$emit('select-bm', parentId, index + 1);
      }
    }
  },
  mounted() {
    Event.$on('select-bm', (parentId, index) => {
      if (
        this.$parent.bm.parentId === parentId &&
        this.$parent.bm.index === index
      )
        this.$refs.focusableBmPart.focus();
    });

    const dragHandle = this.$refs.dragHandle;
    dragHandle.draggable = true;

    dragHandle.addEventListener('dragstart', e => {
      this.showChildren = false;

      store.dragY = e.offsetY;
      store.dragBmEl = this.$el;
    });

    dragHandle.addEventListener('dragenter', e => {
      if (store.dragBmEl !== this.$el)
        store.dragBmNewParentId = this.$parent.bm.parentId;

      this.$el.parentNode.insertBefore(
        store.dragBmEl,
        e.offsetY < store.dragY ? this.$el.nextElementSibling : this.$el
      );
    });

    dragHandle.addEventListener('dragend', e => {
      const newParent =
        this.$parent.bm.parentId !== store.dragBmNewParentId
          ? store.dragBmNewParentId
          : 0;

      let newIndex = [...this.$el.parentNode.childNodes].indexOf(this.$el);
      if (!newParent && newIndex > this.$parent.bm.index) newIndex++;

      store.port.postMessage({
        type: 'move',
        id: this.$parent.bm.id,
        ...(newParent && { parentId: newParent }),
        index: newIndex
      });
    });
  }
};

export default BookmaekMixin;
