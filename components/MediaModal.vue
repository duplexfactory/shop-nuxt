<template>
  <LazyModal @close="close">
    <template #body>
      <div class="md:grid grid-cols-8 gap-8 pb-8 px-4">
        <div class="col-span-4">
          <template v-if="localPage">
            <template v-if="localPage.igConnected && localMedia">
              <div class="image-container aspect-square rounded-md overflow-hidden"
                   v-lazy:background-image="localMedia.mediaUrl || $imageUrl(localMedia.code, 'l')"></div>
              <div class="mt-2 hidden md:block text-sm whitespace-pre-wrap break-words">{{ stripTrailingHashtags(localMedia.caption) }}</div>
              <div v-if="!!mediaPrice(localMedia.media)"
                   class="mt-2 text-pink-700">
                {{ formatMediaPrice(mediaPrice(localMedia.media)) }}
              </div>
            </template>
            <MediaCardIGEmbed v-if="!localPage.igConnected && localMediaCode"
                              captioned
                              :post-id="localMediaCode"
                              :fixed-aspect-ratio="0"
                              :username="localPage.username"></MediaCardIGEmbed>
          </template>
        </div>
        <div class="col-span-4">
          <div class="mt-4 md:mt-0">

            <div class="flex items-baseline">
              <!-- Do not use ?? because price 0 should show - as well -->
              <div class="text-xl md:text-2xl text-pink-700">{{ formatMediaPrice(mediaPrice(localMedia)) }}</div>

              <Popper hover offsetDistance="0" placement="top">
                <button @click="showPriceSuggestionModal = true" class="ml-2 text-sm text-gray-500 underline decoration-dotted">提出修改</button>
                <template #content>
                  <div class="bg-gray-900/80 text-white text-sm p-2 rounded-md">此價格由電腦偵查或用戶提出。如有錯漏，歡迎提出修改。</div>
                </template>
              </Popper>
            </div>

            <nuxt-link v-if="localPage" class="hover:underline"  :to="`/shop/${localPage.username}`" @click="close">
              {{ localPage.username }}
            </nuxt-link>

            <div class="mt-2">
              <button class="btn btn-primary w-full" @click="showContactModal = true">
                聯絡店主下單
              </button>
            </div>

<!--            <div v-if="pageInfoRows.length !== 0" class="text-gray-500 text-xs mt-2">-->
<!--              <div v-for="(pageInfoRow, i) in pageInfoRows" :key="pageInfoRow.value + i.toString()" class="mb-1">-->
<!--                <i class="mr-2" :class="pageInfoRow.iconClass"></i>-->
<!--                <component :is="pageInfoRow.link ? 'a' : 'span'"-->
<!--                           class="break-words"-->
<!--                           :class="{'hover:underline': pageInfoRow.link}"-->
<!--                           target="_blank"-->
<!--                           :href="pageInfoRow.link">{{ pageInfoRow.value }}</component>-->
<!--              </div>-->
<!--            </div>-->

            <div v-if="localMediaCode && localPage && localPage.igConnected"
                 class="mt-4 md:hidden text-sm whitespace-pre-wrap break-words">
              {{ stripTrailingHashtags(localMedia.caption) }}
            </div>

            <div v-if="localPage" class="text-gray-400 mt-4 text-xs"><i>圖片、文字、資料來源: IG @ <a class="hover:underline" :href="`https://www.instagram.com/${localPage.username}/`" target="_blank">{{ localPage.username }}</a></i></div>
            <div class="text-gray-400 text-xs"><i>資料並沒有核實，或有錯漏，僅供參考。</i></div>

            <div class="flex items-center mt-4">
              <div class="text-xl md:text-2xl">評論</div>
              <button @click="isShowingCreateReview = true" class="ml-2 btn btn-sm btn-outline">撰寫評論</button>
            </div>

            <!-- Create Review -->
            <ReviewCreateCard v-model:show="isShowingCreateReview" isCollapsible v-model:rating="rating" v-model:content="content" :isCreatingReview="isCreatingReview" @create-review="sendReview()"></ReviewCreateCard>

            <!-- Reviews -->
            <template v-for="review in reviews">
              <ReviewCard :review="review"></ReviewCard>
              <hr/>
            </template>

            <!-- No Reviews -->
            <div v-if="reviews.length == 0" class="mt-2 p-6 bg-gray-100 rounded-md text-lg text-center">
              暫時沒有任何評論
            </div>

          </div>
        </div>
      </div>

      <Teleport to="body">
        <transition name="modal">
          <LazyModal v-if="showPriceSuggestionModal" @close="showPriceSuggestionModal = false">
            <template #container>
              <div class="bg-white p-4 rounded-md">
                <input v-model="suggestedPrice" class="block text-input-primary" type="number" name="price" placeholder="輸入價格">
                <div class="flex justify-end mt-2">
                  <button @click="submitPrice" class="btn-primary btn-sm mr-2">提交</button>
                  <button @click="showPriceSuggestionModal = false" class="btn-outline btn-sm">取消</button>
                </div>
              </div>
            </template>
          </LazyModal>
        </transition>
      </Teleport>


      <Teleport to="body">
        <transition name="modal">
          <LazyModal v-if="showContactModal" @close="showContactModal = false">
            <template #container>
              <div class="flex items-end h-full w-full" @click="showContactModal = false">
                <div v-if="pageInfoRows.length !== 0" class="bg-white p-4 rounded-t-md w-full text-gray-500">
                <div v-for="(pageInfoRow, i) in pageInfoRows" :key="pageInfoRow.value + i.toString()" class="py-2">
                  <i class="mr-2" :class="pageInfoRow.iconClass"></i>
                  <component :is="pageInfoRow.link ? 'a' : 'span'"
                             class="break-words"
                             :class="{'hover:underline': pageInfoRow.link}"
                             target="_blank"
                             :href="pageInfoRow.link">{{ pageInfoRow.value }}</component>
                </div>
                </div>
              </div>
            </template>
          </LazyModal>
        </transition>
      </Teleport>

    </template>
  </LazyModal>
