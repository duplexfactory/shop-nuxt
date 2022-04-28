<template>

    <div class="sm:(border rounded-md p-4 grid) grid-cols-12 gap-8 relative">

      <nuxt-link class="absolute w-full h-full" :to="`/shop/${shop.username}`"></nuxt-link>

      <div class="link-container col-span-3">
        <div v-if="verifiedPage"
             class="hidden sm:(block mb-2) rounded-full image-container aspect-square"
             v-lazy:background-image="shop.profilePicUrl"
             style="height: 70px;"></div>

        <div class="font-semibold text-lg truncate">
          <a class="hover:underline" :href="`https://www.instagram.com/${shop.username}/`" target="_blank">{{ shop.username }}</a>
        </div>

        <div class="hidden sm:block text-gray-400 font-light text-xs">最後活躍 {{ lastActive }}</div>

        <div class="mt-2 2xl:mt-4 hidden sm:flex text-sm text-gray-500">
          <div v-if="shop.followerCount" class="text-center flex-1">
            <div>粉絲</div>
            <div>{{ shop.followerCount.toLocaleString() }}</div>
          </div>
          <div class="bg-gray-300 mx-2" style="width: 1px;"></div>
          <div class="text-center flex-1">
            <div>貼文</div>
            <div>{{ shop.mediaCount.toLocaleString() }}</div>
          </div>
        </div>

        <div class="mt-2 2xl:mt-4 line-clamp-2"
             style="font-size: 0;">
          <div v-for="tag in shop.tags"
               :key="tag"
               class="tag mr-1 2xl:mr-2">{{ `#${tagsLookup[tag]}` }}</div>
        </div>

      </div>

      <div v-if="verifiedPage" class="link-container col-span-8 text-sm overflow-hidden">
        <div class="mt-2 text-gray-500 truncate">{{ shop.fullName }}</div>
        <div class="mt-2 text-gray-500 line-clamp-2">{{ shop.biography }}</div>
        <div v-if="shop.brickAndMortar" class="mt-2 text-sm text-gray-500">
          {{ '門市：' + shop.locations.join('、') }}
        </div>
        <div class="mt-2 sm:mt-4 flex flex-row">
          <div v-for="i in shop.mediaCodes" :key="i.toString()"
               class="mr-2 image-container aspect-square"
               style="height: 100px;"
               v-lazy:background-image="$imageUrl(i)"></div>
        </div>
      </div>
      <!-- flex flex-col flex-wrap -->
      <div v-else class="link-container col-span-8 text-gray-500 text-xs mt-2 sm:mt-0">
        <div v-for="(pageInfoRow, i) in pageInfoRows" :key="pageInfoRow.value + i.toString()" class="mb-1">
          <i class="mr-2" :class="pageInfoRow.iconClass"></i>
          <component :is="pageInfoRow.link ? 'a' : 'span'"
                     class="break-words"
                     :class="{'hover:underline': pageInfoRow.link}"
                     target="_blank"
                     :href="pageInfoRow.link">{{ pageInfoRow.value }}</component>
        </div>
        <div class="mt-2 sm:mt-4 flex flex-row">
          <div v-for="i in shop.mediaCodes" :key="i.toString()"
               class="mr-2 image-container aspect-square"
               style="height: 100px;"
               v-lazy:background-image="$imageUrl(i)"></div>
        </div>
      </div>

    </div>



    <!--<div class="overflow-hidden border rounded-md grid grid-cols-2">-->
        <!--<div class="p-4 col-span-1">-->
            <!--<div class="relative h-full">-->
                <!--<div class="rounded-full image-container aspect-square" :style="`background-image: url(${profilePicUrl});`" style="height: 60px;"></div>-->

                <!--<div class="mt-1 2xl:mt-2 overflow-hidden">-->
                    <!--<div class="font-semibold text-lg truncate">{{ username }}</div>-->
                    <!--<div class="text-gray-400 font-light text-xs">最後活躍 {{ lastActive }}</div>-->
                <!--</div>-->

                <!--<div class="mt-2 2xl:mt-4 text-sm text-gray-500 flex flex-row">-->
                    <!--<div class="text-center" style="flex: 1;">-->
                        <!--<div>粉絲</div>-->
                        <!--<div>{{ followerCount.toLocaleString() }}</div>-->
                    <!--</div>-->
                    <!--<div class="bg-gray-300 mx-2" style="width: 1px;"></div>-->
                    <!--<div class="text-center" style="flex: 1;">-->
                        <!--<div>貼文</div>-->
                        <!--<div>{{ mediaCount.toLocaleString() }}</div>-->
                    <!--</div>-->
                <!--</div>-->

                <!--<div class="mt-2 2xl:mt-4 line-clamp-2"-->
                     <!--style="font-size: 0;">-->
                    <!--<tag v-for="tag in tags"-->
                         <!--:key="tag"-->
                         <!--class="mr-1 2xl:mr-2"-->
                         <!--:title="tagsLookup[tag]"></tag>-->
                <!--</div>-->

                <!--<button class="mt-2 2xl:mt-4 btn-outline btn-primary-hover absolute" style="bottom: 0px;">進入店鋪</button>-->
            <!--</div>-->
        <!--</div>-->

        <!--<div class="col-span-1">-->
            <!--<div class="image-container aspect-square" :style="`background-image: url(${mediaUrls[0]});`"></div>-->
            <!--<div class="bg-white" style="height: 2px;"/>-->
            <!--<div class="block lg:flex flex-row">-->
                <!--<div class="bg-red-300 image-container aspect-square" style="flex: 1;" :style="`background-image: url(${mediaUrls[1]});`"></div>-->
                <!--<div style="width: 2px;"></div>-->
                <!--<div class="bg-green-300 image-container aspect-square" style="flex: 1;" :style="`background-image: url(${mediaUrls[2]});`"></div>-->
            <!--</div>-->
        <!--</div>-->
    <!--</div>-->
</template>

<script setup lang="ts">
import {PropType} from "vue";
import IgPage from '~/models/IgPage';
import {PageSearch} from "~/models/PageSearch";
import dayjs from "dayjs";
import PageInfoRow from "~/models/PageInfoRow";

const {tagsLookup} = useTags()
const {shop} = defineProps({
  shop: Object as PropType<IgPage | PageSearch>
})
//
// const {
//     username,
//     fullName,
//     biography,
//     lastActivity,
//     followerCount,
//     mediaCount,
//     mediaUrls,
//     profilePicUrl,
//     tags,
//     brickAndMortar,
//     locations,
// } = shop;
// const lastActive = dayjs(lastActivity * 1000).format('DD/MM/YYYY');

const pageInfoRows = computed(() => PageInfoRow.rowsFromPage(shop));
const lastActive = computed(() => dayjs(shop.lastActivity * 1000).format('DD/MM/YYYY'));

const verifiedPage = false;
</script>

<style scoped>

.link-container {
  @apply relative pointer-events-none z-1;
}

.link-container a {
  pointer-events: all;
}

</style>
