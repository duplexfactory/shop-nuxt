<template>
  <div class="min-h-screen flex flex-col" :class="showLoginLoading ? 'h-screen overflow-hidden' : ''">

    <notifications position="top right" style="z-index: 9999; top: 8px"/>

    <div v-if="isIgConnected && !isIgAuthTokenValid" class="container bg-red-100 text-gray-800 text-xs py-2">
      由於你更改了Instagram帳戶密碼或基於安全理由，Facebook已經暫停了你的帳戶連結。為確保你的專頁在Shoperuse上正常運作，請儘快至 "我的帳戶" 解除連結後重新連結。
      <nuxt-link class="hover:underline font-semibold" to="/my/account">立即前往</nuxt-link>
    </div>

    <div v-if="isIGBrowser && !isIGHintClosed" class="py-2 px-4 bg-gray-100">
      <div class="text-xs">如在IG瀏覽器内未能正常加載，請按 "<i class="spr-dot-3 text-xs"></i>" > "瀏覽器設定" > "清除瀏覽資料" 後重新整理。</div>
      <button @click="isIGHintClosed = true" class="mt-2 text-xs">知道了</button>
    </div>

    <top-header @toggleDrawer="toggleDrawer"></top-header>

    <transition name="slide-side">
      <LazyDFDrawer v-if="drawerOpen" @toggleDrawer="toggleDrawer" :open="drawerOpen"></LazyDFDrawer>
    </transition>

    <div class="flex-1 relative" :class="showLoginLoading ? 'overflow-hidden' : ''">

      <!-- Login fullscreen loading -->
      <div v-if="showLoginLoading"
           class="absolute z-50 flex flex-col justify-center items-center inset-0 bg-white"
           style="min-width: 100%; min-height: 100%;">
        <div>
          <i class="spr-spin4 animate-spin text-6xl text-pink-400"></i>
        </div>
      </div>

      <slot/>

      <transition name="modal">
        <LazyMediaModal v-if="showMediaModal"></LazyMediaModal>
      </transition>

      <transition name="modal">
        <LazySearchModal v-if="showSearchModal" v-model:showModal="showSearchModal"></LazySearchModal>
      </transition>

      <transition name="modal">
        <LazyAgeRestrictedModal v-if="showAgeRestrictedModal"></LazyAgeRestrictedModal>
      </transition>

    </div>

    <lazy-component @show="showFooter = true;">
      <LazyBottomFooter v-if="showFooter"></LazyBottomFooter>
    </lazy-component>

  </div>
</template>

<script setup lang="ts">
  import {
    ScreenSize
  } from "~/composables/states"
  import throttle from "lodash.throttle"
  import {onAuthStateChanged, User} from "firebase/auth"

  // Meta
  const config = useRuntimeConfig()
  const route = useRoute()

  useMeta(computed(() => {
    if (route.path !== "/") {
      let canonical = route.fullPath
      if (route.path.endsWith("/")) {
        canonical = canonical.replace(route.path, route.path.slice(0, -1))
      }
      return {
        link: [
          {rel: "canonical", href: config.DOMAIN + canonical},
        ]
      }
    } else {
      return {}
    }
  }))

  // Media Modal
  const showMediaModal = useShowMediaModal()
  const showingMediaModalData = useShowingMediaModalData()
  watch(showMediaModal, (show, prevShow) => toggleOverflow(show))

  // Search Modal
  const showSearchModal = useShowSearchModal()
  watch(showSearchModal, (show, prevShow) => toggleOverflow(show))

  // Age Restricted Modal
  const showAgeRestrictedModal = useShowAgeRestrictedModal()

  // Drawer
  const drawerOpen = ref<boolean>(false)

  function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value
    toggleOverflow(drawerOpen.value)
  }

  function toggleOverflow(hidden: boolean) {
    hidden ? document.body.classList.add("overflow-hidden") : document.body.classList.remove("overflow-hidden")
  }

  // Show Footer
  const showFooter = ref(false)

  // IG Browser
  const isIGBrowser = ref(false)
  const isIGHintClosed = ref(false)

  // Login
  const isLoggedIn = useIsLoggedIn()
  const isIgConnected = useIsIgConnected();
  const isIgAuthTokenValid = ref(true);
  const igUsername = useIgUsername();
  const igPageId = useIgPageId();
  const currentUser = useCurrentUser()
  const isLoginLoadingRoute = computed(() => {
    return [
      "/my",
      "/login/shop"
    ].find((p) => route.path.startsWith(p))
  })
  const showLoginLoading = computed(() => {
    return isLoggedIn.value === null && isLoginLoadingRoute.value
  })

  // Screen Size
  const screenSize = useScreenSize()

  function calcScreenSize(innerWidth: number) {
    if (1536 <= innerWidth) {
      return ScreenSize.XXL
    } else if (1280 <= innerWidth) {
      return ScreenSize.XL
    } else if (1024 <= innerWidth) {
      return ScreenSize.LG
    } else if (768 <= innerWidth) {
      return ScreenSize.MD
    } else if (640 <= innerWidth) {
      return ScreenSize.SM
    } else {
      return ScreenSize.DEFAULT
    }
  }

  // Mounted
  const {
    auth,
    getAuthHeader,
    headersToObject
  } = useAuth()
  onMounted(() => {
    if (navigator.userAgent.includes("Instagram")) {
      isIGBrowser.value = true
    }

    screenSize.value = calcScreenSize(window.innerWidth)
    addEventListener("resize", throttle(() => {
      screenSize.value = calcScreenSize(window.innerWidth)
      if (screenSize.value !== ScreenSize.DEFAULT) {
        if (showSearchModal.value) {
          showSearchModal.value = false
        }
      }
    }, 500))

    onAuthStateChanged(auth.value, async (user?: User) => {
      // console.log("onAuthStateChanged");
      currentUser.value = user
      isLoggedIn.value = !!user

      if (isLoggedIn.value) {
        const {
          data,
          error
        } = await useFetch("/api/auth/check-ig-connect", {
          headers: headersToObject(await getAuthHeader()),
        })
        isIgConnected.value = data.value.connected;
        isIgAuthTokenValid.value = !data.value.invalid;
        igUsername.value = data.value.username ?? "";
        igPageId.value = data.value.pageId ?? "";
      }
      else {
        isIgConnected.value = false;
        igUsername.value = "";
        igPageId.value = "";
      }

    })
  })

</script>

<style scoped>
  .spr-dot-3:before {
    @apply transform rotate-90;
  }

  .vue-notification {
    z-index: 9999999 !important;
  }
</style>

<style>
  .vue-notification {
    z-index: 9999999 !important;
  }
</style>
