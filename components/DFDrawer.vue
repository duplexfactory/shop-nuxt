<template>
  <div class="sidenav">

    <Teleport to="body">
      <div v-if="open" class="backdrop" @click="hideSidebar"></div>
    </Teleport>

    <div class="px-4 pt-4 flex justify-end">
      <button @click="hideSidebar">
        <i class="spr-cancel text-2xl"></i>
      </button>
    </div>

    <div class="p-4 flex-1 overflow-y-auto">

      <div class="font-semibold py-2">商店分類</div>
      <div>
        <div v-for="category in ageRestrictedCategories" :key="category['id']" >
          <button @click="toggleCategory(category['id'])" class="block py-2" :class="{'text-pink-400': selectedCategory == category['id']}">{{ category['label'] }}</button>
          <div class="overflow-hidden">
            <transition name="accordion">
              <ul v-if="selectedCategory == category['id']">
                <li v-for="tag in category.tags" :key="tag.id" class="px-4 py-1 cursor-pointer" @click="tagPressed(tag.id)">{{ tag.label }}</li>
              </ul>
            </transition>
          </div>
        </div>
      </div>

      <hr class="my-4"/>

      <div class="font-semibold py-2">設定</div>
      <div>
        <div v-for="tab in tabs"
             v-if="isLoggedIn"
             :key="tab.route"
             class="py-2">
          <nuxt-link :to="`/my/${tab.route}`"
                     @click="hideSidebar">{{ tab.title }}</nuxt-link>
        </div>

        <div class="py-2">
          <AgeRestrictionToggle/>
        </div>
      </div>

      <hr class="my-4"/>
    </div>
    <div class="p-4">
      <nuxt-link v-if="!isLoggedIn" to="/login/shop" @click="hideSidebar" class="block btn btn-primary text-center w-full mb-4">商戶登入</nuxt-link>
      <nuxt-link v-if="!isLoggedIn" to="/verify" @click="hideSidebar" class="block btn btn-outline text-center w-full">認證我的商店</nuxt-link>
      <button v-if="isLoggedIn" @click="clickLogout" class="block btn btn-outline text-center w-full">登出</button>
    </div>

  </div>
</template>

<script setup lang="ts">

import {accountTabs} from "~/data/ui"

const {ageRestrictedCategories} = useTags()
const router = useRouter()

const props = defineProps({
  open: {type: Boolean, default: false}
})
const {
  open
} = toRefs(props)

const emit = defineEmits(["toggleDrawer"])

const showAgeRestrictedModal = useShowAgeRestrictedModal()
watch(showAgeRestrictedModal, () => {
  if (showAgeRestrictedModal.value && open.value) {
    hideSidebar()
  }
})

// Login
const isLoggedIn = useIsLoggedIn()
const {
  logout
} = useLogout()
function clickLogout() {
  hideSidebar()
  logout()
}

const {
  isSubscribed
} = useIsSubscribed()
const tabs = computed(() => {
  if (isSubscribed.value) {
    return accountTabs
  }
  return accountTabs.filter((t) => [
    "account",
    "shop"
  ].includes(t.route))
})

function hideSidebar() {
  emit('toggleDrawer')
}

function tagPressed(tagId: string) {
  router.push({path: '/search', query: { tag: tagId }})
  hideSidebar()
}

const selectedCategory = ref("")
function toggleCategory(categoryId: string) {
  selectedCategory.value = selectedCategory.value == categoryId ? '' : categoryId;
}

</script>

<style scoped>

.sidenav {
  width: 300px;
  background-color: #fff;
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;

  @apply h-full flex flex-col overflow-hidden;
}
.sidenav span {
  /*position: absolute;*/
  /*right: 20px;*/
  /*top: 20px;*/
}
.backdrop {
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;

  @apply h-full w-full;
}
.slide-side-enter-active,
.slide-side-leave-active {
  transition: all 0.3s ease-out;
}
.slide-side-enter-from,
.slide-side-leave-to {
  transform: translateX(-100%);
}

</style>
