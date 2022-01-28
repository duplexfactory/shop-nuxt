<template>
  <div class="min-h-screen flex flex-col">
    <top-header @toggleDrawer="toggleDrawer"></top-header>

    <DFDrawer @toggleDrawer="toggleDrawer" :open="drawerOpen"></DFDrawer>

    <div class="flex-1">
      <slot/>

      <transition name="modal">
        <MediaModal v-model:showModal="showMediaModal" :mediaCode="showingMediaCode"></MediaModal>
      </transition>
    </div>

    <bottom-footer></bottom-footer>
  </div>
</template>

<script setup lang="ts">
  import {useShowingMediaCode, useShowMediaModal} from "~/composables/states";

  const showMediaModal = useShowMediaModal();
  const showingMediaCode = useShowingMediaCode();
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
    }
  }
</script>

<style>
</style>
