<script setup lang="ts">

import {accountTabs} from "~/data/ui";

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

</script>

<template>
    <div class="container mx-auto mt-4 md:mt-0">
      <div class="hidden md:flex mb-4">
        <nuxt-link v-for="tab in accountTabs"
                   :key="tab.route"
                   :to="`/my/${tab.route}`"
                   class="px-2 lg:px-4 py-2"
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
