<template>
    <div class="overflow-hidden border rounded-md grid grid-cols-2">
        <div class="p-4 col-span-1">
            <div class="relative h-full">
                <div v-if="verifiedPage" class="hidden sm:block mb-1 2xl:mb-2 rounded-full image-container aspect-square" v-lazy:background-image="profilePicUrl" style="height: 60px;"></div>

                <div class="overflow-hidden">
                  <div class="font-semibold text-lg truncate">
                    <a class="hover:underline" :href="`https://www.instagram.com/${username}/`" target="_blank">{{ username }}</a>
                  </div>
                  <div v-if="verifiedPage" class="text-gray-500 text-xs line-clamp-2">{{ fullName }}</div>
                </div>

                <div v-if="contactInfoRows.length !== 0">
                  <a v-for="(pageInfoRow, i) in contactInfoRows"
                     :key="pageInfoRow.value + i.toString()"
                     :href="pageInfoRow.link"
                     target="_blank">
                    <i class="mr-1"
                       :style="`color: #${contactColor(pageInfoRow.key)}`"
                       :class="pageInfoRow.iconClass"></i>
                  </a>
                </div>

                <div class="mt-2 2xl:mt-4 line-clamp-2"
                     style="font-size: 0;">
                  <div v-for="tag in tags"
                       :key="tag"
                       class="tag mr-1 2xl:mr-2">{{ `#${tagsLookup[tag]}` }}</div>
                </div>

                <div v-if="showLocations && addressInfoRow" class="mt-2 2xl:mt-4 text-sm text-gray-500 flex items-start">
                  <span><i class="mr-2" :class="addressInfoRow.iconClass"></i></span>
                  <component :is="addressInfoRow.link ? 'a' : 'span'"
                             class="break-all"
                             :class="{'hover:underline': addressInfoRow.link}"
                             target="_blank"
                             :href="addressInfoRow.link">
                    <span v-if="addressInfoRow.link" class="md:hidden">查看地址</span>
                    <span :class="addressInfoRow.link ? 'hidden md:inline-block' : ''">{{ addressInfoRow.value }}</span>
                  </component>
                </div>

                <!-- Online show followers -->
                <div v-else class="mt-2 2xl:mt-4 text-sm text-gray-500 flex flex-row">
                    <div v-if="followerCount" class="text-center flex-1">
                        <div>粉絲</div>
                        <div>{{ followerCount.toLocaleString() }}</div>
                    </div>
                    <div class="bg-gray-300 mx-2" style="width: 1px;"></div>
                    <div class="text-center flex-1">
                        <div>貼文</div>
                        <div>{{ mediaCount.toLocaleString() }}</div>
                    </div>
                </div>

                <nuxt-link :to="`/shop/${username}`"
                           class="absolute block mt-2 2xl:mt-4 btn-outline btn-primary-hover btn-sm sm:btn" style="bottom: 0px;">進入店鋪</nuxt-link>
            </div>
        </div>

        <div class="col-span-1" v-if="mediaCodes">
            <template v-if="verifiedPage">
                <div class="image-container aspect-square" v-lazy:background-image="$imageUrl(mediaCodes[0])"></div>
                <div class="flex" style="margin-top: 2px;">
                  <div class="image-container aspect-square flex-1" style="margin-right: 2px;" v-lazy:background-image="$imageUrl(mediaCodes[1])"></div>
                  <div class="image-container aspect-square flex-1" v-lazy:background-image="$imageUrl(mediaCodes[2])"></div>
                </div>
            </template>
            <template v-else>
              <div class="py-4 pr-4 text-sm text-gray-500" style="aspect-ratio: 2/3;">
                <div v-for="(pageInfoRow, i) in pageInfoRows" :key="pageInfoRow.value + i.toString()" class="flex items-start mb-1">
                  <span><i class="mr-2" :class="pageInfoRow.iconClass"></i></span>
                  <component :is="pageInfoRow.link ? 'a' : 'span'"
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
import IgPage from '~/models/IgPage';
import dayjs from "dayjs";
import PageInfoRow from "~/models/PageInfoRow";

const {tagsLookup} = useTags()
const {shop} = defineProps({
  shop: Object as PropType<IgPage>,
  showLocations: {type: Boolean, default: false}
})

const {
  _id,
  username,
  fullName,
  lastActivity,
  followerCount,
  mediaCount,
  mediaUrls,
  mediaCodes,
  profilePicUrl,
  tags,
  locations,
  extraData
} = shop;
const lastActive = dayjs(lastActivity * 1000).format('DD/MM/YYYY');
const description = 'description';

const verifiedPage = false;
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

</script>
