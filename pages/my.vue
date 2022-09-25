<script setup lang="ts">

import {accountTabs} from "~/data/ui";
import {IgPageCommerceData} from "~/models/IgPageCommerceData";

const igPageId = useIgPageId()
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

const selectedTab = computed(() => {
  return accountTabs.find((t) => route.path.includes(`/my/${t.route}`))
})

const pageCommerceData = ref<IgPageCommerceData>(null)
async function fetchPageCommerceData() {
  if (!igPageId.value) {
    return
  }
  const {
    data,
    pending,
    error
  } = await useContentKeyedLazyFetch(`/api/shop/id/${igPageId.value}/commerce-data`)
  watch(pending, () => {
    if (!error.value)
      pageCommerceData.value = data.value.commerceData
  }, {immediate: true})
}
watch(igPageId, fetchPageCommerceData, {immediate: true})

const {
  isSubscribed
} = useIsSubscribed()
const isIgConnected = useIsIgConnected()
const tabs = computed(() => {
  let tabs = accountTabs
  if (!isSubscribed.value) {
    tabs = accountTabs.filter((t) => ![
      "e-commerce",
      "order-list"
    ].includes(t.route))
  }
  if (!isIgConnected.value) {
    tabs = accountTabs.filter((t) => ![
      "media-list",
      "e-commerce",
      "order-list"
    ].includes(t.route))
  }
  if (!pageCommerceData.value) {
    tabs = accountTabs.filter((t) => ![
      "order-list"
    ].includes(t.route))
  }
  return tabs
})

</script>

<template>
    <div class="container mx-auto mt-4 md:mt-0">
      <div class="hidden md:flex mb-4">
        <nuxt-link v-for="tab in tabs"
                   :key="tab.route"
                   :to="`/my/${tab.route}`"
                   class="px-2 lg:px-4 py-2"
                   :class="{'tab-selected': route.path.includes(`/my/${tab.route}`)}">{{ tab.title }}</nuxt-link>
      </div>
      <div v-if="!!selectedTab" class="flex md:hidden mb-4">
        <div style="width: 4px;" class="bg-pink-400 items-stretch mr-2"></div>
        <div class="text-lg">{{ selectedTab.title }}</div>
      </div>
      <nuxt-child></nuxt-child>
    </div>
</template>

<style scoped>

.tab-selected {
  @apply border-b-4 border-pink-400;
}

</style>
