<template>
  <LazyModal @close="close">
    <template v-slot:body>
      <div class="md:grid grid-cols-8 gap-8 pb-8 px-4">
        <div class="col-span-4">
          <MediaCardIGEmbed v-if="localMediaCode && localPage" captioned :post-id="localMediaCode" :fixed-aspect-ratio="0" :username="localPage.username"></MediaCardIGEmbed>
        </div>
        <div class="col-span-4">
          <div class="mt-4 md:mt-0">

            <div class="flex items-baseline">
              <!-- Do not use ?? because price 0 should show - as well -->
              <div class="text-xl md:text-2xl text-pink-700">HK$ {{ localMedia?.price ? localMedia?.price : "-" }}</div>

              <Popper hover offsetDistance="0" placement="top">
                <button @click="showPriceSuggestionModal = true" class="ml-2 text-sm text-gray-500 underline decoration-dotted">提出修改</button>
                <template #content>
                  <div class="bg-gray-900/80 text-white text-sm p-2 rounded-md">此價格由電腦偵查或用戶提出。如有錯漏，歡迎提出修改。</div>
                </template>
              </Popper>
            </div>

            <button v-if="localPage" class="hover:underline" @click="onUsernameClick">
              {{ localPage.username }}
            </button>

            <div v-if="pageInfoRows.length !== 0" class="text-gray-500 text-xs mt-2">
              <div v-for="(pageInfoRow, i) in pageInfoRows" :key="pageInfoRow.value + i.toString()" class="mb-1">
                <i class="mr-2" :class="pageInfoRow.iconClass"></i>
                <component :is="pageInfoRow.link ? 'a' : 'span'"
                           class="break-words"
                           :class="{'hover:underline': pageInfoRow.link}"
                           target="_blank"
                           :href="pageInfoRow.link">{{ pageInfoRow.value }}</component>
              </div>
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
        <div v-if="showPriceSuggestionModal" class="suggest-price-modal">
            <div class="bg-white p-4 rounded-md">
              <input v-model="suggestedPrice" class="block text-input-primary" type="number" name="price" placeholder="輸入價格">
              <div class="flex justify-end mt-2">
                <button @click="submitPrice" class="btn-primary btn-sm mr-2">提交</button>
                <button @click="showPriceSuggestionModal = false" class="btn-outline btn-sm">取消</button>
              </div>
            </div>
        </div>
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

// Media Modal
const showMediaModal = useShowMediaModal();
const showingMediaModalData = useShowingMediaModalData();

const fetchedPage = ref(null);
const localPage = computed(() => {
  return showingMediaModalData.value.simplePage || fetchedPage.value;
});

const localMediaCode = computed(() => {
  return showingMediaModalData.value.media?.code || showingMediaModalData.value.code;
});
const fetchedMedia = ref(null);
const localMedia = computed(() => {
  return showingMediaModalData.value.media || fetchedMedia.value;
});

const pageInfoRows = computed(() => {
  if (!localPage.value) return []
  return PageInfoRow.rowsFromExtraData(localPage.value.extraData, ["phone", "whatsapp", "wechat", "signal"]);
});

// Create Review
const {
  reviewingCode,
  reviewingPagePk,
  isCreatingReview,
  rating,
  content,
  createReview,
  resetCreateReview
} = useCreateReview();
const isShowingCreateReview = ref<boolean>(false);
reviewingCode.value = localMediaCode.value;
reviewingPagePk.value = showingMediaModalData.value.simplePage?.pk || showingMediaModalData.value.pagePk;

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

// Init data on modal open
if (!localMedia.value) {
  const {data, pending} = await useFetch(`/api/media/single`, {params: {code: localMediaCode.value}});
  fetchedMedia.value = data.value.media;
}

// Mounted
onMounted(async () => {
  if (!localPage.value) {
    const {data, error} = await useFetch(`/api/shop`, {params: {id: showingMediaModalData.value.pagePk}});
    fetchedPage.value = data.value.page;
  }
  await fetchReviews();
});

</script>

<style scoped>

.suggest-price-modal {
  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.5);
  @apply w-full h-full fixed top-0 left-0 flex items-center justify-center;
}

</style>
