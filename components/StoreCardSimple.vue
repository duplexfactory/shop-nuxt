<template>
    <div class="p-4 text-center">

<!--        <div class="rounded-full image-container aspect-square mx-auto" v-lazy:background-image="profilePicUrl" style="height: 100px;"></div>-->

        <nuxt-link :to="`/shop/${username}`" class="mt-2 font-semibold text-lg hover:underline">{{ username }}</nuxt-link>
<!--        <div class="mt-1 text-gray-400 text-xs line-clamp-2" style="height: 2rem">{{ fullName }}</div>-->
        <div class="mt-2 text-sm text-gray-500">{{ `${shop.followerCount? "粉絲 " + shop.followerCount + " • " : ""}貼文 ${shop.mediaCount}` }}</div>
        <div class="mt-2 2xl:mt-2 line-clamp-1"
             style="font-size: 0;">
          <div v-for="tag in tags"
               :key="tag"
               class="tag mr-1 2xl:mr-2">{{ `#${tagsLookup[tag]}` }}</div>
        </div>

        <div class="mt-3">
          <nuxt-link :to="`/shop/${username}`" class="btn-primary btn-sm">探索</nuxt-link>
        </div>

    </div>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {PageSearch} from "~/models/PageSearch";

const {tagsLookup} = useTags()
const {shop} = defineProps({
  shop: Object as PropType<PageSearch>
})

const {
  _id,
  username,
  fullName,
  profilePicUrl,
  tags
} = shop;
</script>