</template>

<script setup lang="ts">

import IgPageReview from "~/models/IgPageReview";
import useCreateReview from "~/composables/useCreateReview";

import {useShowingMediaModalData, useShowMediaModal} from "~/composables/states";
import {computed} from "@vue/reactivity";
import PageInfoRow from "~/models/PageInfoRow";

import Popper from "vue3-popper";
import type {Ref} from "vue";
import IgMedia from "~/models/IgMedia";
import useMediaPrice from "~/composables/useMediaPrice";
import IgPage from "~/models/IgPage";
import IgPageExtraData from "~/models/IgPageExtraData";

// Media Modal
const showMediaModal = useShowMediaModal();
const showingMediaModalData = useShowingMediaModalData();

const fetchedPage = ref(null);
const localPage = computed<IgPage>(() => {
  return showingMediaModalData.value.simplePage || fetchedPage.value;
});

const localMediaCode = computed(() => {
  return showingMediaModalData.value.media?.code || showingMediaModalData.value.code;
});
const fetchedMedia: Ref<IgMedia | null> = ref(null);
const localMedia = computed(() => {
  return showingMediaModalData.value.media || fetchedMedia.value;
});

const pageInfoRows = computed(() => {
  if (!localPage.value) return []

  const fields: (keyof IgPageExtraData)[] = ["whatsapp", "wechat", "signal"]
  if (!localPage.value.extraData || !localPage.value.extraData.noPhoneCall) {
    fields.unshift("phone");
  }
  return PageInfoRow.rowsFromExtraData(localPage.value.extraData, fields);
});

function stripTrailingHashtags(s: string): string {
  return s.replace(/(?:[\n\r\s]*[#][^\n\r\s]+)+[\n\r\s]*$/i, "");
}

// Media Price
const { mediaPrice, formatMediaPrice } = useMediaPrice();

// Create Review
const {
  reviewingCode,
  reviewingPageId,
  isCreatingReview,
  rating,
  content,
  createReview,
  resetCreateReview
} = useCreateReview();
const isShowingCreateReview = ref<boolean>(false);
reviewingCode.value = localMediaCode.value;
reviewingPageId.value = showingMediaModalData.value.simplePage?._id || showingMediaModalData.value.pageId;

const reviews = ref<IgPageReview[]>([]);

async function fetchReviews() {
  reviews.value = (await $fetch('/api/reviews', { method: 'GET', params: {
      mediaCode: localMediaCode.value,
    }}))['reviews'];
}

async function sendReview() {
  await createReview();
  isShowingCreateReview.value = false;
  await fetchReviews();
}

function close() {
  resetCreateReview();
  isShowingCreateReview.value = false;
  reviews.value = [];

  showMediaModal.value = false;
}

const router = useRouter();
function onUsernameClick() {
  router.push(`/shop/${localPage.value.username}`);
  close();
}

const screenSize = useScreenSize();

// Suggest price
const showPriceSuggestionModal = ref(false);
const suggestedPrice = ref(null);
const nuxt = useNuxtApp();
async function submitPrice() {
  if (suggestedPrice.value === null) {
    nuxt.vueApp.$toast.error("請輸入價格！", {position: "top"});
    return;
  }

  const body: any = {
    code: localMediaCode.value,
    price: suggestedPrice.value
  };
  await useFetch('/api/suggest/media-price', { method: 'POST', body})

  // Reset
  suggestedPrice.value = null;

  nuxt.vueApp.$toast.success("已成功提交，感謝你的建議，我們將儘快處理。", {position: "top"});
  showPriceSuggestionModal.value = false;
}

// Contact
const showContactModal = ref(false);

// Mounted
onMounted(async () => {

  // Init data on modal open
  if (!localMedia.value) {
    const {data, pending} = await useFetch(`/api/media/${localMediaCode.value}`);
    fetchedMedia.value = data.value.media;
  }

  if (!localPage.value) {
    const {data, error} = await useFetch(`/api/shop/id/${showingMediaModalData.value.pageId}`);
    fetchedPage.value = data.value.page;
  }
  await fetchReviews();
});

</script>
