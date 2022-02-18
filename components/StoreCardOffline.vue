<script setup lang="ts">
    import {PropType} from "vue";
    import IgPage from '~/models/IgPage';
    import dayjs from "dayjs";

    const {tagsLookup} = useTags()
    const {shop} = defineProps({
        shop: Object as PropType<IgPage>
    })

    const {
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
    const description = 'description';
</script>

<template>
    <div class="overflow-hidden border rounded-md grid grid-cols-2">
        <div class="p-4 col-span-1">
            <div class="relative h-full">
                <div class="bg-gray-300 rounded-full square-image-container"
                     :style="`background-image: url(${$encryptImageUrl(profilePicUrl)});`" style="height: 60px;"></div>

                <div class="mt-1 2xl:mt-2 overflow-hidden">
                    <div class="font-semibold text-lg truncate">{{ username }}</div>
                    <div class="text-gray-500 text-xs line-clamp-2" style="height: 2rem">{{ fullName }}</div>
                </div>

                <div class="mt-2 2xl:mt-4 text-sm text-gray-500">
                    <div>門市</div>
                    <div>{{ locations.join('、') }}</div>
                </div>

                <div class="mt-2 2xl:mt-4 line-clamp-2"
                     style="font-size: 0;">
                    <div v-for="tag in tags"
                         :key="tag"
                         class="tag mr-1 2xl:mr-2">{{ `#${tagsLookup[tag]}` }}
                    </div>
                </div>

                <div class="flex flex-row absolute" style="bottom: 0px;">
                    <button class="btn-primary hidden sm:block">進入店鋪</button>
                    <!--          <button class="btn-outline ml-4" style="padding: 0px !important;">進</button>-->
                </div>

            </div>
        </div>

        <div class="col-span-1" v-if="mediaCodes">
            <div class="bg-gray-300 square-image-container" v-lazy:background-image="$imageUrl(mediaCodes[0])"></div>
            <div class="bg-white" style="height: 2px;"/>
            <div class="flex flex-row">
                <div class="bg-red-300 square-image-container" style="flex: 1;" v-lazy:background-image="$imageUrl(mediaCodes[1])"></div>
                <div style="width: 2px;"></div>
                <div class="bg-green-300 square-image-container" style="flex: 1;" v-lazy:background-image="$imageUrl(mediaCodes[2])"></div>
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

