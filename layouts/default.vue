<template>
  <div class="min-h-screen flex flex-col">
    <div v-if="isIGBrowser && !isIGHintClosed" class="py-2 px-4 bg-gray-100">
      <div class="text-xs">如在IG瀏覽器内未能正常加載，請按 "<i class="spr-dot-3 text-xs"></i>" > "瀏覽器設定" > "清除瀏覽資料" 後重新整理。</div>
      <button @click="isIGHintClosed = true" class="mt-2 text-xs">知道了</button>
    </div>

    <top-header @toggleDrawer="toggleDrawer"></top-header>

    <transition name="slide-side">
      <LazyDFDrawer v-if="drawerOpen" @toggleDrawer="toggleDrawer" :open="drawerOpen"></LazyDFDrawer>
    </transition>

    <div class="flex-1 relative">
      <slot/>

      <transition name="modal">
        <LazyMediaModal v-if="showMediaModal"></LazyMediaModal>
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
  import throttle from "lodash.throttle";

  // Meta
  const config = useRuntimeConfig();
  const route = useRoute();

  useMeta(computed(() => {
    if (route.path !== '/') {
      let canonical = route.fullPath;
      if (route.path.endsWith('/')) {
        canonical = canonical.replace(route.path, route.path.slice(0, -1));
      }
      return {
        link: [
          {rel: 'canonical', href: config.DOMAIN + canonical},
        ]
      }
    }
    else {
      return {}
    }
  }));

  // Media Modal
  const showMediaModal =  useShowMediaModal();
  const showingMediaModalData = useShowingMediaModalData();
  watch(showMediaModal, (show, prevShow) => toggleOverflow(show));

  // Search Modal
  const showSearchModal = useShowSearchModal();
  watch(showSearchModal, (show, prevShow) => toggleOverflow(show));

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

  // IG Browser
  const isIGBrowser = ref(false);
  const isIGHintClosed = ref(false);

  // Mounted
  onMounted(() => {
    if (navigator.userAgent.includes("Instagram")){
      isIGBrowser.value = true;
    }

    window.addEventListener("resize", throttle(() => {
      if (window.innerWidth >= 640) {
        // SM
        if (showSearchModal.value) {
          showSearchModal.value = false;
        }
      }
    }, 500));
  });

</script>

<style scoped>
.spr-dot-3:before {
  @apply transform rotate-90;
}
</style>