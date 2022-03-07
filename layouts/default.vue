<template>
  <div class="min-h-screen flex flex-col">
    <top-header @toggleDrawer="toggleDrawer"></top-header>

    <transition name="slide-side">
      <LazyDFDrawer v-if="drawerOpen" @toggleDrawer="toggleDrawer" :open="drawerOpen"></LazyDFDrawer>
    </transition>

    <div class="flex-1">
      <slot/>

      <transition name="modal">
        <LazyMediaModal v-if="showMediaModal" v-model:showModal="showMediaModal"></LazyMediaModal>
      </transition>

      <transition name="modal">
        <LazySearchModal v-if="showSearchModal" v-model:showModal="showSearchModal"></LazySearchModal>
      </transition>

      <transition name="modal">
        <AgeRestrictedModal></AgeRestrictedModal>
      </transition>

    </div>

    <lazy-component @show="showFooter = true;">
      <LazyBottomFooter v-if="showFooter"></LazyBottomFooter>
    </lazy-component>

  </div>
</template>

<script setup lang="ts">
  import {useShowingMediaModalData, useShowMediaModal} from "~/composables/states";

  // Media Modal
  const showMediaModal =  useShowMediaModal();
  const showingMediaModalData = useShowingMediaModalData();
  watch(showMediaModal, (show, prevShow) => toggleOverflow(show))

  // Search Modal
  const showSearchModal = useShowSearchModal();
  watch(showSearchModal, (show, prevShow) => toggleOverflow(show))

  // Drawer
  const drawerOpen = ref<boolean>(false);
  function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value;
    toggleOverflow(drawerOpen.value);
  }

  function toggleOverflow(hidden: boolean) {
    hidden ? document.body.classList.add('overflow-hidden') : document.body.classList.remove('overflow-hidden');
  }

  // Show Footer
  const showFooter = ref(false);

</script>

<script lang="ts">
  import throttle from "lodash.throttle";

  export default {
    mounted() {
      window.addEventListener("resize", throttle(() => {
        if (window.innerWidth >= 640) {
          // SM
          if (this.showSearchModal) {
            this.showSearchModal = false;
          }
        }
      }, 500));
    }
  }
</script>
