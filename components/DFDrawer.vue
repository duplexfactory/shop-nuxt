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
      <template v-if="selectedBottomTabIndex == 0">
        <div v-for="category in ageRestrictedCategories" :key="category['id']" >
          <button @click="toggleCategory(category['id'])" class="block py-2" :class="{'text-pink-400': selectedCategory == category['id']}">{{ category['label'] }}</button>
          <ul v-if="selectedCategory == category['id']">
            <li v-for="tag in category.tags" :key="tag.id" class="px-4 py-1" @click="tagPressed(tag.id)">{{ tag.label }}</li>
          </ul>
        </div>
      </template>
      <template v-else>
        <div class="py-2">
          <AgeRestrictionToggle />
        </div>
<!--        <div class="py-2">-->
<!--          <div @click="goTo('/verify')">認證我的商店</div>-->
<!--        </div>-->
<!--        <div class="py-2">-->
<!--          <div @click="goTo('/login/shop')">商戶登入</div>-->
<!--        </div>-->
      </template>


    </div>

    <div class="flex">
      <button v-for="(tab, i) in bottomTabs"
              :key="tab"
              :class="{'border-pink-400': selectedBottomTabIndex == i}"
              class="border-top-4 flex-1 text-center p-2"
              @click="selectedBottomTabIndex = i">
        {{ tab }}
      </button>
    </div>


  </div>
</template>

<script setup lang="ts">
import {useShowAgeRestrictedModal} from "~/composables/states";

const {ageRestrictedCategories} = useTags();

const showAgeRestrictedModal = useShowAgeRestrictedModal();

</script>

<script lang="ts">

export default {
  components: {  },
  data() : {
    selectedCategory: string,
    bottomTabs: string[],
    selectedBottomTabIndex: number
  } {
    return {
      selectedCategory: "",
      bottomTabs: [
          "分類",
          "設定"
      ],
      selectedBottomTabIndex: 0
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
    },
    goTo(path: string) {
      this.$router.push({path: path});
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
