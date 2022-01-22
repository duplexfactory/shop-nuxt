<script setup lang="ts">

const {categories} = useTags();

</script>

<template>
  <div class="sidenav-container">

    <div v-if="open" class="backdrop" @click="hideSidebar"></div>

    <transition name="slide-side">
      <div v-if="open" class="sidenav">
        <div class="flex justify-end">
          <div @click="hideSidebar" class="cursor-pointer close-btn">&times;</div>
        </div>

          <div v-for="category in categories" :key="category['id']" >
              <button @click="toggleCategory(category['id'])" class="block py-2 text-pin" :class="{'text-pink-400': selectedCategory == category['id']}">{{ category['label'] }}</button>
              <ul v-if="selectedCategory == category['id']">
                  <li v-for="tag in category.tags" :key="tag.id" class="px-4 py-1">{{ tag.label }}</li>
              </ul>
          </div>

      </div>
    </transition>
  </div>
</template>

<script lang="ts">

export default {
  components: {  },
  data() : {
    selectedCategory: string,
  } {
    return {
      selectedCategory: ''
    }
  },
  props: {
    open: Boolean
  },
  methods: {
    hideSidebar() {
      // this.$store.dispatch('nav/toggleSidebar')
      this.$emit('toggleDrawer')
    },
    toggleCategory(categoryId: string) {
      this.selectedCategory = this.selectedCategory == categoryId ? '' : categoryId;
    }
  },
  watch: {
    '$route.fullPath': {
      handler: function (v, o) {
        (this as any).$emit('closeDrawer');
      },
      deep: true
    }
  },
  computed: {

  }
}
</script>


<style scoped>
.sidenav-container {
  height: 100%;
  width: 100%;
}
.sidenav {
  height: 100%;
  width: 300px;
  background-color: #fff;
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  /*padding-left: 30px;*/
  /*padding-right: 30px;*/
  padding: 30px;
}
.sidenav span {
  /*position: absolute;*/
  /*right: 20px;*/
  /*top: 20px;*/
}
.backdrop {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
}
.slide-side-enter-active,
.slide-side-leave-active {
  transition: all 0.3s ease-out;
}
.slide-side-enter-from,
.slide-side-leave-to {
  transform: translateX(-100%);
}

.close-btn {
  line-height: 44px;
  display: flex;
  margin-top: -8px !important;
  font-size: 40px;
  font-weight: bold;
  color: #000;
}
</style>
