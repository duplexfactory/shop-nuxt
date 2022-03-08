<script setup lang="ts">
    import {PropType} from "vue";
    import IgPage from '~/models/IgPage';
    import dayjs from "dayjs";

    const {tagsLookup} = useTags()
    const {shop} = defineProps({
        shop: Object as PropType<IgPage>,
        showLocations: {type: Boolean, default: false}
    })

    const {
        pk,
        username,
        fullName,
        lastActivity,
        followerCount,
        mediaCount,
        mediaUrls,
        mediaCodes,
        profilePicUrl,
        tags,
        locations
    } = shop;
    const lastActive = dayjs(lastActivity * 1000).format('DD/MM/YYYY');
    const description = 'description';

</script>

<template>
    <div class="overflow-hidden border rounded-md grid grid-cols-2">
        <div class="p-4 col-span-1">
            <div class="relative h-full">
                <div class="hidden sm:block bg-gray-300 rounded-full square-image-container" v-lazy:background-image="profilePicUrl" style="height: 60px;"></div>

                <div class="mt-1 2xl:mt-2 overflow-hidden">
                  <div class="font-semibold text-lg truncate">
                    <a class="hover:underline" :href="`https://www.instagram.com/${username}/`" target="_blank">{{ username }}</a>
                  </div>
                  <div class="text-gray-500 text-xs line-clamp-2">{{ fullName }}</div>
                </div>

                <!-- Offline show locations -->
                <div v-if="showLocations" class="mt-2 2xl:mt-4 text-sm text-gray-500">
                  {{ '門市：' + shop.locations.join('、') }}
                </div>
                <!-- Online show followers -->
                <div v-else class="mt-2 2xl:mt-4 text-sm text-gray-500 flex flex-row">
                    <div class="text-center flex-1">
                        <div>粉絲</div>
                        <div>{{ followerCount.toLocaleString() }}</div>
                    </div>
                    <div class="bg-gray-300 mx-2" style="width: 1px;"></div>
                    <div class="text-center flex-1">
                        <div>貼文</div>
                        <div>{{ mediaCount.toLocaleString() }}</div>
                    </div>
                </div>

                <div class="mt-2 2xl:mt-4 line-clamp-2"
                     style="font-size: 0;">
                    <div v-for="tag in tags"
                         :key="tag"
                         class="tag mr-1 2xl:mr-2">{{ `#${tagsLookup[tag]}` }}</div>
                </div>

                <nuxt-link :to="`/shop/${username}`"
                           class="absolute block mt-2 2xl:mt-4 btn-outline btn-primary-hover btn-sm sm:btn" style="bottom: 0px;">進入店鋪</nuxt-link>
            </div>
        </div>

        <div class="col-span-1" v-if="mediaCodes">
            <div class="bg-gray-300 square-image-container" v-lazy:background-image="$imageUrl(mediaCodes[0])"></div>
            <div class="flex" style="margin-top: 2px;">
                <div class="bg-gray-300 square-image-container flex-1" style="margin-right: 2px;" v-lazy:background-image="$imageUrl(mediaCodes[1])"></div>
                <div class="bg-gray-300 square-image-container flex-1" v-lazy:background-image="$imageUrl(mediaCodes[2])"></div>
            </div>
        </div>
    </div>
</template>

<style>
.square-image-container {
    aspect-ratio: 1;
    @apply bg-center bg-cover;
}
</style>
