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

  const showMediaModal =  useShowMediaModal();
  const showingMediaModalData = useShowingMediaModalData();

  const showSearchModal =  useShowSearchModal();

  watch(
      showMediaModal,
      (show, prevShow) => {
          show ? document.body.classList.add('overflow-hidden') : document.body.classList.remove('overflow-hidden');
      }
  )

  watch(
      showSearchModal,
      (show, prevShow) => {
        show ? document.body.classList.add('overflow-hidden') : document.body.classList.remove('overflow-hidden');
      }
  )

</script>

<script lang="ts">
  export default {

    data(): {
      drawerOpen: boolean
    } {
      return {
        drawerOpen: false
      }
    },
    methods: {
      toggleDrawer() {
        console.log('toggleDrawer');
        this.drawerOpen = !this.drawerOpen;
      }
    },
  }
</script>

<style>
</style>
