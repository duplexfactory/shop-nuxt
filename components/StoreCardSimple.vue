<script setup lang="ts">
    import {PropType} from "vue";
    import IgPage from '~/models/IgPage';
    import dayjs from "dayjs";

    const {tagsLookup} = useTags()
    const {shop} = defineProps({
      shop: Object as PropType<IgPage>
    })

    const {
      pk,
      username,
      fullName,
      profilePicUrl,
      tags
    } = shop;
</script>

<template>
    <div class="p-4 text-center">

        <div class="bg-gray-300 rounded-full square-image-container mx-auto" v-lazy:background-image="profilePicUrl" style="height: 100px;"></div>

        <div class="mt-2 font-semibold text-lg">{{ username }}</div>
        <div class="mt-1 text-gray-400 text-xs line-clamp-2" style="height: 2rem">{{ fullName }}</div>
        <div class="mt-2 2xl:mt-2 line-clamp-1"
             style="font-size: 0;">
          <div v-for="tag in tags"
               :key="tag"
               class="tag mr-1 2xl:mr-2">{{ `#${tagsLookup[tag]}` }}</div>
        </div>

        <div class="mt-3">
          <nuxt-link :to="`/shop/${pk}`" class="btn-primary btn-sm">探索</nuxt-link>
        </div>

    </div>
</template>

<style>
.square-image-container {
  aspect-ratio: 1;
  @apply bg-center bg-cover;
}
</style>
