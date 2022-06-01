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
          <ul v-if="selectedCategory == category['id']">
            <li v-for="tag in category.tags" :key="tag.id" class="px-4 py-1 cursor-pointer" @click="tagPressed(tag.id)">{{ tag.label }}</li>
          </ul>
        </div>
      </div>

      <hr class="my-4"/>

      <div class="font-semibold py-2">設定</div>
      <div>
        <div v-if="isLoggedIn" class="py-2">
          <nuxt-link to="/my/account" @click="hideSidebar">我的帳戶</nuxt-link>
        </div>
        <div v-if="isLoggedIn" class="py-2">
          <nuxt-link to="/my/shop" @click="hideSidebar">我的商店</nuxt-link>
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
      <button v-if="isLoggedIn" @click="hideSidebar(); logout();" class="block btn btn-outline text-center w-full">登出</button>
    </div>

  </div>
</template>

<script setup lang="ts">

import {useShowAgeRestrictedModal} from "~/composables/states";

const {ageRestrictedCategories} = useTags();

const showAgeRestrictedModal = useShowAgeRestrictedModal();

// Login
const isLoggedIn = useIsLoggedIn();
const {
  logout
} = useLogout();

</script>

<script lang="ts">

export default {
  components: {  },
  data() : {
    selectedCategory: string,
  } {
    return {
      selectedCategory: "",
    }
  },
  props: {
    open: Boolean
  },
  methods: {
    hideSidebar() {
      this.$emit('toggleDrawer')
    },
    toggleCategory(categoryId: string) {
      this.selectedCategory = this.selectedCategory == categoryId ? '' : categoryId;
    },
    tagPressed(tagId: string) {
      this.$router.push({path: '/search', query: { tag: tagId }});
      this.hideSidebar();
    }
  },
  computed: {

  },
  watch: {
    showAgeRestrictedModal: function () {
      if (this.showAgeRestrictedModal && this.open) {
        this.hideSidebar()
      }
    }
  }
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
