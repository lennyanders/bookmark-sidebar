<template>
  <li class="bookmark" @keyup.left="hideChildren">
    <div
      class="bookmark__content"
      @keydown.down.exact="goBy(1)"
      @keydown.up.exact="goBy(-1)"
      @keydown.down.alt.exact="() => !isSearching && moveBy(1)"
      @keydown.up.alt.exact="() => !isSearching && moveBy(-1)"
      @keydown.down.alt.ctrl.exact="() => !isSearching && moveIn(1)"
      @keydown.up.alt.ctrl.exact="() => !isSearching && moveIn(-1)"
      @click.right.exact="e => showOptionsOnRightClick && editBm(e)"
      :draggable="!isSearching"
      @dragstart="e => !isSearching && dragStart(e)"
      @dragenter="e => !isSearching && dragEnter(e)"
      @dragend="e => !isSearching && dragEnd(e)"
    >
      <button
        class="bookmark__link"
        @click="childrenVisible = !childrenVisible"
        @keyup.right="childrenVisible = true"
        @mousedown.middle.prevent
        @click.middle="openChildren"
        :title="bm.title"
        @focus="setActiveBm"
        ref="focusableBmPart"
      >
        <svg class="bookmark__icon" viewBox="0 0 24 24">
          <path
            v-if="bm.children.length"
            d="M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"
          />
          <path
            v-else
            d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
          />
        </svg>
        <span class="bookmark__title">{{ bm.title }}</span>
      </button>
      <add-bm :bm="bm" />
      <edit-bm :bm="bm" />
    </div>
    <transition-expand v-if="bm.children.length" :name="'bookmark__children'">
      <ul class="bookmark__children" v-show="childrenVisible">
        <BaseBookmark v-for="bm of bm.children" :key="bm.id" :bm="bm" />
      </ul>
    </transition-expand>
  </li>
</template>

<script>
  import Mixin from './Mixin';

  import AddBm from '../actions/AddBm';
  import TransitionExpand from '../TransitionExpand';
  const BaseBookmark = () => import('./BaseBookmark');

  export default {
    mixins: [Mixin],
    components: {
      AddBm,
      TransitionExpand,
      BaseBookmark
    },
    data() {
      return {
        childrenVisible: false
      };
    },
    methods: {
      openChildren() {
        if (this.bm.children.length > 4) return;
        this.bm.children.map(({ url }) => {
          if (url) window.open(url);
        });
      },
      hideChildren(e) {
        if (!this.childrenVisible) return;

        e.stopPropagation();
        this.childrenVisible = false;
        this.$refs.focusableBmPart.focus();
      },
      updateBmChildrenVisible() {
        this.bm.childrenVisible = this.childrenVisible;
      }
    },
    watch: {
      childrenVisible: {
        handler: 'updateBmChildrenVisible'
      },
      bm: {
        handler: 'updateBmChildrenVisible'
      },
      'bm.children.length'(newVal, oldVal) {
        if (newVal > oldVal) this.childrenVisible = true;
      }
    }
  };
</script>
