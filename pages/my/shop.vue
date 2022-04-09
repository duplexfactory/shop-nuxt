<script setup lang="ts">

import {useIsLoggedIn} from "~/composables/states";

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


const {data} = await useFetch(`/api/shop?id=43808406274`);
const {page: shop} = data.value

const {categories, tagsLookup} = useTags()
const selectedTag = ref("");
function addSelectedTag() {
  if (shop.tags.includes(selectedTag.value)) {
    return;
  }
  shop.tags.push(selectedTag.value);
}

</script>

<template>
    <div class="container mx-auto">

      <div class="info-group">
        <div class="md:text-xl font-bold">
          基本資料
        </div>

        <div class="mt-2 flex items-center">
          <span>名稱</span>
          <input v-model="shop.username" class="ml-2 text-input-primary flex-1" type="text" name="username" placeholder="名稱"/>
        </div>
        <div class="mt-2 flex items-center">
          <span>全名</span>
          <input v-model="shop.fullName" class="ml-2 text-input-primary flex-1" type="text" name="fullName" placeholder="全名"/>
        </div>
        <div class="mt-2">
          描述
          <textarea v-model="shop.biography"
                    class="mt-1 w-full border rounded-md p-2"
                    rows="5"></textarea>
        </div>
        <div class="mt-2">
          <div>分類</div>
          <div class="flex items-center">
            <select class="border rounded-sm" v-model="selectedTag">
              <option value="" selected>選擇分類</option>
              <optgroup v-for="category in categories" :key="category['id']" :label="category['label']">
                <option v-for="tag in category.tags" :key="tag.id" :value="tag.id">{{ tag.label }}</option>
              </optgroup>
            </select>
            <button class="btn-sm btn-outline ml-2" @click="addSelectedTag">+</button>
          </div>
          <div class="mt-1">
            <div v-for="tag in shop.tags"
                 :key="tag"
                 class="tag border rounded-md p-2 mt-1 mr-2">
              {{ `#${tagsLookup[tag]}` }}
              <button @click="shop.tags = shop.tags.filter((t) => t !== tag)"><i class="spr-cancel"></i></button>
            </div>
          </div>
        </div>
        <button @click="" class="mt-4 btn btn-primary">儲存</button>
      </div>


      <div class="info-group mt-4">
        <div class="md:text-xl font-bold">
          詳細資料
        </div>

<!--        <input v-model="username" class="mt-4 block w-full text-input-primary" type="text" name="username" placeholder="用戶名">-->
<!--        <input v-model="password" class="mt-4 block w-full text-input-primary" type="password" name="password" placeholder="密碼">-->
<!--        <input v-model="confirmPassword" @keyup.enter="register" class="mt-4 block w-full text-input-primary" type="password" name="reenter-password" placeholder="重新輸入密碼">-->
        <button @click="" class="mt-4 btn btn-primary">儲存</button>
      </div>


    </div>
</template>

<style scoped>

.info-group {
  @apply bg-white rounded-md border p-4;
}

</style>