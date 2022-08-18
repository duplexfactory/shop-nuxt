<script setup lang="ts">

const route = useRoute();
const router = useRouter();
const isLoggedIn = useIsLoggedIn();
watch(
    () => isLoggedIn.value,
    async (isLoggedIn, prevIsLoggedIn) => {
      if (isLoggedIn === true) {
        console.log("Signed in.")
      }
      if (isLoggedIn === false) {
        // Redirect.
        console.log("Signed out.")
        await router.replace("/login/shop");
      }
    }
)

const tabs: {route: string, title: string}[] = [
  {route: "account", title: "我的帳戶"},
  {route: "shop", title: "商店資料"},
  {route: "media-list", title: "我的貼文"},
  {route: "e-commerce", title: "網店設定"},
  {route: "order-list", title: "我的訂單"},
]

</script>

<template>
    <div class="container mx-auto mt-4 md:mt-0">

      <div class="mb-4 text-lg flex">
        <nuxt-link v-for="tab in tabs"
                   :key="tab.route"
                   :to="`/my/${tab.route}`"
                   class="px-5 py-2"
                   :class="{'tab-selected': route.path.includes(`/my/${tab.route}`)}">{{ tab.title }}</nuxt-link>
      </div>

      <nuxt-child></nuxt-child>
    </div>
</template>

<style scoped>

.tab-selected {
  @apply border-b-4 border-pink-400;
}

</style>
