<script setup lang="ts">

const route = useRoute();
const router = useRouter();
const isLoggedIn = useIsLoggedIn();
const isIgConnected = useIsIgConnected();
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

</script>

<template>
    <div class="container mx-auto mt-8">

      <div class="mb-4 text-lg flex">
        <nuxt-link to="/my/account" class="px-5 py-2" :class="{'tab-selected': route.path.includes('/my/account')}">我的帳戶</nuxt-link>
        <nuxt-link v-if="isIgConnected" to="/my/shop" class="px-5 py-2" :class="{'tab-selected': route.path.includes('/my/shop')}">我的商店</nuxt-link>
      </div>

      <nuxt-child></nuxt-child>
    </div>
</template>

<style scoped>

.tab-selected {
  @apply border-b-4 border-pink-400;
}

</style>
