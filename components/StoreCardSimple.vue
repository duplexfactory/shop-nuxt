<script setup lang="ts">
    import {PropType} from "vue";
    import IgPage from '~/models/IgPage';

    const {tagsLookup} = useTags()
    const {shop} = defineProps({
      shop: Object as PropType<IgPage>
    })

    const {
      username,
      lastActivity,
      followerCount,
      mediaCount,
      mediaUrls,
      profilePicUrl,
      tags
    } = shop;
    const lastActiveDate = new Date(lastActivity * 1000);
    const lastActive = `${lastActiveDate.getDate()}/${lastActiveDate.getMonth() + 1}/${lastActiveDate.getFullYear()}`;
    const description = 'description';
</script>

<template>
    <div class="p-4 text-center">
        <div class="bg-gray-300 rounded-full square-image-container mx-auto" :style="`background-image: url(${profilePicUrl});`" style="height: 100px;"></div>

        <div class="mt-2 font-semibold text-lg">{{ username }}</div>
        <div class="mt-1 2xl:mt-2 line-clamp-1"
             style="font-size: 0;">
          <tag v-for="tag in tags"
               :key="tag"
               class="mr-1 2xl:mr-2"
               :title="tagsLookup[tag]"></tag>
        </div>

        <button class="mt-4 btn-primary btn-sm">探索</button>

    </div>
</template>

<style>
.square-image-container {
  aspect-ratio: 1;
  @apply bg-center bg-cover;
}
</style>
