<template>
  <div class="min-h-screen flex flex-col">
    <top-header @toggleDrawer="toggleDrawer"></top-header>

    <DFDrawer @toggleDrawer="toggleDrawer" :open="drawerOpen"></DFDrawer>

    <div class="flex-1">
      <slot/>

      <transition name="modal">
        <MediaModal v-model:showModal="showMediaModal"></MediaModal>
      </transition>

      <transition name="modal">
        <SearchModal v-model:showModal="showSearchModal"></SearchModal>
      </transition>

    </div>

    <bottom-footer></bottom-footer>
  </div>
</template>

<script setup lang="ts">
  import {useShowingMediaModalData, useShowMediaModal} from "~/composables/states";

  // Media Modal
  const showMediaModal =  useShowMediaModal();
  const showingMediaModalData = useShowingMediaModalData();
  watch(showMediaModal, (show, prevShow) => toggleOverflow(show))

  // Search Modal
  const showSearchModal =  useShowSearchModal();
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

</script>

<style>
</style>
