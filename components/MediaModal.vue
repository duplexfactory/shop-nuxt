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
              <button class="ml-2 text-sm text-gray-500 underline decoration-dotted">提出修改</button>
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
    </template>
  </LazyModal>
</template>

<script setup lang="ts">

import IgPageReview from "~/models/IgPageReview";
import useCreateReview from "~/composables/useCreateReview";

import {useShowingMediaModalData, useShowMediaModal} from "~/composables/states";
import {computed} from "@vue/reactivity";
import PageInfoRow from "~/models/PageInfoRow";

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

// Init data on modal open
if (!localMedia.value) {
  const {data, pending} = await useFetch(`/api/media/${localMediaCode.value}`);
  fetchedMedia.value = data.value.media;
}


// Mounted
onMounted(async () => {
  if (!localPage.value) {
    const {data, error} = await useFetch(`/api/shop/id/${showingMediaModalData.value.pagePk}`);
    fetchedPage.value = data.value.page;
  }
  await fetchReviews();
});

</script>
