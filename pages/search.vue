<template>
  <div class="px-4 sm:px-0 sm:container mx-auto">

    <div class="grid grid-cols-12 gap-8">

      <div class="col-span-3 p-4 hidden md:block">

        <div class="font-semibold mb-2">分類</div>
        <div v-for="category in categories" :key="category['id']" class="text-sm">
          <button @click="toggleCategory(category['id'])" class="block py-1">{{ category['label'] }}</button>
          <ul v-if="selectedCategories.includes(category['id'])">
            <li v-for="tag in category.tags" :key="tag.id" class="px-4 py-1" :class="{'text-pink-400': selectedTag == tag.id}">
              <button @click="selectedTag = tag.id">{{ tag.label }}</button>
            </li>
          </ul>
        </div>

        <hr class="my-4"/>

        <div>
          <input type="checkbox" id="brick-and-mortar" name="brickAndMortar" v-model="brickAndMortar">
          <label for="brick-and-mortar" class="pl-2">實體商店</label>
        </div>
<!--        {{ brickAndMortar }}-->

        <div class="mt-4">
          <input type="checkbox" id="business-registration" name="businessRegistration" v-model="businessRegistration">
          <label for="business-registration" class="pl-2">商業登記</label>
        </div>
<!--        {{ businessRegistration }}-->

      </div>

      <div class="col-span-12 md:col-span-9">
        <div v-if="$route.query['keyword']" class="mb-4">你正在搜尋「 <span class="font-semibold">{{ $route.query['keyword'] }}</span> 」</div>

        <StoreCardRectangle :shop="page" class="mb-4"></StoreCardRectangle>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">

import StoreCardRectangle from "~/components/StoreCardRectangle.vue";

const {
  categories
} = useTags();

const page = {
  "_id": 10115857802,
  lastActivity: 0,
  "adult":false,
  "biography":"韓系 | 日系 | 復古\n付款: \nFPS/Payme/Alipay/BOC\n取貨:\n面交/旺角dream catcher格仔自取/順豐到付\n買滿200減$20💕\n全店買滿400元包順豐❤\n歡迎DM查詢商品/落單\n#服裝 #衣服 #服飾店",
  "brickAndMortar":true,
  "businessRegistration":true,
  "followerCount":242,
  "followingCount":48,
  "fullName":"vellichor香港平價女裝店✨套裝|上衣|下裝|飾品",
  "locations":["旺角"],
  "mediaCount":21,
  "mediaUrls":["https://scontent-hkg4-2.cdninstagram.com/v/t51.2885-15/e35/209209710_138399534968591_8687751114042506050_n.jpg?se=8&_nc_ht=scontent-hkg4-2.cdninstagram.com&_nc_cat=111&_nc_ohc=3dn8Nn8l2xkAX9RXoHx&edm=ABmJApABAAAA&ccb=7-4&ig_cache_key=MjYwNjU3NTIzMDUxMjgzMzAzNw%3D%3D.2-ccb7-4&oh=00_AT-Z250Ds64c1dasw0YFZx29H916pyUr8CkWOiYY7Sbgbw&oe=61F8C467&_nc_sid=6136e7","https://scontent-hkg4-2.cdninstagram.com/v/t51.2885-15/e35/209340396_321975122802093_6881023015381483978_n.jpg?se=7&_nc_ht=scontent-hkg4-2.cdninstagram.com&_nc_cat=109&_nc_ohc=z4sWX83GLXYAX-JZpJ9&edm=ABmJApABAAAA&ccb=7-4&ig_cache_key=MjYwNjU3MDQ4NzM0MjIyMjQ0MQ%3D%3D.2-ccb7-4&oh=00_AT-h8E_aWpZOFe52lbgOAXO8u24LdKF7-vvssRjyEZiAvw&oe=61F9D87A&_nc_sid=6136e7","https://scontent-hkg4-1.cdninstagram.com/v/t51.2885-15/e35/186826697_320565473026296_5575303328309618653_n.jpg?se=8&_nc_ht=scontent-hkg4-1.cdninstagram.com&_nc_cat=100&_nc_ohc=EHkBPMVIxQYAX9tqgjY&edm=ABmJApABAAAA&ccb=7-4&ig_cache_key=MjU3NjMwOTcxMTMyNzI4NjQwNg%3D%3D.2-ccb7-4&oh=00_AT-5nbU1532nN5f0s2e_rOK-dU39V2dSL-Yh8dQ1w_a4hw&oe=61F9EBB9&_nc_sid=6136e7"],"profilePicUrl":"https://scontent-hkg4-2.cdninstagram.com/v/t51.2885-19/s150x150/137274571_440337453676552_6988806912843198605_n.jpg?_nc_ht=scontent-hkg4-2.cdninstagram.com&_nc_cat=104&_nc_ohc=6sJ-KJ5LBc4AX8iS8Ds&edm=AEF8tYYBAAAA&ccb=7-4&oh=00_AT9F9FnGHdkAWK1nMbkwc8nT6UrBE5Xwd33s4y6j-f6PMg&oe=61F8CC9A&_nc_sid=a9513d",
  "tags":["apparel","women's-clothing"],
  "username":"vellichor_shop"
};

</script>

<script lang="ts">
  export default {
    data() : {
      brickAndMortar: boolean,
      businessRegistration: boolean,
      selectedCategories: string[],
      selectedTag: string,
    } {
      return {
        brickAndMortar: false,
        businessRegistration: false,
        selectedCategories: [],
        selectedTag: ''
      }
    },
    methods: {
      toggleCategory(categoryId: string) {
        if (this.selectedCategories.includes(categoryId)) {
          this.selectedCategories = this.selectedCategories.filter((c) => c != categoryId);
        }
        else {
          this.selectedCategories.push(categoryId);
        }
      }
    }
  }
</script>

<style scoped>
input {
  cursor: pointer;
}

label {
  cursor: pointer;
}

</style>
