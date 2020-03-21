<template>
  <li class="bookmark" @keyup.left="hideChildren">
    <div
      class="bookmark__content"
      @keydown.down.exact="selectNextBm"
      @keydown.up.exact="selectPrevBm"
      @keydown.shift.down="moveBookmarkBy(1)"
      @keydown.shift.up="moveBookmarkBy(-1)"
      ref="dragHandle"
    >
      <button
        @click="showChildren = !showChildren"
        @keyup.right="showChildren = true"
        @mousedown.middle.prevent
        @click.middle="openChildren"
        :title="bm.title"
        ref="focusableBmPart"
      >
        <div class="bookmark__link">
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
        </div>
      </button>
      <add-bm :bm="bm" />
      <edit-bm :bm="bm" />
    </div>
    <transition-expand v-if="bm.children.length" :name="'bookmark__children'">
      <ul class="bookmark__children" v-show="showChildren">
        <BaseBookmark
          v-for="(bm, i) of bm.children"
          :key="bm.id"
          :index="i"
          :parentId="uid"
          :bm="bm"
          :isSearching="isSearching"
        />
      </ul>
    </transition-expand>
  </li>
</template>

<script>
  import Mixin from './Mixin.vue';

  import AddBm from '../actions/AddBm.vue';
  import TransitionExpand from '../TransitionExpand.vue';
  const BaseBookmark = () => import('./BaseBookmark.vue');

  import { request } from '../../api';

  export default {
    mixins: [Mixin],
    components: {
      AddBm,
      TransitionExpand,
      BaseBookmark
    },
    data() {
      return {
        showChildren: false
      };
    },
    methods: {
      openChildren() {
        this.bm.children.map(({ url }) => {
          if (url) window.open(url);
        });
      },
      hideChildren(e) {
        if (this.showChildren) {
          e.stopPropagation();
          this.showChildren = false;
          this.$refs.focusableBmPart.focus();
        }
      }
    },
    beforeCreate() {
      this.uid = request.uid();
    }
  };
</script>
