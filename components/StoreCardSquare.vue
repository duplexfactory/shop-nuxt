<template>
    <div class="overflow-hidden border rounded-md grid grid-cols-2 cursor-pointer" @click="navigateToPage()">

        <div class="p-4 col-span-1">
            <div class="relative h-full">
                <div v-if="verifiedPage" class="hidden sm:block mb-1 2xl:mb-2 rounded-full image-container aspect-square" v-lazy:background-image="profilePicUrl" style="height: 60px;"></div>

                <div class="overflow-hidden">
                  <div class="font-semibold text-lg truncate">
                    <nuxt-link class="hover:underline" :to="`/shop/${username}`">{{ username }}</nuxt-link>
                  </div>
                  <div v-if="verifiedPage" class="text-gray-500 text-xs line-clamp-2">{{ fullName }}</div>
                </div>

                <div v-if="!igConnected && contactInfoRows.length !== 0">
                  <a v-for="(pageInfoRow, i) in contactInfoRows"
                     @click.stop=""
                     :key="pageInfoRow.value + i.toString()"
                     :href="pageInfoRow.link"
                     target="_blank">
                    <i class="mr-1"
                       :style="`color: #${contactColor(pageInfoRow.key)}`"
                       :class="pageInfoRow.iconClass"></i>
                  </a>
                </div>

                <div class="mt-2 2xl:mt-4 text-sm text-gray-500 flex flex-row">
                    <div class="text-sm flex-1">
                      <div class="text-gray-500">粉絲</div>
                      <div class="font-semibold text-gray-800">{{ formatMetric(followerCount) }}</div>
                    </div>
                    <div class="text-sm flex-1">
                      <div class="text-gray-500">貼文</div>
                      <div class="font-semibold text-gray-800">{{ formatMetric(mediaCount) }}</div>
                    </div>
                </div>

                <div v-if="showLocations && addressInfoRow" class="mt-2 2xl:mt-4 text-sm text-gray-500 flex items-start">
                  <span><i class="mr-2" :class="addressInfoRow.iconClass"></i></span>
                  <component :is="addressInfoRow.link ? 'a' : 'span'"
                             @click="stopPropagation($event, !!addressInfoRow.link)"
                             class="break-all"
                             :class="{'hover:underline': addressInfoRow.link}"
                             target="_blank"
                             :href="addressInfoRow.link">
                    <span v-if="addressInfoRow.link" class="md:hidden">查看地址</span>
                    <span :class="addressInfoRow.link ? 'hidden md:inline-block' : ''">{{ addressInfoRow.value }}</span>
                  </component>
                </div>

                <div v-if="tags.length !== 0"
                     class="mt-2 2xl:mt-4 line-clamp-1 md:line-clamp-2"
                     style="font-size: 0;">
                  <div v-for="tag in tags"
                       :key="tag"
                       class="tag mr-1 2xl:mr-2">{{ `#${tagsLookup[tag]}` }}</div>
                </div>

<!--                <nuxt-link :to="`/shop/${username}`"-->
<!--                           class="absolute block mt-2 2xl:mt-4 btn-outline btn-primary-hover btn-sm sm:btn" style="bottom: 0px;">進入店鋪</nuxt-link>-->
            </div>
        </div>

        <div class="col-span-1">

            <template v-if="verifiedPage && mediaCodes">
                <div class="image-container aspect-square cursor-pointer" v-lazy:background-image="$imageUrl(mediaCodes[0])" @click.stop="openMedia(mediaCodes[0])"></div>
                <div class="flex" style="margin-top: 2px;">
                  <div class="image-container aspect-square cursor-pointer flex-1" style="margin-right: 2px;" v-lazy:background-image="$imageUrl(mediaCodes[1])" @click.stop="openMedia(mediaCodes[1])"></div>
                  <div class="image-container aspect-square cursor-pointer flex-1" v-lazy:background-image="$imageUrl(mediaCodes[2])" @click.stop="openMedia(mediaCodes[2])"></div>
                </div>
            </template>
            <template v-else>
              <div class="py-4 pr-4 text-sm text-gray-500" style="aspect-ratio: 2/3;">
                <div v-for="(pageInfoRow, i) in pageInfoRows" :key="pageInfoRow.value + i.toString()" class="flex items-start mb-1">
                  <span><i class="mr-2" :class="pageInfoRow.iconClass"></i></span>
                  <component :is="pageInfoRow.link ? 'a' : 'span'"
                             @click="stopPropagation($event, !!pageInfoRow.link)"
                             class="break-all"
                             :class="{'hover:underline': pageInfoRow.link}"
                             target="_blank"
                             :href="pageInfoRow.link">{{ pageInfoRow.value }}</component>
                </div>
              </div>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import {PropType} from "vue";
import dayjs from "dayjs";
import PageInfoRow from "~/models/PageInfoRow";
import {PageSearch} from "~/models/PageSearch";
import {useShowingMediaModalData, useShowMediaModal} from "~/composables/states";

const {tagsLookup} = useTags()
const {
  shop
} = defineProps({
  shop: Object as PropType<PageSearch>,
  showLocations: {type: Boolean, default: false}
})

const {
  _id,
  username,
  fullName,
  lastActivity,
  followerCount,
  mediaCount,
  mediaCodes,
  profilePicUrl,
  tags,
  locations,
  extraData,
  igConnected,
} = shop;
const lastActive = dayjs(lastActivity * 1000).format('DD/MM/YYYY');
const description = 'description';

const verifiedPage = igConnected;
const pageInfoRows = computed(() => PageInfoRow.rowsFromPage(shop).filter((r) => !["address", "whatsapp", "wechat", "signal", "email", "shopSince", "relatedPage"].includes(r.key)));

const contactInfoRows = computed(() => PageInfoRow.rowsFromExtraData(extraData, ["whatsapp", "wechat", "signal"]));
function contactColor(key: "whatsapp" | "wechat" | "signal") {
  switch (key) {
    case "whatsapp":
      return "25D366";
    case "wechat":
      return "09B83E";
    case "signal":
      return "2152A7";
  }
}
const addressInfoRow = computed(() => {
  const rows = PageInfoRow.rowsFromPage({
    businessRegistration: false,
    locations,
    extraData: {
      address: extraData.address
    }
  });
  return rows.length === 0 ? undefined : rows[0];
});

// Metrics.
function formatMetric(count: number | undefined) {
  if (!count)
    return "-"
  if (count >= 10000)
    return `${(Math.round(count / 100) / 10).toLocaleString()}k`
  return count.toLocaleString()
}

// Media interaction.
const showMediaModal = useShowMediaModal()
const showingMediaModalData = useShowingMediaModalData()
function openMedia(mediaCode: string) {
  showMediaModal.value = true;
  showingMediaModalData.value = {
    code: mediaCode,
    pageId: _id
  };
}

// Card base click.
function stopPropagation(e: Event, stop: boolean) {
  if (stop) {
    e.stopPropagation();
  }
}

function navigateToPage() {
  navigateTo(`/shop/${username}`);
}

</script>
